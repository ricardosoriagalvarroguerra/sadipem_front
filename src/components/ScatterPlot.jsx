import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const acreedoresAlias = {
  'CAIXA': 'Caixa',
  'CAIXA ECONOMICA FEDERAL': 'Caixa',
  'BANCO NACIONAL DE DESENVOLVIMENTO ECONÔMICO E SOCIAL': 'BNDS',
  'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL': 'BNDS',
  'BNDS': 'BNDS',
  'FONPLATA': 'FONPLATA',
  'BANCO INTERAMERICANO DE DESENVOLVIMENTO': 'BID',
  'BID': 'BID',
  'NEW DEVELOPMENT BANK': 'NDB',
  'NDB': 'NDB',
  'CAF': 'CAF',
  'BIRF': 'BIRF',
};
const acreedoresMostrarDefault = ['BIRF', 'BID', 'CAF', 'FONPLATA', 'Caixa', 'NDB', 'BNDS'];
const colorPorAcreedor = {
  'FONPLATA': '#c1121f',
  'Fonplata': '#c1121f',
  'Caixa': '#ffb703',
  'BID': '#003049',
  'BIRF': '#0466c8',
  'CAF': '#008000',
  'BNDS': '#ff7d00',
  'NDB': '#a020f0',
  'BDB': '#fb8500',
};
function normalizaAcreedor(nombre) {
  if (!nombre) return null;
  const upper = nombre.trim().toUpperCase();
  for (const key in acreedoresAlias) {
    if (upper.includes(key)) return acreedoresAlias[key];
  }
  return null;
}
function etiquetaAcreedor(nombre) {
  if (nombre === 'NDB') return 'NDB';
  if (nombre === 'BNDS') return 'BNDS';
  return nombre;
}

export default function ScatterPlot({ datos, width = 600, height = 400, acreedoresMostrar, colorOverride, onLegendClick, legendActive, legendOrder, yMax }) {
  const [hoveredAcreedor, setHoveredAcreedor] = useState(null);
  const ref = useRef();
  useEffect(() => {
    if (!datos.length) return;
    const listaAcreedores = acreedoresMostrar || acreedoresMostrarDefault;
    const datosFiltrados = datos
      .filter(d => d.garantia_soberana === 'Si')
      .map(d => ({
        ...d,
        acreedor: normalizaAcreedor(d.nombre_acreedor),
        valor_millones: (d.valor_usd || 0) / 1e6,
      }))
      .filter(d => listaAcreedores.includes(d.acreedor) && d.valor_millones > 0 && d.tiempo_prestamo != null);
    // Dibuja
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);
    // Eje X: tiempo_prestamo
    const x = d3.scaleLinear()
      .domain(d3.extent(datosFiltrados, d => d.tiempo_prestamo)).nice()
      .range([margin.left, width - margin.right]);
    // Eje Y: valor_usd en millones
    const y = d3.scaleLinear()
      .domain([0, (typeof yMax === 'number' ? yMax : d3.max(datosFiltrados, d => d.valor_millones)) || 1]).nice()
      .range([height - margin.bottom, margin.top]);
    // Eje X
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6))
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
    // Etiquetas de ejes
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 15)
      .attr('fill', '#222')
      .text('Tiempo del préstamo (años)');
    svg.append('text')
      .attr('x', margin.left - 50)
      .attr('y', margin.top - 18)
      .attr('text-anchor', 'start')
      .attr('font-size', 15)
      .attr('fill', '#222')
      .text('Valor USD (millones)');
    // Tooltip
    let tooltip = d3.select('body').select('.d3-tooltip-scatter');
    if (!tooltip.node()) {
      tooltip = d3.select('body').append('div')
        .attr('class', 'd3-tooltip-scatter')
        .style('position', 'fixed')
        .style('background', '#fff')
        .style('border', '2px solid #c1121f')
        .style('border-radius', '8px')
        .style('padding', '10px 16px')
        .style('font-size', '14px')
        .style('pointer-events', 'none')
        .style('z-index', 10000)
        .style('display', 'none')
        .style('color', '#222')
        .style('box-shadow', '0 2px 12px rgba(0,0,0,0.10)');
    }
    // Puntos
    svg.append('g')
      .selectAll('circle')
      .data(datosFiltrados)
      .join('circle')
      .attr('cx', d => x(d.tiempo_prestamo))
      .attr('cy', d => y(d.valor_millones))
      .attr('r', 7)
      .attr('fill', d => (colorOverride && colorOverride[d.acreedor]) ? colorOverride[d.acreedor] : (colorPorAcreedor[d.acreedor] || '#888'))
      .attr('opacity', d => {
        if (hoveredAcreedor) {
          return d.acreedor === hoveredAcreedor ? 1 : 0.2;
        }
        // Solo aplicar transparencia si colorOverride tiene claves (modos Externos/Internos)
        if (colorOverride && Object.keys(colorOverride).length > 0 && d.acreedor !== 'FONPLATA') return 0.3;
        return 0.7;
      })
      .attr('stroke', '#222')
      .attr('stroke-width', 1.2)
      .on('mousemove', function(event, d) {
        setHoveredAcreedor(d.acreedor);
        tooltip
          .style('display', 'block')
          .style('z-index', 10000)
          .style('background', (colorOverride && colorOverride[d.acreedor]) ? colorOverride[d.acreedor] : (colorPorAcreedor[d.acreedor] || '#fff'))
          .style('color', '#fff')
          .style('border-color', (colorOverride && colorOverride[d.acreedor]) ? colorOverride[d.acreedor] : (colorPorAcreedor[d.acreedor] || '#c1121f'))
          .style('left', (event.clientX + 16) + 'px')
          .style('top', (event.clientY - 24) + 'px')
          .html(
            `<div style='font-weight:700;font-size:15px;margin-bottom:2px;'>${etiquetaAcreedor(d.acreedor)}</div>` +
            `<div style='font-size:13px;'>` +
            `Valor: <b>${d.valor_millones?.toLocaleString('es-ES', {maximumFractionDigits: 2})}M USD</b><br/>` +
            `Tiempo: <b>${Math.round(d.tiempo_prestamo)} años</b><br/>` +
            `Ente: <b>${d.ente}</b>` +
            `</div>`
          );
      })
      .on('mouseleave', function() {
        setHoveredAcreedor(null);
        tooltip.style('display', 'none');
      });
    // Limpia tooltip al desmontar
    return () => { d3.select('body').select('.d3-tooltip-scatter').remove(); };
  }, [datos, width, height, acreedoresMostrar, colorOverride, yMax, hoveredAcreedor]);

  // Leyenda vertical a la derecha
  const listaAcreedores = legendOrder || acreedoresMostrar || acreedoresMostrarDefault;
  const leyenda = listaAcreedores.map(a => ({
    label: etiquetaAcreedor(a),
    color: (colorOverride && colorOverride[a]) ? colorOverride[a] : (colorPorAcreedor[a] || '#888'),
    key: a,
    active: legendActive ? legendActive(a) : true,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: width + 60 }}>
      <svg ref={ref} width={width} height={height} style={{ display: 'block' }} />
      <div style={{ minWidth: 80, marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 40 }}>
        {leyenda.map((item) => (
          <div
            key={item.key}
            onClick={() => onLegendClick && onLegendClick(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              opacity: item.active ? 1 : 0.35,
              userSelect: 'none',
            }}
            title={item.active ? `Ocultar ${item.label}` : `Mostrar ${item.label}`}
          >
            <span style={{ display: 'inline-block', width: 10, height: 10, background: item.color, borderRadius: '50%', border: '1px solid #bbb', opacity: item.active ? 1 : 0.35 }} />
            <span style={{ color: '#222', fontSize: 10, fontWeight: 600, textDecoration: item.active ? 'none' : 'line-through' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 