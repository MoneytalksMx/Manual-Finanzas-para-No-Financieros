// Pruebas del vocero único con una base de datos simulada (no toca Supabase).
// Cómo correrlas, desde la raíz del repositorio:
//   python3 -m http.server 8765        (en otra terminal)
//   node caja/pruebas/vocero.test.js   (necesita Playwright con Chromium)
// Cada contexto de navegador hace de un celular distinto, con su propio id.
const { chromium } = require('playwright');
// Base de datos simulada: imita la API de Supabase (PostgREST) con filtros eq, is.null y or
const DB = { caja_partidas: [], caja_mesas: [], caja_envios: [], caja_jugadores: [] };
const KEY = { caja_partidas: ['codigo'], caja_mesas: ['partida', 'mesa'], caja_jugadores: ['partida', 'dispositivo'] };
function cond(k, expr) { const [op, ...rest] = expr.split('.'); const v = rest.join('.');
  if (op === 'eq') return r => String(r[k]) === v; if (op === 'is' && v === 'null') return r => r[k] == null; return () => true; }
function filt(u) { const f = [];
  for (const [k, v] of u.searchParams) {
    if (['select', 'order', 'on_conflict', 'columns', 'limit'].includes(k)) continue;
    if (k === 'or') { const parts = v.replace(/^\(|\)$/g, '').split(','); const cs = parts.map(p => { const i = p.indexOf('.'); return cond(p.slice(0, i), p.slice(i + 1)); }); f.push(r => cs.some(c => c(r))); }
    else f.push(cond(k, v)); }
  return r => f.every(c => c(r)); }
async function mock(route) {
  const req = route.request(), u = new URL(req.url()), t = u.pathname.split('/').pop(), T = DB[t], acc = req.headers()['accept'] || '', pref = req.headers()['prefer'] || '';
  let out = [], st = 200;
  if (req.method() === 'GET') { out = T.filter(filt(u)); const o = u.searchParams.get('order'); if (o) { const c = o.split('.')[0]; out.sort((a, b) => String(a[c]).localeCompare(String(b[c]), 'es', { numeric: true })); } }
  else if (req.method() === 'POST') { let rows = JSON.parse(req.postData()); if (!Array.isArray(rows)) rows = [rows];
    for (const r of rows) { const k = KEY[t]; const ex = k && T.find(x => k.every(c => x[c] === r[c]));
      if (t === 'caja_mesas') { r.updated_at = r.updated_at || new Date().toISOString(); r.vocero_id = r.vocero_id ?? null; }
      if (t === 'caja_envios' && !r.created_at) r.created_at = new Date().toISOString();
      if (ex) { if (pref.includes('merge')) Object.assign(ex, r); } else T.push(r); }
    st = 201; out = rows; }
  else if (req.method() === 'PATCH') { const p = JSON.parse(req.postData()); out = T.filter(filt(u)); out.forEach(r => Object.assign(r, p)); }
  else if (req.method() === 'DELETE') { const f = filt(u); for (let i = T.length - 1; i >= 0; i--) if (f(T[i])) T.splice(i, 1); st = 204; }
  if (acc.includes('vnd.pgrst.object')) { if (out.length !== 1) return route.fulfill({ status: 406, contentType: 'application/json', body: JSON.stringify({ message: 'no rows', code: 'PGRST116' }) }); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(out[0]) }); }
  if (st === 204) return route.fulfill({ status: 204, body: '' });
  return route.fulfill({ status: st, contentType: 'application/json', headers: { 'content-range': '0-' + out.length + '/*' }, body: JSON.stringify(out) });
}
const R = []; const ok = (n, c, d = '') => { R.push(`${c ? 'PASA' : 'FALLA'} · ${n}${d ? ' · ' + d : ''}`); };
const URL0 = process.env.CAJA_URL || 'http://localhost:8765/caja/';
(async () => {
  const b = await chromium.launch();
  const mk = async (w = 390, h = 844) => { const c = await b.newContext({ viewport: { width: w, height: h } }); await c.route(/supabase\.co/, mock); await c.route(/fonts\.(googleapis|gstatic)/, r => r.abort()); const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); return p; };
  const F = await mk(1280, 900);
  await F.goto(URL0 + '?modo=facilitador'); await F.waitForTimeout(800); await F.click('#slots'); await F.keyboard.type('201126'); await F.waitForTimeout(2500);
  await F.fill('#cod', 'PRUEBA'); await F.click('#reset'); await F.waitForTimeout(1200);
  const entrar = async (p, nombre, eq, rol, click = true) => { await p.goto(URL0 + '?p=PRUEBA'); await p.waitForTimeout(600); await p.fill('#nombre', nombre); await p.click(`[data-m="${eq}"]`); await p.click(`[data-r="${rol}"]`); if (click) { await p.click('#entrar'); await p.waitForTimeout(1500); } };
  const texto = p => p.locator('#app').innerText();
  // 1. Dos celulares eligen vocero: solo el primero queda
  const ana = await mk(), beto = await mk();
  await entrar(ana, 'Ana', 1, 'Vocero'); await entrar(beto, 'Beto', 1, 'Vocero');
  const tb = await texto(beto);
  ok('1. Segundo vocero rechazado', tb.includes('Ana ya tiene el rol de vocero en Los Politos. Elige otro rol.') && await beto.locator('#entrar').count() === 1, tb.split('\n').find(l => l.includes('vocero de')) || '');
  await beto.click('[data-r="Moderador"]'); await beto.click('#entrar'); await beto.waitForTimeout(1500);
  ok('1b. Entra como moderador sin formulario', await beto.locator('#enviar').count() === 0 && (await texto(beto)).includes('Moderador'));
  // 2. Dos registros en el mismo segundo
  const c1 = await mk(), c2 = await mk();
  await entrar(c1, 'Caro', 2, 'Vocero', false); await entrar(c2, 'Dani', 2, 'Vocero', false);
  await Promise.all([c1.click('#entrar'), c2.click('#entrar')]); await c1.waitForTimeout(1800);
  const m2 = DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 2);
  const v1 = (await c1.locator('#enviar').count()) + (await texto(c1)).includes('Esperen') , dentro = [await c1.locator('#entrar').count(), await c2.locator('#entrar').count()];
  ok('2. Mismo segundo: un solo vocero', !!m2.vocero_id && dentro.filter(x => x === 1).length === 1, `vocero=${DB.caja_jugadores.find(j => j.dispositivo === m2.vocero_id)?.nombre}`);
  // abrir mes 1 para que exista formulario
  await F.click('#abrir'); await ana.waitForTimeout(3500);
  ok('3a. Vocero ve formulario; moderador no', await ana.locator('#enviar').count() === 1 && await beto.locator('#enviar').count() === 0);
  // 3b. envío forzado desde el moderador
  await beto.evaluate(() => { mesa.vocero_id = DISPOSITIVO; vistaMesa(); });
  for (const [id, v] of [['lotes', 3], ['pide', 0], ['cobros', 30], ['proveedor', 12], ['cajaFinal', 15], ['utilidad', 10]]) await beto.fill('#' + id, String(v));
  const antes = DB.caja_envios.length; await beto.click('#enviar'); await beto.waitForTimeout(1500);
  const m1 = DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 1);
  ok('3b. Envío forzado rechazado', (await texto(beto)).includes('Este celular ya no es el vocero del equipo. El envío no se guardó.') && DB.caja_envios.length === antes && m1.estado.mesCompleto === 0);
  // 5. El vocero recarga la página
  await ana.reload(); await ana.waitForTimeout(2500);
  ok('5. Vocero sigue tras recargar', await ana.locator('#enviar').count() === 1);
  // vocero envía mes 1
  for (const [id, v] of [['lotes', 3], ['pide', 0], ['cobros', 30], ['proveedor', 12], ['cajaFinal', 15], ['utilidad', 10]]) await ana.fill('#' + id, String(v));
  await ana.click('#enviar'); await ana.waitForTimeout(1500);
  ok('3c. Envío del vocero sí se guarda', DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 1).estado.mesCompleto === 1);
  // 4. El facilitador cambia al vocero: Ana → Beto
  await F.waitForTimeout(3500); await F.click('[data-gestion="1"]'); await F.waitForTimeout(300);
  await F.click('#cand [data-d] >> text=Beto'); await F.waitForTimeout(300); await F.click('#asignar'); await F.waitForTimeout(500);
  await ana.waitForTimeout(3600); await beto.waitForTimeout(500);
  const ta = await texto(ana), tb2 = await texto(beto);
  ok('4. Cambio de vocero', ta.includes('El facilitador cambió al vocero de tu equipo. Ahora estás como integrante.') && tb2.includes('El facilitador te asignó como vocero'), `Ana formulario=${await ana.locator('#enviar').count()}, Beto ve aviso=${tb2.includes('asignó')}`);
  await F.click('#abrir'); await beto.waitForTimeout(3600);
  ok('4b. Nuevo vocero puede enviar, anterior no', await beto.locator('#enviar').count() === 1 && await ana.locator('#enviar').count() === 0);
  // 6. Reiniciar
  await F.click('#reset'); await F.waitForTimeout(300); await F.click('#reset'); await F.waitForTimeout(1500);
  const sinVoc = DB.caja_mesas.filter(m => m.partida === 'PRUEBA').every(m => !m.vocero_id) && DB.caja_jugadores.filter(j => j.partida === 'PRUEBA').length === 0;
  await ana.waitForTimeout(3500);
  ok('6. Reiniciar deja equipos sin vocero', sinVoc && await ana.locator('#nombre').count() === 1);
  // 8. 390 px sin corte
  const anchos = []; for (const p of [ana, beto, c1, c2]) anchos.push(await p.evaluate(() => document.documentElement.scrollWidth));
  ok('8. A 390 px no hay desplazamiento lateral', anchos.every(w => w <= 390), anchos.join(', '));
  console.log(R.join('\n'));
  await b.close();
})();
