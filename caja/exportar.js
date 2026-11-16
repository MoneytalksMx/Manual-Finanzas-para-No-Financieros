// Reporte descargable de una partida de «La caja de la planta».
(function (root) {
  const CAMPOS = { cobros: 'Cobros', proveedor: 'Pago al proveedor', cajaFinal: 'Caja final', utilidad: 'Utilidad' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => (n < 0 ? '−$' : '$') + Math.abs(n);
  const fecha = d => d.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });
  const hora = d => new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  function bono(mesas) {
    const term = mesas.filter(m => m.estado.mesCompleto === 5);
    if (!term.length) return {};
    const max = Math.max(...term.map(m => m.estado.utilidadAcum));
    const out = {}; term.forEach(m => { if (m.estado.utilidadAcum === max) out[m.mesa] = 3; }); return out;
  }

  function barras(mesas, EQ) {
    const W = 760, H = 320, pad = 44, vals = mesas.flatMap(m => [m.estado.utilidadAcum, m.estado.caja]);
    const max = Math.max(10, ...vals), gw = (W - pad * 2) / Math.max(1, mesas.length), bw = Math.min(44, gw / 3);
    const y = v => H - pad - (Math.max(0, v) / max) * (H - pad * 2 - 10);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Utilidad acumulada contra caja final por equipo"><line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" stroke="#BDB9B2"/>`;
    mesas.forEach((m, i) => {
      const x = pad + i * gw + gw / 2, u = m.estado.utilidadAcum, c = m.estado.caja;
      s += `<rect x="${x - bw - 3}" y="${y(u)}" width="${bw}" height="${H - pad - y(u)}" fill="#262626" rx="3"/><text x="${x - bw / 2 - 3}" y="${y(u) - 6}" text-anchor="middle" font-size="14" font-weight="700">${money(u)}</text>`;
      s += `<rect x="${x + 3}" y="${y(c)}" width="${bw}" height="${H - pad - y(c)}" fill="#AA1124" rx="3"/><text x="${x + bw / 2 + 3}" y="${y(c) - 6}" text-anchor="middle" font-size="14" font-weight="700" fill="#AA1124">${money(c)}</text>`;
      s += `<text x="${x}" y="${H - pad + 22}" text-anchor="middle" font-size="13" font-weight="600">${esc(EQ[m.mesa][0])}</text>`;
    });
    return s + '</svg><p class="leyenda"><span class="dot" style="background:#262626"></span>Utilidad acumulada <span class="dot" style="background:#AA1124"></span>Caja al final del mes 5</p>';
  }

  function lineas(mesas, EQ) {
    const W = 760, H = 330, x0 = 56, x1 = 560, y0 = 24, yb = 280;
    const serie = m => [{ mes: 0, v: 5 }].concat(m.estado.historial.map(h => ({ mes: h.mes, v: h.resultado.cajaFinal })));
    const con = mesas.filter(m => m.estado.historial.length);
    if (!con.length) return '<p class="nota">Ningún equipo envió meses.</p>';
    const vals = con.flatMap(m => serie(m).map(p => p.v));
    const lo = Math.min(0, ...vals), hi = Math.max(10, ...vals);
    const x = mes => x0 + mes * (x1 - x0) / 5, y = v => yb - (v - lo) / (hi - lo) * (yb - y0);
    let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Caja al final de cada mes por equipo">`;
    s += `<line x1="${x0}" x2="${x1}" y1="${y(0)}" y2="${y(0)}" stroke="#BDB9B2"/><text x="${x0 - 8}" y="${y(0) + 4}" text-anchor="end" font-size="12" fill="#6B6862">$0</text>`;
    for (let k = 0; k <= 5; k++) s += `<text x="${x(k)}" y="${H - 20}" text-anchor="middle" font-size="12" fill="#6B6862">${k === 0 ? 'Inicio' : 'Mes ' + k}</text>`;
    // Etiquetas al final de cada línea, separadas para que no se encimen
    const etiq = con.map(m => { const p = serie(m), u = p[p.length - 1]; return { m, u, ty: y(u.v) + 4 }; }).sort((a, c) => a.ty - c.ty);
    for (let i = 1; i < etiq.length; i++) if (etiq[i].ty - etiq[i - 1].ty < 15) etiq[i].ty = etiq[i - 1].ty + 15;
    con.forEach(m => {
      const p = serie(m), col = EQ[m.mesa][1];
      s += `<polyline points="${p.map(q => `${x(q.mes)},${y(q.v)}`).join(' ')}" fill="none" stroke="${col}" stroke-width="2.5" stroke-opacity=".85"/>`;
      p.forEach(q => { s += `<circle cx="${x(q.mes)}" cy="${y(q.v)}" r="3.5" fill="${col}"><title>${esc(EQ[m.mesa][0])}, ${q.mes === 0 ? 'inicio' : 'mes ' + q.mes}: ${money(q.v)}</title></circle>`; });
    });
    etiq.forEach(e => {
      const col = EQ[e.m.mesa][1], lx = x(e.u.mes) + 10;
      s += `<line x1="${x(e.u.mes) + 4}" x2="${lx - 2}" y1="${y(e.u.v)}" y2="${e.ty - 4}" stroke="${col}" stroke-width="1"/><text x="${lx}" y="${e.ty}" font-size="12" font-weight="600" fill="${col}">${esc(EQ[e.m.mesa][0])} ${money(e.u.v)}</text>`;
    });
    const sin = mesas.filter(m => !m.estado.historial.length);
    return s + '</svg>' + (sin.length ? `<p class="nota">Sin meses enviados: ${sin.map(m => esc(EQ[m.mesa][0])).join(', ')}.</p>` : '') + '<p class="nota">Si dos equipos tomaron las mismas decisiones, sus líneas se enciman.</p>';
  }

  function html({ partida, mesas, envios, jugadores = [], EQ, origen }) {
    const b = bono(mesas), ahora = new Date();
    const pts = m => m.estado.puntos + (b[m.mesa] || 0);
    const orden = mesas.slice().sort((a, c) => pts(c) - pts(a) || c.estado.utilidadAcum - a.estado.utilidadAcum);
    const porCobrar = m => m.estado.facturas.reduce((s, f) => s + f.monto, 0);
    const nombre = n => esc(EQ[n][0]);
    const tag = n => `<span class="eq"><span class="dot" style="background:${EQ[n][1]}"></span>${nombre(n)}</span>`;
    const terminaron = mesas.filter(m => m.estado.mesCompleto === 5);

    // Resumen en una frase por dato
    let resumen = '';
    if (orden.length) {
      const g = orden[0], ricoCaja = mesas.slice().sort((a, c) => c.estado.caja - a.estado.caja)[0], ricoUtil = mesas.slice().sort((a, c) => c.estado.utilidadAcum - a.estado.utilidadAcum)[0];
      resumen = `<ul class="resumen">
        <li>Equipo con más puntos: <b>${nombre(g.mesa)}</b>, con ${pts(g)} puntos.</li>
        <li>Mayor utilidad acumulada: <b>${nombre(ricoUtil.mesa)}</b>, con ${money(ricoUtil.estado.utilidadAcum)}.</li>
        <li>Mayor caja al final: <b>${nombre(ricoCaja.mesa)}</b>, con ${money(ricoCaja.estado.caja)}.</li>
        <li>Terminaron los cinco meses ${terminaron.length} de ${mesas.length} equipos.</li></ul>`;
    }

    // Errores por campo (todos los intentos fallidos)
    const fallidos = envios.filter(e => !e.correcto);
    const conteo = {}; Object.keys(CAMPOS).forEach(c => conteo[c] = { veces: 0, eq: new Set() });
    fallidos.forEach(e => (e.fallos || []).forEach(c => { if (conteo[c]) { conteo[c].veces++; conteo[c].eq.add(e.mesa); } }));
    const filasErr = Object.keys(CAMPOS).sort((a, c) => conteo[c].veces - conteo[a].veces)
      .map(c => `<tr><td>${CAMPOS[c]}</td><td>${conteo[c].veces}</td><td class="izq">${[...conteo[c].eq].sort().map(nombre).join(', ') || '—'}</td></tr>`).join('');
    const intentos = mesas.map(m => {
      const h = m.estado.historial;
      return `<tr><td>${tag(m.mesa)}</td><td>${h.filter(x => x.puntos === 2).length}</td><td>${h.filter(x => x.puntos === 1).length}</td><td>${h.filter(x => x.puntos === 0).length}</td></tr>`;
    }).join('');

    const detalle = mesas.map(m => {
      const filas = m.estado.historial.map(h => `<tr><td>${h.mes}</td><td>${h.decision.lotes}</td><td>${h.decision.pronto || '—'}</td><td>${h.decision.pide ? money(h.decision.pide) : '—'}</td><td>${h.decision.devuelve ? money(h.decision.devuelve) : '—'}</td><td>${money(h.resultado.cobros)}</td><td>${money(h.resultado.proveedor)}</td><td>${money(h.resultado.nomina)}</td><td>${h.resultado.intereses ? money(h.resultado.intereses) : '—'}</td><td>${h.resultado.descuento ? money(h.resultado.descuento) : '—'}</td><td><b>${money(h.resultado.cajaFinal)}</b></td><td><b>${money(h.resultado.utilidad)}</b></td><td>${h.puntos}</td></tr>`).join('');
      return `<section class="equipo"><h3>${tag(m.mesa)}</h3>
        ${(() => { const js = jugadores.filter(j => j.mesa === m.mesa); return js.length ? `<p class="nota">Integrantes: ${js.map(j => esc(j.nombre) + (j.dispositivo === m.vocero_id ? ' (vocero)' : '')).join(', ')}</p>` : ''; })()}
        <p class="nota">${m.estado.mesCompleto} de 5 meses · ${pts(m)} puntos${b[m.mesa] ? ' (incluye +3 por mayor utilidad)' : ''} · por cobrar al final ${money(porCobrar(m))} · crédito por pagar ${money(m.estado.credito)}</p>
        ${filas ? `<div class="tabla"><table><tr><th>Mes</th><th>Lotes</th><th>Pronto pago</th><th>Crédito pedido</th><th>Crédito devuelto</th><th>Cobros</th><th>Proveedor</th><th>Nómina</th><th>Intereses</th><th>Descuento</th><th>Caja final</th><th>Utilidad</th><th>Puntos</th></tr>${filas}
        <tr class="total"><td>Total</td><td>${m.estado.historial.reduce((s, h) => s + h.decision.lotes, 0)}</td><td colspan="8"></td><td>${money(m.estado.caja)}</td><td>${money(m.estado.utilidadAcum)}</td><td>${m.estado.puntos}</td></tr></table></div>` : '<p class="nota">No envió ningún mes.</p>'}</section>`;
    }).join('');

    const registro = envios.map(e => `<tr><td>${hora(e.created_at)}</td><td class="izq">${nombre(e.mesa)}</td><td>${e.mes}</td><td>${e.intento}</td><td class="izq">${e.decision.lotes} lotes${e.decision.pronto ? `, ${e.decision.pronto} pronto pago` : ''}${e.decision.pide ? `, pide ${money(e.decision.pide)}` : ''}${e.decision.devuelve ? `, devuelve ${money(e.decision.devuelve)}` : ''}</td><td>${money(e.numeros.cobros)} · ${money(e.numeros.proveedor)} · ${money(e.numeros.cajaFinal)} · ${money(e.numeros.utilidad)}</td><td class="${e.correcto ? 'ok' : 'mal'}">${e.correcto ? 'Correcto' : 'Falló: ' + (e.fallos || []).map(c => CAMPOS[c] ? CAMPOS[c].toLowerCase() : c).join(', ')}</td></tr>`).join('');

    return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resultados · La caja de la planta · ${esc(partida.codigo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#F4F3F1;--ink:#1F1F1F;--muted:#6B6862;--red:#AA1124;--carbon:#262626;--line:#E2DED7;--danger:#C2410C}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Montserrat,system-ui,sans-serif;font-weight:500;line-height:1.5;font-variant-numeric:tabular-nums;border-top:4px solid var(--red)}
.top{background:#F7F6F4;border-bottom:1px solid var(--line);padding:16px 24px;display:flex;justify-content:center;align-items:center;gap:18px}
.top img{height:34px}.top .div{width:2px;height:30px;background:var(--ink)}.top p{margin:0;font-weight:600;font-size:13px;line-height:1.3}
main{max-width:1000px;margin:0 auto;padding:32px 24px 48px}
.kick{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--red)}
h1{font-size:28px;font-weight:600;margin:6px 0 4px}h2{font-size:20px;font-weight:600;margin:36px 0 10px}h3{font-size:17px;font-weight:600;margin:0 0 4px}
.nota{color:var(--muted);font-size:13px;margin:4px 0 10px}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px 20px}
.resumen{margin:0;padding-left:20px}.resumen li{margin:4px 0}
.tabla{background:#fff;border:1px solid var(--line);border-radius:12px;overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13.5px;background:#FBFAF8}
th{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;text-align:right;padding:9px 8px;background:#F1EEE9;border-bottom:1px solid var(--line)}
td{text-align:right;padding:8px;border-bottom:1px solid #EBE7E1}
th:first-child,td:first-child,.izq{text-align:left}
tr.total td{font-weight:700;background:#fff}
td.ok{color:#2E7D4F;font-weight:600;text-align:left}td.mal{color:var(--danger);font-weight:600;text-align:left}
.eq{display:inline-flex;align-items:center;gap:8px;font-weight:600}
.dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px}
.leyenda{font-size:13px;color:var(--muted);margin:8px 0 0}.leyenda .dot{margin-left:12px}
svg text{font-family:Montserrat,system-ui,sans-serif}
.equipo{margin-top:22px;break-inside:avoid}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:16px}
footer{background:var(--carbon);color:#D9D9D9;border-top:6px solid var(--red);padding:24px;font-size:13px;text-align:center}
@media (max-width:760px){.dos{grid-template-columns:1fr}}
@media print{body{background:#fff;border:0}.card,.tabla{break-inside:avoid}h2{break-after:avoid}}
</style></head><body>
<div class="top"><img src="${origen}/logo.png" alt="MoneyTalks"><span class="div"></span><p>Programa de<br>Bienestar Financiero</p><span class="div"></span><img src="${origen}/img/envases.webp" alt="Envases"></div>
<main>
<div class="kick">Finanzas para No Financieros · Sesión 2 · Envases Universales</div>
<h1>La caja de la planta · Resultados</h1>
<p class="nota">Partida ${esc(partida.codigo)} · descargado el ${fecha(ahora)} · cifras en millones de pesos</p>
<div class="card">${resumen || '<p>No hay equipos con datos en esta partida.</p>'}</div>

<h2>Tabla de posiciones</h2>
<div class="tabla"><table><tr><th>Lugar</th><th class="izq">Equipo</th><th>Puntos</th><th>Utilidad acumulada</th><th>Caja final</th><th>Crédito por pagar</th><th>Por cobrar al final</th><th>Meses</th></tr>
${orden.map((m, i) => `<tr><td>${i + 1}</td><td class="izq">${tag(m.mesa)}</td><td><b>${pts(m)}</b>${b[m.mesa] ? ' <span class="nota">(+3)</span>' : ''}</td><td>${money(m.estado.utilidadAcum)}</td><td>${money(m.estado.caja)}</td><td>${money(m.estado.credito)}</td><td>${money(porCobrar(m))}</td><td>${m.estado.mesCompleto} de 5</td></tr>`).join('')}</table></div>
<p class="nota">Puntos: 2 por mes correcto al primer intento, 1 al segundo, 0 si no cuadró; +3 al equipo con mayor utilidad acumulada entre los que terminaron.</p>

<h2>¿El equipo que más ganó es el que más caja tiene?</h2>
<div class="card">${barras(orden, EQ)}</div>

<h2>La caja de cada equipo, mes por mes</h2>
<div class="card">${lineas(mesas, EQ)}</div>

<h2>Dónde se equivocaron</h2>
<div class="dos">
<div><div class="tabla"><table><tr><th>Número</th><th>Veces que falló</th><th class="izq">Equipos</th></tr>${filasErr}</table></div>
<p class="nota">Cuenta cada intento fallido. Un intento puede fallar en más de un número.</p></div>
<div><div class="tabla"><table><tr><th>Equipo</th><th>Bien al 1.er intento</th><th>Bien al 2.º</th><th>Sin puntos</th></tr>${intentos}</table></div>
<p class="nota">Meses por equipo según el intento en que cuadraron sus números.</p></div>
</div>

<h2>Detalle por equipo</h2>
${detalle}

<h2>Registro de envíos</h2>
<p class="nota">Cada vez que un vocero envió. Números capturados: cobros · proveedor · caja final · utilidad.</p>
<div class="tabla"><table><tr><th>Hora</th><th class="izq">Equipo</th><th>Mes</th><th>Intento</th><th class="izq">Decisión</th><th>Números</th><th class="izq">Resultado</th></tr>${registro || '<tr><td colspan="7">Sin envíos.</td></tr>'}</table></div>
</main>
<footer>Manual de Finanzas para No Financieros · Programa de Bienestar Financiero de MoneyTalks para Envases</footer>
</body></html>`;
  }

  function csv({ mesas, EQ }) {
    const enc = ['equipo', 'mes', 'lotes', 'pronto_pago', 'credito_pedido', 'credito_devuelto', 'cobros', 'proveedor', 'nomina', 'gastos_fijos', 'intereses', 'descuento', 'caja_final', 'utilidad', 'puntos'];
    const q = v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v;
    const filas = [enc.join(',')];
    mesas.forEach(m => m.estado.historial.forEach(h => filas.push([EQ[m.mesa][0], h.mes, h.decision.lotes, h.decision.pronto, h.decision.pide, h.decision.devuelve, h.resultado.cobros, h.resultado.proveedor, h.resultado.nomina, h.resultado.fijos, h.resultado.intereses, h.resultado.descuento, h.resultado.cajaFinal, h.resultado.utilidad, h.puntos].map(q).join(','))));
    return '﻿' + filas.join('\n');
  }

  function descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a'); a.href = url; a.download = nombre; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  root.CajaExportar = { html, csv, descargar };
})(this);
