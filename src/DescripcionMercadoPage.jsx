import { useEffect, useState } from 'react';
import useWindowSize from './hooks/useWindowSize';
import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';
import ScatterPlot from './components/ScatterPlot';

const acreedoresTodos = ['BIRF', 'BID', 'CAF', 'FONPLATA', 'Caixa', 'NDB', 'BNDS'];
const acreedoresExternos = ['BIRF', 'BID', 'CAF', 'FONPLATA'];
const acreedoresInternos = ['Caixa', 'BNDS', 'FONPLATA'];
const colorInstitucional = '#888';

function getAcreedores(vista) {
  if (vista === 'externos') return acreedoresExternos;
  if (vista === 'internos') return acreedoresInternos;
  return acreedoresTodos;
}

export default function DescripcionMercadoPage({ onBack, onNext }) {
  const [datos, setDatos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const [vista, setVista] = useState('todos');
  const [ocultos, setOcultos] = useState([]); // categorías ocultas
  const [yMax, setYMax] = useState(115);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const chartWidth = Math.min(650, windowWidth - (isMobile ? 40 : 200));

  // Altura y margen del área útil del gráfico
  const plotHeight = 500; // 600 - 40 (top) - 60 (bottom)
  const marginTop = 10;

  let acreedoresMostrar = getAcreedores(vista);
  let colorOverride = {};
  if (vista === 'externos') {
    colorOverride = { BIRF: colorInstitucional, BID: colorInstitucional, CAF: colorInstitucional, FONPLATA: '#c1121f' };
  } else if (vista === 'internos') {
    colorOverride = { Caixa: colorInstitucional, BNDS: colorInstitucional, FONPLATA: '#c1121f' };
  }

  // Filtrar acreedores según los ocultos
  const acreedoresFiltrados = acreedoresMostrar.filter(a => !ocultos.includes(a));

  useEffect(() => {
    fetch(`${API_URL}/api/datos`).then(r => r.json()).then(setDatos);
  }, [API_URL]);

  // Si cambia la vista, restaurar la lista de ocultos
  useEffect(() => {
    if (vista === 'todos') {
      setOcultos(['BIRF', 'BID', 'NDB', 'BNDS']);
    } else {
      setOcultos([]);
    }
  }, [vista]);

  // Calcular el máximo valor de los datos (en millones)
  const LIMITE_MAXIMO = 750; // 750 millones
  const maxDatos = Math.ceil(Math.max(1, ...datos.map(d => (d.valor_usd || 0) / 1e6)));
  const maxValor = LIMITE_MAXIMO;
  useEffect(() => {
    if (yMax === null) setYMax(115);
    else if (yMax > LIMITE_MAXIMO) setYMax(LIMITE_MAXIMO);
  }, [maxValor]);

  // Handler para click en la leyenda
  const handleToggleAcreedor = (acreedor) => {
    setOcultos(prev => prev.includes(acreedor) ? prev.filter(a => a !== acreedor) : [...prev, acreedor]);
  };

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
          }, 1000);
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
            if (onNext) onNext('clusters');
          }, 1000);
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
        aria-label="Ir a siguiente slide"
        title="Ir a siguiente slide"
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
            Descripción de Mercado
          </h2>
          {/* Botones para cambiar de vista */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 18, marginTop: 0 }}>
            <span
              onClick={() => setVista('todos')}
              style={{
                cursor: 'pointer',
                color: vista === 'todos' ? '#c1121f' : '#888',
                fontWeight: vista === 'todos' ? 700 : 500,
                fontSize: 18,
                borderBottom: vista === 'todos' ? '3px solid #c1121f' : '2px solid transparent',
                padding: '4px 0',
                transition: 'color 0.2s, border-bottom 0.2s',
                letterSpacing: '0.01em',
              }}
            >Todos</span>
            <span
              onClick={() => setVista('externos')}
              style={{
                cursor: 'pointer',
                color: vista === 'externos' ? '#c1121f' : '#888',
                fontWeight: vista === 'externos' ? 700 : 500,
                fontSize: 18,
                borderBottom: vista === 'externos' ? '3px solid #c1121f' : '2px solid transparent',
                padding: '4px 0',
                transition: 'color 0.2s, border-bottom 0.2s',
                letterSpacing: '0.01em',
              }}
            >Externos</span>
            <span
              onClick={() => setVista('internos')}
              style={{
                cursor: 'pointer',
                color: vista === 'internos' ? '#c1121f' : '#888',
                fontWeight: vista === 'internos' ? 700 : 500,
                fontSize: 18,
                borderBottom: vista === 'internos' ? '3px solid #c1121f' : '2px solid transparent',
                padding: '4px 0',
                transition: 'color 0.2s, border-bottom 0.2s',
                letterSpacing: '0.01em',
              }}
            >Internos</span>
          </div>
          <div style={{ color: '#222', fontSize: '1.13rem', width: '100%' }}>
            {/* Texto descriptivo de la página Descripción de Mercado */}
            <span style={{display:'block', marginTop:'1.2em'}}>
              <b style={{color:'#c1121f'}}>FONPLATA</b> muestra una “columna” muy definida entre 14 y 20 años de plazo y 20‑60 M USD de monto. La concentración es notable: la mayoría de sus operaciones se agrupan en ese rango, con una mediana de unos 17 años y 40 M USD aprox.<br/><br/>
              Por debajo de 10 M USD dominan los créditos de Caixa, mientras que a partir de 80 M USD destacan BNDS y, en menor medida, CAF. <b>Caixa también ofrece préstamos de montos menores con vencimientos de 20 a 25 años.</b>
            </span>
          </div>
        </div>
        {/* Derecha: Espacio para gráficos */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 300, maxWidth: isMobile ? '100%' : 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: isMobile ? 0 : 0, paddingTop: 0, paddingLeft: 0, marginTop: isMobile ? 60 : 100 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            {/* Slider vertical para eje Y */}
            {/* Altura del área útil del gráfico */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: plotHeight, marginRight: 0, marginTop }}>
              {/* Valor actual del slider */}
              <div style={{
                marginBottom: 8,
                fontSize: 13,
                color: '#c1121f',
                fontWeight: 700,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px #0001',
                padding: '2px 10px',
                minWidth: 60,
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}>
                {yMax?.toLocaleString('es-ES', { maximumFractionDigits: 0 })}M
              </div>
              <input
                type="range"
                min={1}
                max={LIMITE_MAXIMO}
                step={1}
                value={yMax || LIMITE_MAXIMO}
                onChange={e => setYMax(Number(e.target.value))}
                style={{
                  writingMode: 'bt-lr',
                  WebkitAppearance: 'slider-vertical',
                  width: 28,
                  height: plotHeight,
                  accentColor: '#c1121f',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
                aria-label="Ajustar máximo eje Y"
                className="slider-ymax"
              />
              {/* Estilos personalizados para el slider */}
              <style>{`
                input.slider-ymax[type="range"] {
                  -webkit-appearance: slider-vertical;
                  appearance: slider-vertical;
                  background: transparent;
                }
                input.slider-ymax[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 38px;
                  border-radius: 8px;
                  background: #fff;
                  box-shadow: 0 2px 8px #c1121f33;
                  border: 2px solid #c1121f;
                  cursor: pointer;
                  transition: background 0.2s;
                  margin-top: -2px;
                }
                input.slider-ymax[type="range"]:focus::-webkit-slider-thumb {
                  background: #f8f8f8;
                }
                input.slider-ymax[type="range"]::-webkit-slider-runnable-track {
                  width: 8px;
                  height: ${plotHeight}px;
                  background: #eee;
                  border-radius: 8px;
                  box-shadow: 0 1px 4px #0001;
                }
                input.slider-ymax[type="range"]::-moz-range-thumb {
                  width: 16px;
                  height: 38px;
                  border-radius: 8px;
                  background: #fff;
                  box-shadow: 0 2px 8px #c1121f33;
                  border: 2px solid #c1121f;
                  cursor: pointer;
                  transition: background 0.2s;
                }
                input.slider-ymax[type="range"]:focus::-moz-range-thumb {
                  background: #f8f8f8;
                }
                input.slider-ymax[type="range"]::-moz-range-track {
                  width: 8px;
                  height: ${plotHeight}px;
                  background: #eee;
                  border-radius: 8px;
                  box-shadow: 0 1px 4px #0001;
                }
                input.slider-ymax[type="range"]::-ms-thumb {
                  width: 16px;
                  height: 38px;
                  border-radius: 8px;
                  background: #fff;
                  box-shadow: 0 2px 8px #c1121f33;
                  border: 2px solid #c1121f;
                  cursor: pointer;
                  transition: background 0.2s;
                }
                input.slider-ymax[type="range"]:focus::-ms-thumb {
                  background: #f8f8f8;
                }
                input.slider-ymax[type="range"]::-ms-fill-lower {
                  background: #eee;
                  border-radius: 8px;
                }
                input.slider-ymax[type="range"]::-ms-fill-upper {
                  background: #eee;
                  border-radius: 8px;
                }
                input.slider-ymax[type="range"]:focus {
                  outline: none;
                }
                input.slider-ymax[type="range"]::-ms-tooltip {
                  display: none;
                }
                input.slider-ymax[type="range"] {
                  margin: 0;
                  padding: 0;
                }
              `}</style>
            </div>
            <div style={{ width: '100%', height: 600, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem', background: 'transparent' }}>
              <ScatterPlot datos={datos} width={chartWidth} height={600} acreedoresMostrar={acreedoresFiltrados} colorOverride={colorOverride} onLegendClick={handleToggleAcreedor} legendActive={a => !ocultos.includes(a)} legendOrder={acreedoresMostrar} yMax={yMax || LIMITE_MAXIMO} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 