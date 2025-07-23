import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';

const API_URL = import.meta.env.VITE_API_URL;

// Componente de gráfico de barras apiladas 100% HORIZONTALES con D3.js
function BarChartD3({ data, width = 520, height = 240, colorMap, showXAxis = true, label, extendRefLinesDown = false, showXAxisTicksOnly = false }) {
  const ref = useRef();
  useEffect(() => {
    if (!data || data.length === 0) return;
    d3.select(ref.current).selectAll('*').remove();
    // Agrupa por año (no fecha completa)
    const clasifs = ['Externo', 'Interno'];
    const dataByYear = d3.rollups(
      data,
      v => d3.rollup(v, vv => d3.sum(vv, d => d.valor_usd), d => d.RGF_clasificacion),
      d => {
        const dt = new Date(d.fecha_contratacion);
        return isNaN(dt) ? d.fecha_contratacion : dt.getFullYear();
      }
    );
    const years = dataByYear.map(([year]) => year).sort();
    // Prepara datos para apilado 100%
    const stacked = years.map(year => {
      const row = { year };
      const yearData = dataByYear.find(([y]) => y === year)?.[1] || new Map();
      let total = 0;
      clasifs.forEach(c => { total += yearData.get(c) || 0; });
      clasifs.forEach(c => {
        row[c] = total > 0 ? (yearData.get(c) || 0) / total : 0;
      });
      return row;
    });
    const stackGen = d3.stack().keys(clasifs);
    const series = stackGen(stacked);
    // Escalas
    const x = d3.scaleLinear().domain([0, 1]).range([80, width - 20]);
    const y = d3.scaleBand().domain(years).range([40, height - 30]).padding(0); // barras lo más anchas posible y más espacio abajo
    // SVG
    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);
    // Eje Y: años
    const yTicks = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];
    const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
    // Eje Y (años)
    svg.append('g')
      .attr('transform', `translate(80,0)`)
      .call(d3.axisLeft(y)
        .tickValues(yTicks.filter(t => years.includes(t)))
      )
      .call(g => g.selectAll('.domain').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'none'))
      .call(g => g.selectAll('.tick text').attr('fill', '#222').attr('font-size', 13));
    // Eje X (% del total)
    if (showXAxis) {
      if (showXAxisTicksOnly) {
        // Solo los ticks, sin línea ni label
        svg.append('g')
          .attr('transform', `translate(0,${height - 20})`)
          .call(d3.axisBottom(x)
            .tickValues(xTicks)
            .tickFormat(d => `${Math.round(d * 100)}%`)
          )
          .call(g => g.selectAll('.domain').remove())
          .call(g => g.selectAll('.tick line').remove())
          .call(g => g.selectAll('.tick text').attr('fill', '#222').attr('font-size', 13).attr('font-weight', 'bold'));
      } else {
        svg.append('g')
          .attr('transform', `translate(0,${height - 20})`)
          .call(d3.axisBottom(x)
            .tickValues(xTicks)
            .tickFormat(d => `${Math.round(d * 100)}%`)
          )
          .call(g => g.selectAll('.domain').attr('stroke', '#333'))
          .call(g => g.selectAll('.tick line').attr('stroke', '#333'))
          .call(g => g.selectAll('.tick text').attr('fill', '#222').attr('font-size', 13).attr('font-weight', 'bold'));
        // Etiqueta eje X
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height - 8)
          .attr('text-anchor', 'middle')
          .attr('fill', '#333')
          .attr('font-size', 14)
          .text('% del total');
      }
    }
    // Barras apiladas 100% con tooltips y etiquetas
    const tooltip = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(37,35,35,0.75)')
      .style('border', 'none')
      .style('border-radius', '6px')
      .style('padding', '8px 12px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)
      .style('display', 'none')
      .style('color', '#fff');

    svg.selectAll('g.layer')
      .data(series)
      .join('g')
      .attr('class', 'layer')
      .attr('fill', d => colorMap[d.key] || '#ccc')
      .selectAll('rect')
      .data((d, i, nodes) => d.map((v, j) => ({...v, key: d.key, layerIdx: i, barIdx: j})))
      .join('rect')
      .attr('y', d => y(d.data.year))
      .attr('x', d => x(d[0]))
      .attr('width', d => x(d[1]) - x(d[0]))
      .attr('height', y.bandwidth())
      .attr('opacity', 0.8)
      .attr('stroke', '#222')
      .attr('stroke-width', 1)
      .on('mousemove', function(event, d) {
        const percent = (100 * (d[1] - d[0]));
        // Busca el monto en USD para la barra actual
        const monto = d.data[d.key] && d.data[d.key] > 0 ? (d.data[d.key] * d.data.total_usd || 0) : 0;
        // Si tienes el valor real, puedes mostrarlo, si no, muestra el porcentaje
        tooltip
          .style('display', 'block')
          .html(
            `<span style='color:#bf0603;font-size:13px;'>${d.data.year}</span>` +
            `<span style='color:#fff;font-size:13px;'>: ${percent.toFixed(1)}%` +
            (monto ? ` (${monto.toLocaleString('es-ES', {maximumFractionDigits: 0})} USD)` : '') +
            `</span>`
          )
          .style('left', (event.pageX + 16) + 'px')
          .style('top', (event.pageY - 24) + 'px');
        // Resalta solo la barra activa
        d3.select(ref.current).selectAll('rect')
          .attr('opacity', r => (r.data.year === d.data.year && r.key === d.key) ? 1 : 0.4 * 0.8);
      })
      .on('mouseleave', function() {
        tooltip.style('display', 'none');
        d3.select(ref.current).selectAll('rect').attr('opacity', 0.8);
      });

    // Líneas verticales de referencia en 20%, 40%, 60%, 80%
    const refLines = [0.2, 0.4, 0.6, 0.8];
    const gap = 8; // Debe coincidir con el gap entre gráficos
    refLines.forEach(val => {
      svg.append('line')
        .attr('x1', x(val))
        .attr('x2', x(val))
        .attr('y1', extendRefLinesDown ? 40 : -100)
        .attr('y2', showXAxisTicksOnly ? (height - 32) : (extendRefLinesDown ? (height - 30 + gap + 100) : (height - 30 + 100)))
        .attr('stroke', '#222')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,3');
    });

    // (Eliminadas las etiquetas de porcentaje dentro de las barras)

    // Limpia tooltip al desmontar
    return () => { tooltip.remove(); };
    // Leyenda
    svg.selectAll('legend').data(clasifs).join('rect')
      .attr('x', (d, i) => 60 + i * 120)
      .attr('y', 5)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorMap[d] || '#ccc');
    svg.selectAll('legendText').data(clasifs).join('text')
      .attr('x', (d, i) => 82 + i * 120)
      .attr('y', 19)
      .text(d => d)
      .attr('font-size', 13);
  }, [data, width, height, colorMap, showXAxis, label, extendRefLinesDown, showXAxisTicksOnly]);
  return <svg ref={ref} style={{ width, height, display: 'block' }} />;
}

export default function BrasilPage({ onBack, onNext }) {
  const [regiones, setRegiones] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/regiones`).then(r => r.json()).then(d => setRegiones(d.regiones));
    fetch(`${API_URL}/api/sectores`).then(r => r.json()).then(d => setSectores(d.sectores));
  }, []);

  useEffect(() => {
    let url = `${API_URL}/api/datos`;
    const params = [];
    if (region) params.push(`region=${encodeURIComponent(region)}`);
    if (sector) params.push(`sector=${encodeURIComponent(sector)}`);
    if (params.length) url += `?${params.join('&')}`;
    fetch(url).then(r => r.json()).then(setDatos);
  }, [region, sector]);

  // Datos para los gráficos
  const colorMap = { 'Externo': '#c1121f', 'Interno': '#888' };
  // Filtrar solo Município
  const datosMunicipio = datos.filter(d => d.tipo_ente === 'Município');
  const datosGraf1 = datosMunicipio.filter(d => {
    const year = new Date(d.fecha_contratacion).getFullYear();
    return year !== 2009;
  });
  const datosGraf2 = datosMunicipio.filter(d => d.tiempo_prestamo > 13);

  // Cálculo de métricas para los botones
  // Promedio anual de aprobaciones EXTERNAS últimos 5 años (en millones USD)
  const now = new Date();
  const lastYear = now.getFullYear();
  const datosUlt5Externo = datosMunicipio.filter(d => {
    const year = new Date(d.fecha_contratacion).getFullYear();
    return year >= lastYear - 4 && year <= lastYear && d.RGF_clasificacion === 'Externo';
  });
  const totalAprobUlt5Externo = datosUlt5Externo.reduce((sum, d) => sum + (d.valor_usd || 0), 0);
  const promAprobUlt5 = totalAprobUlt5Externo / 5 / 1e6; // millones USD solo externos

  // Definir datosUlt5 para todos los préstamos de los últimos 5 años
  const datosUlt5 = datosMunicipio.filter(d => {
    const year = new Date(d.fecha_contratacion).getFullYear();
    return year >= lastYear - 4 && year <= lastYear;
  });

  // Promedio de financiamiento solo FONPLATA últimos 5 años
  const datosFonplata = datosUlt5.filter(d => d.nombre_acreedor && d.nombre_acreedor.toUpperCase().includes('FONPLATA'));
  const totalFonplata = datosFonplata.reduce((sum, d) => sum + (d.valor_usd || 0), 0);
  const promFonplata = totalFonplata / 5 / 1e6; // millones USD

  // Calcular tabla de % Externa por rango de plazo según instrucciones detalladas
  const plazos = [
    { label: 'Menor a 5 años', min: 0, max: 4 },
    { label: '5 a 8 años', min: 5, max: 8 },
    { label: '9 a 13 años', min: 9, max: 13 },
    { label: '15 a 20 años', min: 15, max: 20 },
    { label: 'Mayor a 20 años', min: 21, max: 1000 },
  ];
  // Paso 1: Filtrar base de datos
  const datosFiltrados = datosMunicipio.filter(d =>
    d.garantia_soberana === 'Si' &&
    d.tiempo_prestamo !== null && d.tiempo_prestamo !== undefined &&
    (() => { const y = new Date(d.fecha_contratacion).getFullYear(); return y >= 2020 && y <= 2024; })() &&
    (d.RGF_clasificacion === 'Externo' || d.RGF_clasificacion === 'Interno')
  );
  // Paso 2 y 3: Clasificar y agrupar
  const tablaPlazos = plazos.map(rango => {
    const prestamosRango = datosFiltrados.filter(d => d.tiempo_prestamo >= rango.min && d.tiempo_prestamo <= rango.max);
    const total = prestamosRango.length;
    const externos = prestamosRango.filter(d => d.RGF_clasificacion === 'Externo').length;
    return {
      plazo: rango.label,
      porcentajeExterna: total > 0 ? (100 * externos / total).toFixed(1) : '0.0'
    };
  });

  return (
    <div style={{ background: '#f7f7f9', padding: '0', position: 'relative' }}>
      {/* Barra superior con logo y botón */}
      <div style={{
        width: '100%',
        boxSizing: 'border-box',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 20,
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 3.5rem 0.5rem 2.5rem',
        minHeight: 72,
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={fonpilogo} alt="Fonplata Logo" style={{ height: 48, marginRight: 12 }} />
        </div>
        <a
          href="https://sadipemxfonplata.streamlit.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#c1121f',
            fontWeight: 400,
            fontSize: '1.13rem',
            textDecoration: 'none',
            padding: 0,
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          Explorar Datos
        </a>
      </div>
      <div style={{ paddingTop: 12 }} />
      {/* Botón de flecha arriba */}
      <div
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            if (onBack) onBack();
          }, 1000); // Espera 1 segundo
        }}
        style={{
          position: 'fixed',
          top: 100,
          right: 32,
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f' }} />
      </div>
      {/* Botón de flecha abajo */}
      <div
        onClick={() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          setTimeout(() => {
            if (onNext) onNext();
          }, 1000); // Espera 1 segundo
        }}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 32,
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        aria-label="Ir a siguiente slide"
        title="Ir a siguiente slide"
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f', transform: 'rotate(180deg)' }} />
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'stretch', maxWidth: 1400, margin: '0 auto', padding: '0', flexWrap: 'wrap', height: 'calc(100vh - 72px)' }}>
        {/* Izquierda: Card descriptivo con título y texto */}
        <div
          style={{
            flex: 1,
            minWidth: 380,
            maxWidth: 480,
            background: '#fff',
            borderRadius: 0,
            boxShadow: '0 4px 24px #0001',
            border: 'none',
            marginLeft: 0,
            marginTop: '3.7rem',
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '2.5rem 2rem 2rem 2rem',
            boxSizing: 'border-box',
            height: '100%',
            minHeight: '100%',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            gap: '1.2rem',
            justifyContent: 'flex-start',
          }}
        >
          <h2 style={{ color: '#c1121f', fontWeight: 700, fontSize: '2rem', margin: '0 0 0.7rem 0', padding: 0, width: '100%' }}>
            Externo Vs Interno
          </h2>
          <div style={{ color: '#222', fontSize: '1.13rem', width: '100%' }}>
            Entre 2010 y 2024 la mayor parte de la deuda municipal fue <span style={{color:'#888', fontWeight:'bold'}}>interna</span>. El recurso <span style={{color:'#c1121f', fontWeight:'bold'}}>externo</span> gana peso en picos concretos de 2016 a 2018, por ejemplo. En 2024 vuelve a incrementarse la franja externa.
            <br /><br />
            {/* Tabla de plazos y % externa */}
            <div style={{ margin: '0.7em 0', width: '100%' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.88rem', background: '#fafbfc' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd', padding: '0.22em 0.5em', fontWeight: 600, color: '#222' }}>Plazo</th>
                    <th style={{ textAlign: 'left', borderBottom: '2px solid #ddd', padding: '0.22em 0.5em', fontWeight: 600, color: '#222' }}>% Externa</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaPlazos.map(row => (
                    <tr key={row.plazo}>
                      <td style={{ borderBottom: '1px solid #eee', padding: '0.22em 0.5em', color: '#222' }}>{row.plazo}</td>
                      <td style={{ borderBottom: '1px solid #eee', padding: '0.22em 0.5em', color: '#c1121f', fontWeight: 600 }}>{row.porcentajeExterna}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span style={{display:'block', marginTop:'1.2em'}}>
              En plazos más largos, el patrón se <b>invierte</b>: tres de cada cuatro reales provienen del exterior, en donde se encuentran nuestros pares multilaterales.
            </span>
            
          </div>
        </div>
        {/* Derecha: Gráficos */}
        <div style={{ flex: 1, minWidth: 350, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 56, paddingTop: 0, paddingLeft: 0, marginTop: 56 }}>
          {/* Métricas tipo botón arriba de los gráficos */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 18, marginTop: '-2.5rem', marginLeft: 0 }}>
            <div style={{ background: '#f3f4f7', color: '#444', fontSize: '0.98rem', fontWeight: 500, borderRadius: 0, padding: '0.7em 1.6em 0.7em 1.2em', boxShadow: '0 1px 6px #0001', display: 'flex', alignItems: 'center', minWidth: 220, position: 'relative', fontFamily: 'inherit', border: 'none', marginRight: 0 }}>
              <span style={{ fontWeight: 400, color: '#444', marginRight: 8 }}>Aprobación Prom. Anual</span>
              <span style={{ fontWeight: 700, color: '#c1121f', fontSize: '1.25em', marginLeft: 8 }}>{promAprobUlt5 ? promAprobUlt5.toLocaleString('es-ES', { maximumFractionDigits: 1 }) : '--'}</span>
              <span style={{ fontWeight: 500, color: '#c1121f', fontSize: '0.98em', marginLeft: 4 }}>M USD</span>
            </div>
            <div style={{ background: '#f3f4f7', color: '#444', fontSize: '0.98rem', fontWeight: 500, borderRadius: 0, padding: '0.7em 1.6em 0.7em 1.2em', boxShadow: '0 1px 6px #0001', display: 'flex', alignItems: 'center', minWidth: 220, position: 'relative', fontFamily: 'inherit', border: 'none', marginRight: 0 }}>
              <span style={{ fontWeight: 400, color: '#444', marginRight: 8 }}>Fonplata Prom. Anual</span>
              <span style={{ fontWeight: 700, color: '#c1121f', fontSize: '1.25em', marginLeft: 8 }}>{promFonplata ? promFonplata.toLocaleString('es-ES', { maximumFractionDigits: 1 }) : '--'}</span>
              <span style={{ fontWeight: 500, color: '#c1121f', fontSize: '0.98em', marginLeft: 4 }}>M USD</span>
            </div>
          </div>
          {/* Leyenda de colores para los gráficos */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 8, marginTop: 0, justifyContent: 'center', width: '100%' }}>
            <span style={{ color: '#c1121f', fontWeight: 600, fontSize: '1.01rem', letterSpacing: '0.01em' }}>Externo</span>
            <span style={{ color: '#888', fontWeight: 600, fontSize: '1.01rem', letterSpacing: '0.01em' }}>Interno</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row' }}>
            <BarChartD3 data={datosGraf1} colorMap={colorMap} width={600} height={260} showXAxis={false} extendRefLinesDown={true} />
            <div style={{ display: 'flex', alignItems: 'center', height: 260, marginRight: 8, justifyContent: 'center' }}>
              <div style={{ border: '2px solid #c1121f', borderRadius: 20, background: 'rgba(255,255,255,0.0)', color: '#c1121f', fontSize: '0.95rem', fontFamily: 'inherit', fontWeight: 500, letterSpacing: '0.01em', boxSizing: 'border-box', padding: '0.2em 1.2em', minWidth: 120, textAlign: 'center', whiteSpace: 'nowrap', display: 'inline-block', transform: 'rotate(90deg)', transformOrigin: 'center center' }}>
                Plazo &gt; 0 Años
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row' }}>
            <BarChartD3 data={datosGraf2} colorMap={colorMap} width={600} height={260} showXAxis={true} showXAxisTicksOnly={true} />
            <div style={{ display: 'flex', alignItems: 'center', height: 260, marginRight: 8, justifyContent: 'center' }}>
              <div style={{ border: '2px solid #c1121f', borderRadius: 20, background: 'rgba(255,255,255,0.0)', color: '#c1121f', fontSize: '0.95rem', fontFamily: 'inherit', fontWeight: 500, letterSpacing: '0.01em', boxSizing: 'border-box', padding: '0.2em 1.2em', minWidth: 120, textAlign: 'center', whiteSpace: 'nowrap', display: 'inline-block', transform: 'rotate(90deg)', transformOrigin: 'center center' }}>
                Plazo &gt; 13 Años
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 