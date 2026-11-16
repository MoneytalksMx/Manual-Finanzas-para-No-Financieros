// Errores del primer intento: cuántas veces se capturó mal cada número, sumando todos los equipos y meses.
(function (root) {
  const CAMPOS = [['cobros', 'Cobros'], ['proveedor', 'Proveedor'], ['cajaFinal', 'Caja final'], ['utilidad', 'Utilidad']];

  // Usa la columna fallos; si un envío fallido no la tiene, recalcula con el motor el tablero
  // del equipo al inicio de ese mes y compara los números capturados con los correctos.
  function contar(envios, mesas, Caja) {
    const primeros = envios.filter(e => e.intento === 1);
    const cuenta = {}; CAMPOS.forEach(([c]) => cuenta[c] = 0);
    primeros.forEach(e => {
      let fallos = e.fallos || [];
      if (!e.correcto && !fallos.length) {
        const m = mesas.find(x => x.mesa === e.mesa);
        if (m) {
          let est = Caja.estadoInicial();
          m.estado.historial.filter(h => h.mes < e.mes).sort((a, b) => a.mes - b.mes).forEach(h => { est = Caja.aplicar(est, h.mes, h.decision, h.resultado, 0); });
          fallos = Caja.comparar(Caja.calcular(est, e.mes, e.decision), e.numeros);
        }
      }
      fallos.forEach(c => { if (c in cuenta) cuenta[c]++; });
    });
    return { total: primeros.length, cuenta };
  }

  function html(datos) {
    const { total, cuenta } = datos;
    const max = Math.max(...CAMPOS.map(([c]) => cuenta[c]));
    const filas = CAMPOS.map(([c, nom]) => {
      const n = cuenta[c], pct = total ? Math.round(n / total * 100) : 0, top = max > 0 && n === max;
      return `<div class="err-row${top ? ' top' : ''}"><div class="err-head"><span class="err-lab">${nom}</span><span class="err-val">${n} de ${total} · ${pct} %</span></div>
        <div class="err-track" role="img" aria-label="${nom}: ${n} de ${total}"><div class="err-bar" style="width:${total ? n / total * 100 : 0}%"></div></div></div>`;
    }).join('');
    return `<div class="err-chart">
      <h2 class="err-title">Errores en el primer intento</h2>
      <p class="err-sub">Veces que cada número se capturó mal en el primer intento, sumando todos los equipos y meses.${total ? '' : ' Todavía no hay envíos.'}</p>
      ${filas}
      ${total && max === 0 ? '<p class="err-sub">Ningún número falló en el primer intento.</p>' : ''}
    </div>`;
  }

  const api = { contar, html };
  if (typeof module !== 'undefined') module.exports = api; else root.CajaErrores = api;
})(this);
