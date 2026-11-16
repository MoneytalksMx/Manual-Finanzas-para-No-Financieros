// Prueba de la gráfica «Errores en el primer intento» con una base de datos simulada (no toca Supabase).
// Desde la raíz del repositorio: python3 -m http.server 8765 (en otra terminal) y luego node caja/pruebas/errores.test.js
// Resultado esperado: Cobros 1 de 10, Proveedor 2 de 10 (resaltada), Caja final 1 de 10, Utilidad 1 de 10.
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
const URL0 = process.env.CAJA_URL || 'http://localhost:8765/caja/';
(async () => {
  const b = await chromium.launch();
  const mk = async (w = 390, h = 844) => { const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w === 390 ? 2 : 1 }); await c.route(/supabase\.co/, mock); await c.route(/fonts\.(googleapis|gstatic)/, r => r.abort()); const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); return p; };
  const F = await mk(1280, 900);
  await F.goto(URL0 + '?modo=facilitador'); await F.waitForTimeout(800); await F.click('#slots'); await F.keyboard.type('201126'); await F.waitForTimeout(2500);
  await F.fill('#cod', 'PRUEBA'); await F.click('#reset'); await F.waitForTimeout(500); if (await F.locator('text=Confirmar').count()) await F.click('#reset'); await F.waitForTimeout(1200);
  const join = async (eq) => { const p = await mk(); await p.goto(URL0 + '?p=PRUEBA'); await p.waitForTimeout(600); await p.click(`[data-m="${eq}"]`); await p.click('[data-r="Vocero"]'); await p.click('#entrar'); await p.waitForTimeout(1200); return p; };
  const A = await join(3), P = await join(1), M = await mk(); await M.goto(URL0 + '?p=PRUEBA'); await M.waitForTimeout(600); await M.click('[data-m="1"]'); await M.click('[data-r="Moderador"]'); await M.click('#entrar');
  const plan = [[3,0,30,12,15,10],[4,0,30,12,23,14],[10,0,30,16,15,38],[10,10,40,40,3,38],[10,0,100,40,30,37]];
  const send = async (p, mes, over = {}, dev = 0) => { const [l, pi, c, pr, cf, u] = plan[mes - 1]; const v = Object.assign({ lotes: l, pide: pi, devuelve: mes === 5 ? 10 : dev, cobros: c, proveedor: pr, cajaFinal: cf, utilidad: u }, over);
    for (const k of Object.keys(v)) if (await p.locator('#' + k).count()) await p.fill('#' + k, String(v[k])); await p.click('#enviar'); await p.waitForTimeout(1200); };
  for (let mes = 1; mes <= 5; mes++) {
    await F.click('#abrir'); await A.waitForTimeout(3500);
    if (mes === 2) { await send(A, 2, { cajaFinal: 99 }); await send(A, 2); } else await send(A, mes);
    if (mes === 1) { await send(P, 1, { cobros: 60 }); await send(P, 1); }
    else if (mes === 3) { await send(P, 3, { utilidad: 40, proveedor: 20 }); await send(P, 3); }
    else if (mes === 4) { await send(P, 4, { pide: 0 }); await send(P, 4); }
    else if (mes === 5) { const e = DB.caja_envios.find(x => x.mesa === 1 && x.mes === 3 && x.intento === 1); e.fallos = []; await send(P, 5, { proveedor: 44 }); await send(P, 5); }
    else await send(P, mes);
  }
  const prim = DB.caja_envios.filter(e => e.intento === 1).length;
  console.log('primeros intentos en BD:', prim, '· bloqueados guardados:', DB.caja_envios.filter(e => e.mes === 4 && e.mesa === 1).length);
  await F.click('#vis'); await F.waitForTimeout(3500); await M.waitForTimeout(3500);
  const tf = await F.locator('.err-chart').innerText(); const tm = await M.locator('.err-chart').innerText();
  console.log('FAC:', tf.replace(/\n+/g, ' | ')); console.log('CEL:', tm.replace(/\n+/g, ' | '));
  console.log('top:', await F.locator('.err-row.top .err-lab').allInnerTexts());
  console.log('ancho cel:', await M.evaluate(() => document.documentElement.scrollWidth));
  await b.close();
})();
