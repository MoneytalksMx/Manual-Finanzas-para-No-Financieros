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
  const entrar = async (p, nombre, eq, rol, click = true) => { await p.goto(URL0 + '?p=PRUEBA'); await p.waitForTimeout(600); await p.fill('#nombre', nombre); await p.click(`[data-m="${eq}"]`); await p.click(`[data-r="${rol}"]`); if (click) { await p.click('#entrar'); await p.click('#si-entrar'); await p.waitForTimeout(1500); } };
  const texto = p => p.locator('#app').innerText();
  // 1. Dos celulares eligen vocero: solo el primero queda
  const ana = await mk(), beto = await mk();
  await entrar(ana, 'Ana', 1, 'Vocero'); await entrar(beto, 'Beto', 1, 'Vocero');
  const tb = await texto(beto);
  ok('1. Segundo vocero rechazado', tb.includes('Ana ya tiene el rol de vocero en Los Politos. Elige otro rol.') && await beto.locator('#entrar').count() === 1, tb.split('\n').find(l => l.includes('vocero de')) || '');
  await beto.click('[data-r="Moderador"]'); await beto.click('#entrar'); await beto.click('#si-entrar'); await beto.waitForTimeout(1500);
  ok('1b. Entra como moderador sin formulario', await beto.locator('#enviar').count() === 0 && (await texto(beto)).includes('Moderador'));
  // 2. Dos registros en el mismo segundo
  const c1 = await mk(), c2 = await mk();
  await entrar(c1, 'Caro', 2, 'Vocero', false); await entrar(c2, 'Dani', 2, 'Vocero', false);
  await c1.click('#entrar'); await c2.click('#entrar'); await Promise.all([c1.click('#si-entrar'), c2.click('#si-entrar')]); await c1.waitForTimeout(1800);
  const m2 = DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 2);
  const v1 = (await c1.locator('#enviar').count()) + (await texto(c1)).includes('Esperen') , dentro = [await c1.locator('#entrar').count(), await c2.locator('#entrar').count()];
  ok('2. Mismo segundo: un solo vocero', !!m2.vocero_id && dentro.filter(x => x === 1).length === 1, `vocero=${DB.caja_jugadores.find(j => j.dispositivo === m2.vocero_id)?.nombre}`);
  // 14. No se puede abrir el mes 1 hasta que los cinco equipos tengan vocero
  await F.waitForTimeout(3500);
  const bloq1 = await F.locator('#abrir').isDisabled(), avisoF = await F.locator('#app').innerText();
  const gabo = await mk(); await entrar(gabo, 'Gabo', 3, 'Vocero');
  const hugo = await mk(); await entrar(hugo, 'Hugo', 4, 'Vocero');
  await F.waitForTimeout(3500);
  const bloq2 = await F.locator('#abrir').isDisabled(), avisoF2 = await F.locator('#app').innerText();
  const iris = await mk(); await entrar(iris, 'Iris', 5, 'Vocero');
  await F.waitForTimeout(3500);
  ok('14. El mes 1 se abre solo con los cinco voceros', bloq1 && avisoF.includes('Actirent Envases, Equipo Dinamita, Los rentables') && bloq2 && avisoF2.includes('Falta: Los rentables') && !(await F.locator('#abrir').isDisabled()));
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
  // 9. Confirmación al entrar
  const eva = await mk(); await entrar(eva, 'Eva', 2, 'Vocero', false); await eva.click('#entrar');
  const conf = await eva.locator('#paso-entrar').innerText();
  await eva.click('#no-entrar'); await eva.waitForTimeout(300);
  ok('9. Pide confirmar equipo y rol', conf.includes('Vas a entrar a Osos EUM como vocero') && await eva.locator('#entrar').count() === 1);
  // 10. Equipo equivocado: la persona se corrige sola desde la liga de arriba
  const v5 = () => DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 5).vocero_id;
  const tenia = !!v5();
  await iris.click('#salir-arriba'); await iris.waitForTimeout(300); await iris.click('[data-m="3"]'); await iris.click('[data-r="Moderador"]'); await iris.click('#entrar'); await iris.click('#si-entrar'); await iris.waitForTimeout(1500);
  ok('10. Se cambia sola de equipo y libera el vocero del equipo equivocado', tenia && !v5() && (await texto(iris)).includes('Actirent Envases') && await iris.locator('#enviar').count() === 0);
  // 11. El facilitador mueve a un jugador de equipo
  await F.waitForTimeout(3500); await F.click('[data-gestion="1"]'); await F.waitForTimeout(300);
  const anaId = DB.caja_jugadores.find(j => j.nombre === 'Ana').dispositivo;
  await F.selectOption(`select[data-mover="${anaId}"]`, '3'); await F.waitForTimeout(800);
  await ana.waitForTimeout(3800);
  const tAna = await texto(ana);
  ok('11. El facilitador mueve a Ana a Actirent Envases', tAna.includes('El facilitador te cambió a Actirent Envases') && DB.caja_jugadores.find(j => j.nombre === 'Ana').mesa === 3);
  // 12. Deshacer el último mes de un equipo
  await F.click('#cancelar-gestion'); await F.waitForTimeout(3500);
  const est1 = () => DB.caja_mesas.find(m => m.partida === 'PRUEBA' && m.mesa === 1).estado;
  const antesH = est1().historial.length, antesP = est1().puntos;
  await F.click('[data-gestion="1"]'); await F.waitForTimeout(300); await F.click('#deshacer'); await F.waitForTimeout(200);
  if (process.env.CAPTURAS) await F.screenshot({ path: process.env.CAPTURAS + '/admin.png', fullPage: true });
  await F.click('#deshacer-ok'); await F.waitForTimeout(1200);
  const marc = DB.caja_envios.filter(e => e.partida === 'PRUEBA' && e.mesa === 1 && e.mes === 1);
  ok('12. Deshacer el mes 1 de Los Politos', antesH === 1 && est1().historial.length === 0 && est1().puntos === 0 && est1().caja === 5 && marc.length > 0 && marc.every(e => e.deshecho), `antes ${antesH} mes y ${antesP} puntos`);
  await beto.waitForTimeout(3500);
  ok('12b. El vocero puede volver a enviar el mes 1', await beto.locator('#enviar').count() === 1 && (await beto.locator('#enviar').innerText()).includes('mes 1'));
  // 13. Borrar un intento pendiente
  for (const [id, v] of [['lotes', 3], ['pide', 0], ['cobros', 99], ['proveedor', 12], ['cajaFinal', 15], ['utilidad', 10]]) await beto.fill('#' + id, String(v));
  await beto.click('#enviar'); await beto.waitForTimeout(1200);
  const conPend = !!est1().pendiente;
  await F.click('#cancelar-gestion'); await F.waitForTimeout(3500); await F.click('[data-gestion="1"]'); await F.waitForTimeout(300); await F.click('#deshacer'); await F.click('#deshacer-ok'); await F.waitForTimeout(1200);
  ok('13. Borrar el intento pendiente', conPend && !est1().pendiente && est1().historial.length === 0);
  await F.click('#cancelar-gestion');
  // 6. Reiniciar
  await F.click('#reset'); await F.waitForTimeout(300); await F.click('#reset'); await F.waitForTimeout(1500);
  const sinVoc = DB.caja_mesas.filter(m => m.partida === 'PRUEBA').every(m => !m.vocero_id) && DB.caja_jugadores.filter(j => j.partida === 'PRUEBA').length === 0;
  await ana.waitForTimeout(3500);
  ok('6. Reiniciar deja equipos sin vocero', sinVoc && await ana.locator('#nombre').count() === 1);
  // 8. 390 px sin corte
  const anchos = []; for (const p of [ana, beto, c1, c2, iris]) anchos.push(await p.evaluate(() => document.documentElement.scrollWidth));
  ok('8. A 390 px no hay desplazamiento lateral', anchos.every(w => w <= 390), anchos.join(', '));
  console.log(R.join('\n'));
  await b.close();
})();
