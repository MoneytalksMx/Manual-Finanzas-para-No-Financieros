// Motor del juego «La caja de la planta». Cifras en millones de pesos.
(function (root) {
  const PRECIO = 10, PRECIO_PRONTO = 9, ALUMINIO = 4, NOMINA = 2, FIJOS = 2;
  const PEDIDOS = { 1: 3, 2: 4, 3: 10, 4: 10, 5: 10 };
  const CLIENTE_NUEVO = 6; // lotes del cliente nuevo a partir del mes 3

  function estadoInicial() {
    return {
      caja: 5,
      facturas: [{ mes: 1, monto: 30 }, { mes: 2, monto: 30 }],
      avisos: [{ mes: 1, monto: 12 }],
      credito: 0,
      utilidadAcum: 0,
      puntos: 0,
      mesCompleto: 0,
      historial: []
    };
  }

  // Lo que la mesa encuentra al empezar el mes, antes de decidir.
  function inicioDeMes(est, mes) {
    const cobros = est.facturas.filter(f => f.mes === mes).reduce((s, f) => s + f.monto, 0);
    const proveedor = est.avisos.filter(a => a.mes === mes).reduce((s, a) => s + a.monto, 0);
    const intereses = est.credito / 10; // $1 por cada $10 de crédito que se tenía al empezar el mes
    return { cobros, proveedor, intereses };
  }

  function validarDecision(est, mes, d) {
    const max = PEDIDOS[mes];
    if (!Number.isInteger(d.lotes) || d.lotes < 0 || d.lotes > max) return `Este mes pueden producir de 0 a ${max} lotes.`;
    const ppMax = mes >= 3 ? Math.min(CLIENTE_NUEVO, d.lotes) : 0;
    if (!Number.isInteger(d.pronto) || d.pronto < 0 || d.pronto > ppMax)
      return mes >= 3 ? `El pronto pago aplica solo a los lotes del cliente nuevo: de 0 a ${ppMax}.` : 'El pronto pago empieza en el mes 3.';
    if (d.pide % 10 !== 0 || d.pide < 0) return 'El crédito se pide en múltiplos de $10.';
    if (d.devuelve % 10 !== 0 || d.devuelve < 0 || d.devuelve > est.credito + d.pide) return 'No pueden devolver más crédito del que tienen.';
    return null;
  }

  // Resultado correcto del mes para una decisión.
  function calcular(est, mes, d) {
    const { cobros, proveedor, intereses } = inicioDeMes(est, mes);
    const nomina = d.lotes * NOMINA;
    const descuento = d.pronto * (PRECIO - PRECIO_PRONTO);
    const cajaFinal = est.caja + cobros - proveedor - nomina - FIJOS - intereses + d.pide - d.devuelve;
    const utilidad = d.lotes * (PRECIO - ALUMINIO - NOMINA) - FIJOS - intereses - descuento;
    return { cobros, proveedor, nomina, fijos: FIJOS, intereses, descuento, cajaFinal, utilidad };
  }

  function aplicar(est, mes, d, r, puntosGanados) {
    const n = JSON.parse(JSON.stringify(est));
    n.facturas = n.facturas.filter(f => f.mes !== mes);
    n.avisos = n.avisos.filter(a => a.mes !== mes);
    const normales = d.lotes - d.pronto;
    if (normales > 0) n.facturas.push({ mes: mes + 2, monto: normales * PRECIO });
    if (d.pronto > 0) n.facturas.push({ mes: mes + 1, monto: d.pronto * PRECIO_PRONTO });
    if (d.lotes > 0) n.avisos.push({ mes: mes + 1, monto: d.lotes * ALUMINIO });
    n.caja = r.cajaFinal;
    n.credito = est.credito + d.pide - d.devuelve;
    n.utilidadAcum = est.utilidadAcum + r.utilidad;
    n.puntos = est.puntos + puntosGanados;
    n.mesCompleto = mes;
    n.historial.push({ mes, decision: d, resultado: r, puntos: puntosGanados });
    return n;
  }

  const PISTAS = {
    cobros: mes => `Cobros: sumen solo las facturas que en su tablero dicen «se cobra en el mes ${mes}».`,
    proveedor: mes => `Pago al proveedor: es el aluminio de los lotes del mes pasado (lotes × $4). En el mes 1 es el aviso inicial.`,
    cajaFinal: () => 'Caja final = caja inicial + cobros + crédito recibido − proveedor − nómina (lotes × $2) − gastos fijos ($2) − intereses − crédito devuelto.',
    utilidad: () => 'Utilidad = lotes × $4 − gastos fijos ($2) − intereses − descuento del pronto pago ($1 por lote).'
  };

  function comparar(r, numeros) {
    const campos = ['cobros', 'proveedor', 'cajaFinal', 'utilidad'];
    return campos.filter(c => Number(numeros[c]) !== r[c]);
  }

  const api = { PEDIDOS, CLIENTE_NUEVO, estadoInicial, inicioDeMes, validarDecision, calcular, aplicar, comparar, PISTAS };
  if (typeof module !== 'undefined') module.exports = api; else root.Caja = api;
})(this);
