import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import useWindowSize from './hooks/useWindowSize';
import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';
// Aquí puedes importar tu componente de gráfico específico para esta página si lo necesitas

const API_URL = import.meta.env.VITE_API_URL;

export default function RegionesFinanciadorPage({ onBack, onNext }) {
  const [regiones, setRegiones] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [datos, setDatos] = useState([]);
  const [vista, setVista] = useState('exteriores');
  // Listas de acreedores para cada vista
  const acreedoresExteriores = ['FONPLATA', 'BID', 'NDB', 'CAF', 'BIRF'];
  const acreedoresInternos = ['FONPLATA', 'Caixa', 'BNDS'];
  const acreedoresTodos = ['Caixa', 'FONPLATA', 'BNDS', 'BID', 'NDB', 'CAF', 'BIRF'];
  let acreedoresMostrar = acreedoresExteriores;
  if (vista === 'internos') acreedoresMostrar = acreedoresInternos;
  if (vista === 'todos') acreedoresMostrar = acreedoresTodos;
  const [valoresEnte, setValoresEnte] = useState([]);
  const [mapaTipo, setMapaTipo] = useState('montos'); // 'montos', 'financiador', 'sectores'
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const chartWidth = Math.min(800, windowWidth - (isMobile ? 40 : 200));

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

  useEffect(() => {
    fetch(`${API_URL}/api/valores_ente`).then(r => r.json()).then(setValoresEnte);
  }, []);

  // Filtrar valoresEnte solo con garantia_soberana 'Si'
  const valoresEnteFiltrados = valoresEnte.filter(v => (v.garantia_soberana === 'Si'));

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
          top: isMobile ? 80 : 100,
          right: isMobile ? 16 : 32,
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
          bottom: isMobile ? 80 : 100,
          right: isMobile ? 16 : 32,
          cursor: 'pointer',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        aria-label="Ir a slide anterior"
        title="Ir a slide anterior"
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f', transform: 'rotate(180deg)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1.5rem' : '2.5rem', alignItems: 'stretch', maxWidth: 1400, margin: '0 auto', padding: '0', flexWrap: 'wrap', height: isMobile ? 'auto' : 'calc(100vh - 72px)' }}>
        {/* Izquierda: Card descriptivo con título y texto */}
        <div
          style={{
            flex: 1,
            minWidth: isMobile ? '100%' : 320,
            maxWidth: isMobile ? '100%' : 480,
            background: '#fff',
            borderRadius: 0,
            boxShadow: '0 4px 24px #0001',
            border: 'none',
            marginLeft: 0,
            marginTop: isMobile ? '1.5rem' : '3.7rem',
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '2.5rem 2rem 2rem 2rem',
            boxSizing: 'border-box',
            height: isMobile ? 'auto' : '100%',
            minHeight: isMobile ? 'auto' : '100%',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            gap: '1.2rem',
            justifyContent: 'flex-start',
          }}
        >
          <h2 style={{ color: '#c1121f', fontWeight: 700, fontSize: '2rem', margin: '0 0 0.7rem 0', padding: 0, width: '100%' }}>
            Regiones por Financiador
          </h2>
          {/* Botones de tipo de mapa */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <button
              onClick={() => setMapaTipo('montos')}
              style={{
                background: mapaTipo === 'montos' ? '#c1121f' : '#fff',
                color: mapaTipo === 'montos' ? '#fff' : '#c1121f',
                border: '1.5px solid #c1121f',
                borderRadius: 6,
                padding: '7px 22px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: mapaTipo === 'montos' ? '0 2px 8px #c1121f22' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Montos
            </button>
            <button
              onClick={() => setMapaTipo('financiador')}
              style={{
                background: mapaTipo === 'financiador' ? '#c1121f' : '#fff',
                color: mapaTipo === 'financiador' ? '#fff' : '#c1121f',
                border: '1.5px solid #c1121f',
                borderRadius: 6,
                padding: '7px 22px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: mapaTipo === 'financiador' ? '0 2px 8px #c1121f22' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Financiador
            </button>
            <button
              onClick={() => setMapaTipo('sectores')}
              style={{
                background: mapaTipo === 'sectores' ? '#c1121f' : '#fff',
                color: mapaTipo === 'sectores' ? '#fff' : '#c1121f',
                border: '1.5px solid #c1121f',
                borderRadius: 6,
                padding: '7px 22px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: mapaTipo === 'sectores' ? '0 2px 8px #c1121f22' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Sectores
            </button>
          </div>
          <div style={{ color: '#222', fontSize: '0.98rem', width: '100%' }}>
            {/* Aquí va el texto descriptivo de la página Regiones por Financiador */}
            {mapaTipo === 'sectores' ? (
              <>
                <p><b>En el Sudeste</b>, el financiamiento se concentra principalmente en intermediación financiera, urbanismo y transporte, sectores que dominan el volumen aprobado y reflejan un enfoque en infraestructura urbana y financiera.</p>
                <p><b>El Nordeste</b> muestra una mayor diversidad sectorial, destacándose urbanismo, transporte, saneamiento y agua potable. Esta región combina muchas operaciones con una orientación clara hacia servicios básicos y modernización territorial.</p>
                <p><b>En el Norte, Centro-Oeste y Sul</b>, el financiamiento también prioriza urbanismo, saneamiento y agua potable, aunque con variaciones: en el Norte y Centro-Oeste se observan operaciones grandes pero menos frecuentes, mientras que el Sul presenta montos más bajos y proyectos más fragmentados.</p>
              </>
            ) : mapaTipo === 'financiador' ? (
              <>
                <p>En el <b>Sudeste</b>, el financiamiento lo dominan organismos multilaterales como el BID y el BIRF, seguidos por Caixa y el NDB. Su peso refleja la capacidad de la región para atraer y ejecutar operaciones de gran escala.</p>
                <p>En el <b>Nordeste</b>, el panorama es más plural. Además del BID y el BIRF, destacan CAF, FONPLATA, AFD y BNDES, lo que indica un entorno más competitivo y colaborativo entre multilaterales y bancos regionales.</p>
                <p>En el <b>Norte</b>, <b>Centro-Oeste</b> y <b>Sul</b>, una sola operación de un actor como BID, BIRF o FONPLATA suele concentrar la mayor parte del financiamiento, evidenciando una menor actividad, pero fuerte dependencia de acuerdos puntuales con grandes acreedores.</p>
              </>
            ) : (
              <>
                <p>El financiamiento con garantía soberana y a largo plazo se concentra en el <b>Sudeste</b> y el <b>Nordeste</b>, que reúnen el 66.6% del monto aprobado entre 2019 y 2024. Este protagonismo responde a su peso económico y capacidad para estructurar grandes proyectos.</p>
                <p>El <b>Nordeste</b> lidera en cantidad de operaciones, pero con montos menores, mientras que el <b>Sudeste</b> y el <b>Norte</b> destacan por proyectos de mayor escala. Esto sugiere una estrategia más diversificada en el <b>Nordeste</b> y una orientación a grandes inversiones en las otras regiones.</p>
                <p><b>Sul</b> y <b>Centro-Oeste</b> tienen una participación marginal, posiblemente por menor demanda o capacidad técnica. El <b>Norte</b>, aunque con pocas operaciones, sobresale por su alto valor promedio, reflejando apuestas estratégicas puntuales. </p>
              </>
            )}
          </div>
        </div>
        {/* Derecha: Espacio para gráficos */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 300, maxWidth: isMobile ? '100%' : 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: isMobile ? 0 : 56, paddingTop: 0, paddingLeft: 0, marginTop: isMobile ? 60 : 100 }}>
          {/* Aquí puedes agregar los componentes de gráficos que desees */}
          <div style={{ width: '100%', height: 600, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem', background: 'transparent' }}>
            <MapaBrasilInteractivo width={chartWidth} height={600} valoresEnte={valoresEnte} mapaTipo={mapaTipo} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MapaBrasilInteractivo({ width = 600, height = 400, valoresEnte = [], mapaTipo = 'montos' }) {
  const ref = useRef();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [geojsonMunicipios, setGeojsonMunicipios] = useState(null);
  const tooltipRef = useRef();

  // Mapeo de rutas de municipios por estado (completo)
  const rutasMunicipios = {
    // Norte
    'AC': '/geojson/Norte/Acre/geojs-12-mun.json',
    'AP': '/geojson/Norte/Amapa/geojs-16-mun.json',
    'AM': '/geojson/Norte/Amazonas/geojs-13-mun.json',
    'PA': '/geojson/Norte/Para/geojs-15-mun.json',
    'RO': '/geojson/Norte/Rondonia/geojs-11-mun.json',
    'RR': '/geojson/Norte/Roraima/geojs-14-mun.json',
    'TO': '/geojson/Norte/Tocantis/geojs-14-mun.json',
    // Nordeste
    'AL': '/geojson/Nordeste/Alagoas/geojs-27-mun.json',
    'BA': '/geojson/Nordeste/Bahia/geojs-29-mun.json',
    'CE': '/geojson/Nordeste/Ceara/geojs-23-mun.json',
    'MA': '/geojson/Nordeste/Maranhao/geojs-21-mun.json',
    'PB': '/geojson/Nordeste/Paraiba/geojs-25-mun.json',
    'PE': '/geojson/Nordeste/Pernambuco/geojs-26-mun.json',
    'PI': '/geojson/Nordeste/Piaui/geojs-22-mun.json',
    'RN': '/geojson/Nordeste/Rio Grande do Norte/geojs-24-mun.json',
    'SE': '/geojson/Nordeste/Sergipe/geojs-28-mun.json',
    // Centro-Oeste
    'DF': '/geojson/Centro-Oeste/DF/geojs-53-mun.json',
    'GO': '/geojson/Centro-Oeste/Goias/geojs-52-mun.json',
    'MT': '/geojson/Centro-Oeste/Mato Grosso/geojs-51-mun.json',
    'MS': '/geojson/Centro-Oeste/Mato Grosso do Sul/geojs-50-mun.json',
    // Sudeste
    'ES': '/geojson/Sudeste/Espiritu Santo/geojs-32-mun.json',
    'MG': '/geojson/Sudeste/Mina Gerais/geojs-31-mun.json',
    'RJ': '/geojson/Sudeste/Rio de Janeiro/geojs-33-mun.json',
    'SP': '/geojson/Sudeste/Sao Paulo/geojs-33-mun.json',
    // Sul
    'PR': '/geojson/Sul/Parana/geojs-41-mun.json',
    'RS': '/geojson/Sul/Rio Grande do Sul/geojs-43-mun.json',
    'SC': '/geojson/Sul/Santa Catarina/geojs-42-mun.json',
  };

  function normalizarNombre(nombre) {
    return (nombre || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  // Filtrar valoresEnte solo con garantia_soberana 'Si'
  const valoresEnteFiltrados = valoresEnte.filter(v => (v.garantia_soberana === 'Si'));

  function getTotalUSD(ente) {
    const normEnte = normalizarNombre(ente);
    const found = valoresEnteFiltrados.find(
      v => normalizarNombre(v.ente) === normEnte
    );
    return found ? found.total_usd : null;
  }

  // Escala de colores para heatmap (más contraste)
  const colores = ['#ffe5e5', '#ffb3b3', '#ff6666', '#ff1a1a', '#b30000'];
  // Paleta de colores por financiador (personalizada)
  const colorFinanciadorPersonalizado = {
    'Fonplata': '#c1121f',
    'FONPLATA': '#c1121f',
    'Caixa': '#ffb703',
    'BID': '#003049',
    'BIRF': '#0466c8',
    'CAF': '#008000',
    'BNDS': '#ff7d00',
    'NDB': '#a020f0', // púrpura para NDB
    'BDB': '#fb8500',
  };
  const coloresFinanciador = [
    '#c1121f', '#ffb703', '#003049', '#0466c8', '#008000', '#ff7d00', '#a020f0',
    '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#4daf4a', '#984ea3', '#e41a1c', '#377eb8'
  ];
  // Paleta de colores por sector (formal, sobria)
  const coloresSector = [
    '#4b5563', // gris oscuro
    '#2563eb', // azul
    '#059669', // verde
    '#b45309', // marrón
    '#64748b', // gris azulado
    '#334155', // gris pizarra
    '#7c3aed', // violeta sobrio
    '#be185d', // vino
    '#0e7490', // azul petróleo
    '#a16207', // mostaza oscuro
    '#365314', // verde oliva
    '#78350f', // marrón oscuro
    '#0369a1', // azul profundo
    '#52525b', // gris medio
    '#a21caf', // púrpura oscuro
  ];
  // Construir mapeo de sector a color
  const allSectores = Array.from(new Set(valoresEnte.flatMap(v => (v.top_sectores||[]).map(f => f.sector))));
  const colorSectorMap = {};
  allSectores.forEach((f, i) => { colorSectorMap[f] = coloresSector[i % coloresSector.length]; });

  // Para modo financiador: mapeo de financiador principal a color
  function getColorFinanciador(ente) {
    const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(ente));
    if (!registro || !registro.top_financiadores || !registro.top_financiadores.length) return '#d3d3d3';
    // El financiador principal es el primero del top
    const nombreFin = nombreFinanciadorCorto(registro.top_financiadores[0]?.nombre_acreedor || '');
    return colorFinMap[nombreFin] || '#d3d3d3';
  }
  // Construir mapeo de nombre_acreedor a color
  const allFinanciadores = Array.from(new Set(valoresEnte.flatMap(v => (v.top_financiadores||[]).map(f => nombreFinanciadorCorto(f.nombre_acreedor)))));
  const colorFinMap = {};
  // Set de colores ya usados por los financiadores fijos
  const coloresFijosUsados = new Set(Object.values(colorFinanciadorPersonalizado));
  // Paleta para los no fijos, omitiendo los colores ya usados
  const coloresDisponibles = coloresFinanciador.filter(c => !coloresFijosUsados.has(c));
  let colorIdx = 0;
  allFinanciadores.forEach((f) => {
    if (colorFinanciadorPersonalizado[f]) {
      colorFinMap[f] = colorFinanciadorPersonalizado[f];
    } else {
      colorFinMap[f] = coloresDisponibles[colorIdx % coloresDisponibles.length];
      colorIdx++;
    }
  });

  // Para modo sectores: mapeo de sector principal a color
  function getColorSector(ente) {
    const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(ente));
    if (!registro || !registro.top_sectores || !registro.top_sectores.length) return '#d3d3d3';
    // El sector principal es el primero del top
    const nombreSec = registro.top_sectores[0]?.sector || '';
    return colorSectorMap[nombreSec] || '#d3d3d3';
  }

  // Obtener valores para estados
  const valoresEstados = geojsonMunicipios ? [] : (valoresEnte.map(v => v.total_usd).filter(v => v != null));
  const minUSD = d3.min(valoresEstados);
  const maxUSD = d3.max(valoresEstados);
  const colorScale = d3.scaleQuantize()
    .domain([minUSD || 0, maxUSD || 1])
    .range(colores);

  // Obtener valores para municipios SOLO del estado seleccionado
  let valoresMunicipios = [];
  if (geojsonMunicipios && geojsonMunicipios.features) {
    valoresMunicipios = geojsonMunicipios.features.map(f => getTotalUSD(f.properties?.name)).filter(v => v != null);
  }
  const minUSDmun = d3.min(valoresMunicipios);
  const maxUSDmun = d3.max(valoresMunicipios);
  const colorScaleMun = d3.scaleQuantize()
    .domain([minUSDmun || 0, maxUSDmun || 1])
    .range(colores);

  // Leyenda para el modo Montos
  function LeyendaMontos({ min, max, colores }) {
    return (
      <div style={{ position: 'absolute', bottom: 6, left: 18, background: 'rgba(255,255,255,0.95)', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: '4px 14px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 13 }}>
        <div style={{ fontWeight: 600, marginBottom: 2, color: '#111' }}>Escala Montos (USD millones)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {colores.map((c, i) => (
            <div key={i} style={{ width: 32, height: 9, background: c, borderRadius: 2, border: '1px solid #ccc', marginRight: i < colores.length-1 ? 2 : 0 }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: colores.length * 32 + (colores.length-1)*2, marginTop: 1 }}>
          <span style={{ color: '#444' }}>{min !== null ? min.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : ''}</span>
          <span style={{ color: '#444' }}>{max !== null ? max.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : ''}</span>
        </div>
      </div>
    );
  }

  // Leyenda para el modo Financiador
  function LeyendaFinanciador({ colorFinMap }) {
    const financiadores = Object.keys(colorFinMap);
    if (financiadores.length === 0) return null;
    return (
      <div style={{ position: 'absolute', bottom: 6, left: 18, background: 'rgba(255,255,255,0.95)', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: '4px 14px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 13, maxWidth: 220 }}>
        <div style={{ fontWeight: 600, marginBottom: 2, color: '#111' }}>Financiador principal</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 120, overflowY: 'auto' }}>
          {financiadores.map((f, i) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 1 }}>
              <span style={{ display: 'inline-block', width: 18, height: 10, background: colorFinMap[f], borderRadius: 2, border: '1px solid #ccc' }} />
              <span style={{ color: '#333', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{nombreFinanciadorCorto(f)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Leyenda para el modo Sectores
  function LeyendaSectores({ colorSectorMap }) {
    const sectores = Object.keys(colorSectorMap);
    if (sectores.length === 0) return null;
    return (
      <div style={{ position: 'absolute', bottom: 6, left: 18, background: 'rgba(255,255,255,0.95)', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: '4px 14px', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 13, maxWidth: 220 }}>
        <div style={{ fontWeight: 600, marginBottom: 2, color: '#111' }}>Sector principal</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 120, overflowY: 'auto' }}>
          {sectores.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 1 }}>
              <span style={{ display: 'inline-block', width: 18, height: 10, background: colorSectorMap[s], borderRadius: 2, border: '1px solid #ccc' }} />
              <span style={{ color: '#333', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Utilidad para mostrar nombre corto de financiador
  function nombreFinanciadorCorto(nombre) {
    if (!nombre) return '';
    if (nombre === 'Banco Nacional de Desenvolvimento Econômico e Social') return 'BNDS';
    if (nombre === 'New Development Bank') return 'NDB';
    if (nombre === 'Banco do Brasil S/A') return 'BDB';
    return nombre;
  }

  // Cargar y dibujar el mapa de Brasil o el de municipios
  useEffect(() => {
    let svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    let tooltip = d3.select(tooltipRef.current);
    const container = ref.current?.parentElement;
    function getRelativeCoords(event) {
      const rect = container.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
    if (!estadoSeleccionado) {
      d3.json('/geojson/Estados/br_states.json').then(geojson => {
        const projection = d3.geoMercator().fitSize([width, height], geojson);
        const path = d3.geoPath().projection(projection);
        svg.selectAll('path')
          .data(geojson.features)
          .join('path')
          .attr('d', path)
          .attr('fill', d => {
            const nombre = d.properties?.Estado;
            if (mapaTipo === 'montos') {
              const totalUSD = getTotalUSD(nombre);
              return totalUSD != null ? colorScale(totalUSD) : '#d3d3d3';
            } else if (mapaTipo === 'financiador') {
              return getColorFinanciador(nombre);
            } else if (mapaTipo === 'sectores') {
              return getColorSector(nombre);
            }
            return '#d3d3d3';
          })
          .attr('stroke', '#000')
          .attr('stroke-width', 1.2)
          .attr('opacity', d => {
            const nombre = d.properties?.Estado;
            const totalUSD = getTotalUSD(nombre);
            return totalUSD != null ? 1 : 0.12;
          })
          .style('cursor', 'pointer')
          .on('click', (event, d) => {
            const id = d.id;
            if (rutasMunicipios[id]) {
              setEstadoSeleccionado({ id, nombre: d.properties?.Estado || id });
              d3.json(rutasMunicipios[id]).then(setGeojsonMunicipios);
            } else {
              alert('No hay geojson de municipios para este estado aún.');
            }
          })
          .on('mousemove', function(event, d) {
            const { x, y } = getRelativeCoords(event);
            const nombre = d.properties?.Estado;
            const totalUSD = getTotalUSD(nombre);
            let tooltipHtml = `<b>${nombre}</b><br/>`;
            if (mapaTipo === 'montos') {
              tooltipHtml += `${totalUSD !== null ? 'Total USD: $' + (totalUSD/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + 'M' : ''}`;
            } else if (mapaTipo === 'financiador') {
              const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(nombre));
              if (registro && registro.top_financiadores && registro.top_financiadores.length) {
                tooltipHtml += '<b>Top 5 Financiadores:</b><br/>';
                registro.top_financiadores.slice(0,5).sort((a, b) => b.total_usd - a.total_usd).forEach(f => {
                  tooltipHtml += `<span style='color:${colorFinMap[nombreFinanciadorCorto(f.nombre_acreedor)]};font-weight:600'>${nombreFinanciadorCorto(f.nombre_acreedor)}</span>: $${(f.total_usd/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}M<br/>`;
                });
              } else {
                tooltipHtml += 'Sin datos de financiadores';
              }
            } else if (mapaTipo === 'sectores') {
              const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(nombre));
              if (registro && registro.top_sectores && registro.top_sectores.length) {
                tooltipHtml += '<b>Top 5 Sectores:</b><br/>';
                registro.top_sectores.slice(0,5).sort((a, b) => b.total_usd - a.total_usd).forEach(f => {
                  tooltipHtml += `<span style='color:${colorSectorMap[f.sector]};font-weight:600'>${f.sector}</span>: $${(f.total_usd/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}M<br/>`;
                });
              } else {
                tooltipHtml += 'Sin datos de sectores';
              }
            }
            tooltip
              .style('display', 'block')
              .style('left', (x + 16) + 'px')
              .style('top', (y - 24) + 'px')
              .html(tooltipHtml);
            d3.select(this).attr('stroke-width', 3);
          })
          .on('mouseleave', function () {
            tooltip.style('display', 'none');
            d3.select(this).attr('stroke-width', 1.2);
          });
      });
    } else if (geojsonMunicipios) {
      const projection = d3.geoMercator().fitSize([width, height], geojsonMunicipios);
      const path = d3.geoPath().projection(projection);
      svg.selectAll('path')
        .data(geojsonMunicipios.features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => {
          const nombre = d.properties?.name;
          if (mapaTipo === 'montos') {
            const totalUSD = getTotalUSD(nombre);
            return totalUSD != null ? colorScaleMun(totalUSD) : '#d3d3d3';
          } else if (mapaTipo === 'financiador') {
            return getColorFinanciador(nombre);
          } else if (mapaTipo === 'sectores') {
            return getColorSector(nombre);
          }
          return '#d3d3d3';
        })
        .attr('stroke', '#000')
        .attr('stroke-width', 0.7)
        .attr('opacity', d => {
          const nombre = d.properties?.name;
          const totalUSD = getTotalUSD(nombre);
          return totalUSD != null ? 1 : 0.12;
        })
        .on('mousemove', function(event, d) {
          const { x, y } = getRelativeCoords(event);
          const nombre = d.properties?.name;
          const totalUSD = getTotalUSD(nombre);
          let tooltipHtml = `<b>${nombre}</b><br/>`;
          if (mapaTipo === 'montos') {
            tooltipHtml += `${totalUSD !== null ? 'Total USD: $' + (totalUSD/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + 'M' : ''}`;
          } else if (mapaTipo === 'financiador') {
            const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(nombre));
            if (registro && registro.top_financiadores && registro.top_financiadores.length) {
              tooltipHtml += '<b>Top 5 Financiadores:</b><br/>';
              registro.top_financiadores.slice(0,5).sort((a, b) => b.total_usd - a.total_usd).forEach(f => {
                tooltipHtml += `<span style='color:${colorFinMap[nombreFinanciadorCorto(f.nombre_acreedor)]};font-weight:600'>${nombreFinanciadorCorto(f.nombre_acreedor)}</span>: $${(f.total_usd/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}M<br/>`;
              });
            } else {
              tooltipHtml += 'Sin datos de financiadores';
            }
          } else if (mapaTipo === 'sectores') {
            const registro = valoresEnte.find(v => normalizarNombre(v.ente) === normalizarNombre(nombre));
            if (registro && registro.top_sectores && registro.top_sectores.length) {
              tooltipHtml += '<b>Top 5 Sectores:</b><br/>';
              registro.top_sectores.slice(0,5).sort((a, b) => b.total_usd - a.total_usd).forEach(f => {
                tooltipHtml += `<span style='color:${colorSectorMap[f.sector]};font-weight:600'>${f.sector}</span>: $${(f.total_usd/1e6).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}M<br/>`;
              });
            } else {
              tooltipHtml += 'Sin datos de sectores';
            }
          }
          tooltip
            .style('display', 'block')
            .style('left', (x + 16) + 'px')
            .style('top', (y - 24) + 'px')
            .html(tooltipHtml);
          d3.select(this).attr('stroke-width', 2);
        })
        .on('mouseleave', function () {
          tooltip.style('display', 'none');
          d3.select(this).attr('stroke-width', 0.7);
        });
    }
    return () => { tooltip.style('display', 'none'); };
  }, [estadoSeleccionado, geojsonMunicipios, width, height, valoresEnte, mapaTipo]);

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Leyenda solo en modo Montos o Financiador */}
      {mapaTipo === 'montos' && (
        <LeyendaMontos 
          min={geojsonMunicipios ? (minUSDmun ? minUSDmun/1e6 : 0) : (minUSD ? minUSD/1e6 : 0)}
          max={geojsonMunicipios ? (maxUSDmun ? maxUSDmun/1e6 : 0) : (maxUSD ? maxUSD/1e6 : 0)}
          colores={colores}
        />
      )}
      {mapaTipo === 'financiador' && (
        <LeyendaFinanciador colorFinMap={colorFinMap} />
      )}
      {mapaTipo === 'sectores' && (
        <LeyendaSectores colorSectorMap={colorSectorMap} />
      )}
      <svg ref={ref} width={width} height={height} style={{ display: 'block' }} />
      <div ref={tooltipRef} style={{ position: 'absolute', pointerEvents: 'none', display: 'none', background: '#fff', color: '#111', borderRadius: 6, padding: '7px 14px', fontSize: 12, zIndex: 1000, minWidth: 60, boxShadow: '0 2px 8px #0002', fontWeight: 500, border: '1px solid #bbb' }} />
      {estadoSeleccionado && (
        <button
          onClick={() => { setEstadoSeleccionado(null); setGeojsonMunicipios(null); }}
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: '#fff', color: '#c1121f', border: '1px solid #c1121f', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px #0001' }}
        >
          Estados
        </button>
      )}
    </div>
  );
} 