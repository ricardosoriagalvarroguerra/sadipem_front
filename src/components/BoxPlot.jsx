import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Acreedores de interés y sus alias
const acreedoresAlias = {
  'CAIXA': 'Caixa',
  'CAIXA ECONOMICA FEDERAL': 'Caixa',
  'BANCO NACIONAL DE DESENVOLVIMENTO ECONÔMICO E SOCIAL': 'BNDS',
  'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL': 'BNDS', // sin acento
  'BNDS': 'BNDS',
  'FONPLATA': 'FONPLATA',
  'BANCO INTERAMERICANO DE DESENVOLVIMENTO': 'BID',
  'BID': 'BID',
  'NEW DEVELOPMENT BANK': 'NDB',
  'NDB': 'NDB',
  'CAF': 'CAF',
  'BIRF': 'BIRF',
};
const acreedoresMostrarDefault = ['Caixa', 'FONPLATA', 'BID', 'NDB', 'CAF', 'BIRF'];

function normalizaAcreedor(nombre) {
  if (!nombre) return null;
  const upper = nombre.trim().toUpperCase();
  for (const key in acreedoresAlias) {
    if (upper.includes(key)) return acreedoresAlias[key];
  }
  return null;
}

// Color institucional gris
const colorInstitucional = '#888';
const colorPorAcreedor = {
  'FONPLATA': '#c1121f',
  'Caixa': colorInstitucional,
  'BNDS': colorInstitucional,
  'CAF': colorInstitucional,
  'BIRF': colorInstitucional,
  'BID': colorInstitucional,
  'NDB': colorInstitucional,
};

export default function BoxPlot({ datos, width = 600, height = 380, acreedoresMostrar }) {
  const ref = useRef();

  useEffect(() => {
    if (!datos.length) return;
    // Agrupa datos por acreedor normalizado
    const listaAcreedores = acreedoresMostrar || acreedoresMostrarDefault;
    const datosFiltrados = datos
      .filter(d => d.tipo_ente === 'Município')
      .filter(d => d.garantia_soberana === 'Si')
      .map(d => {
        let tiempo = d.tiempo_prestamo;
        if (typeof tiempo === 'number' && tiempo < 14) tiempo = 14;
        return { ...d, tiempo_prestamo: tiempo };
      })
      .filter(d => d.tiempo_prestamo >= 14)
      .map(d => ({ ...d, acreedor: normalizaAcreedor(d.nombre_acreedor), valor_millones: (d.valor_usd || 0) / 1e6 }))
      .filter(d => listaAcreedores.includes(d.acreedor) && d.valor_millones > 0);
    const datosPorAcreedor = d3.group(datosFiltrados, d => d.acreedor);
    // Prepara datos para boxplot
    const boxData = listaAcreedores.map(acreedor => {
      const valores = (datosPorAcreedor.get(acreedor) || []).map(d => d.valor_millones).sort(d3.ascending);
      if (!valores.length) return { acreedor, valores: [], stats: null, outliers: [], inliers: [] };
      // 1. Calcular Q1, Q3, IQR sobre todos los valores
      const q1_all = d3.quantile(valores, 0.25);
      const q3_all = d3.quantile(valores, 0.75);
      const iqr = q3_all - q1_all;
      const lowerFence = q1_all - 1.5 * iqr;
      const upperFence = q3_all + 1.5 * iqr;
      // 2. Filtrar inliers
      const inliers = valores.filter(v => v >= lowerFence && v <= upperFence);
      // 3. Calcular Q1, mediana, Q3 solo sobre inliers
      const q1 = d3.quantile(inliers, 0.25);
      const median = d3.quantile(inliers, 0.5);
      const q3 = d3.quantile(inliers, 0.75);
      const min = d3.min(inliers);
      const max = d3.max(inliers);
      const outliers = valores.filter(v => v < lowerFence || v > upperFence);
      return { acreedor, valores, stats: { min, q1, median, q3, max }, outliers, inliers };
    });
    // Dibuja
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);
    // Eje X: acreedores
    const x = d3.scaleBand().domain(listaAcreedores).range([margin.left, width - margin.right]).padding(0.5);
    // Eje Y: valores en millones
    // Solo inliers para el dominio del eje Y
    const allInliers = boxData.flatMap(d => d.inliers || []);
    const y = d3.scaleLinear()
      .domain([0, d3.max(allInliers) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);
    // Eje X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.selectAll('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .selectAll('text')
      .attr('font-size', 15)
      .attr('font-weight', 600)
      .attr('fill', '#222');
    // Eje Y
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + 'M')
      )
      .call(g => g.selectAll('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .selectAll('text')
      .attr('font-size', 13)
      .attr('fill', '#222')
      .attr('font-weight', 700);
    // Etiqueta eje Y
    svg.append('text')
      .attr('x', margin.left - 50)
      .attr('y', margin.top - 18)
      .attr('text-anchor', 'start')
      .attr('font-size', 15)
      .attr('fill', '#222')
      .text('Valor USD (millones)');
    // Boxplots
    // Tooltip
    let tooltip = d3.select('body').select('.d3-tooltip-boxplot');
    if (!tooltip.node()) {
      tooltip = d3.select('body').append('div')
        .attr('class', 'd3-tooltip-boxplot')
        .style('position', 'fixed')
        .style('background', '#fff')
        .style('border', '2px solid #c1121f')
        .style('border-radius', '8px')
        .style('padding', '10px 16px')
        .style('font-size', '14px')
        .style('pointer-events', 'none')
        .style('z-index', 10000)
        .style('display', 'none')
        .style('color', '#fff')
        .style('box-shadow', '0 2px 12px rgba(0,0,0,0.10)');
    }
    boxData.forEach((d, i) => {
      if (!d.stats) return;
      const center = x(d.acreedor) + x.bandwidth() / 2;
      // Caja
      svg.append('rect')
        .attr('x', x(d.acreedor))
        .attr('y', y(d.stats.q3))
        .attr('width', x.bandwidth())
        .attr('height', y(d.stats.q1) - y(d.stats.q3))
        .attr('fill', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('fill-opacity', 0.25)
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 4)
        .attr('stroke-opacity', 1)
        .attr('shape-rendering', 'crispEdges')
        .on('mousemove', function(event) {
          tooltip
            .style('display', 'block')
            .style('z-index', 10000)
            .style('background', colorPorAcreedor[d.acreedor] || colorInstitucional)
            .style('color', '#fff')
            .style('border-color', colorPorAcreedor[d.acreedor] || colorInstitucional)
            .style('left', (event.clientX + 16) + 'px')
            .style('top', (event.clientY - 24) + 'px')
            .html(
              `<div style='font-weight:700;font-size:15px;margin-bottom:2px;'>${d.acreedor}</div>` +
              `<div style='font-size:13px;'>` +
              `Q1: <b>${d.stats.q1?.toLocaleString('es-ES', {maximumFractionDigits: 1})}M</b><br/>` +
              `Mediana: <b>${d.stats.median?.toLocaleString('es-ES', {maximumFractionDigits: 1})}M</b><br/>` +
              `Q3: <b>${d.stats.q3?.toLocaleString('es-ES', {maximumFractionDigits: 1})}M</b><br/>` +
              `Min: <b>${d.stats.min?.toLocaleString('es-ES', {maximumFractionDigits: 1})}M</b><br/>` +
              `Max: <b>${d.stats.max?.toLocaleString('es-ES', {maximumFractionDigits: 1})}M</b>` +
              `</div>`
            );
        })
        .on('mouseleave', function() {
          tooltip.style('display', 'none');
        });
      // Línea mediana
      svg.append('line')
        .attr('x1', x(d.acreedor))
        .attr('x2', x(d.acreedor) + x.bandwidth())
        .attr('y1', y(d.stats.median))
        .attr('y2', y(d.stats.median))
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 5);
      // Bigotes
      svg.append('line')
        .attr('x1', center)
        .attr('x2', center)
        .attr('y1', y(d.stats.min))
        .attr('y2', y(d.stats.q1))
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 2);
      svg.append('line')
        .attr('x1', center)
        .attr('x2', center)
        .attr('y1', y(d.stats.q3))
        .attr('y2', y(d.stats.max))
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 2);
      // Líneas horizontales en extremos
      svg.append('line')
        .attr('x1', center - x.bandwidth() / 4)
        .attr('x2', center + x.bandwidth() / 4)
        .attr('y1', y(d.stats.min))
        .attr('y2', y(d.stats.min))
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 2);
      svg.append('line')
        .attr('x1', center - x.bandwidth() / 4)
        .attr('x2', center + x.bandwidth() / 4)
        .attr('y1', y(d.stats.max))
        .attr('y2', y(d.stats.max))
        .attr('stroke', colorPorAcreedor[d.acreedor] || colorInstitucional)
        .attr('stroke-width', 2);
    });
    // Limpia tooltip al desmontar
    return () => { d3.select('body').select('.d3-tooltip-boxplot').remove(); };
  }, [datos, width, height, acreedoresMostrar]);

  return <svg ref={ref} />;
}