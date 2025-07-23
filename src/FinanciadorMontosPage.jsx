import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';
import BoxPlot from './components/BoxPlot';

const API_URL = import.meta.env.VITE_API_URL;

// Puedes agregar aquí componentes de gráficos si los necesitas

export default function FinanciadorMontosPage({ onBack, onNext }) {
  // Estados para datos, regiones, sectores, etc. (puedes adaptar según la lógica que necesites)
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
        aria-label="Ir a slide anterior"
        title="Ir a slide anterior"
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
            Financiador por Montos
          </h2>
          <div style={{ color: '#222', fontSize: '1.13rem', width: '100%' }}>
            {/* Aquí va el texto descriptivo de la página Financiador por Montos */}
            <span style={{display:'block', marginTop:'1.2em'}}>
              <span style={{color:'#c1121f', fontWeight:700}}>FONPLATA</span> se ubica en la franja media del ecosistema financiero: supera con holgura a los bancos nacionales (Caixa y, en buena medida, BNDES) pero queda por debajo de los grandes multilaterales.
            </span>
            <span style={{display:'block', marginTop:'1.2em'}}>
              Estratégicamente, actúa como <b>bisagra entre la banca de desarrollo local y los MDB's</b>: ofrece montos moderados de 10-50 M USD que cubren el vacío entre préstamos pequeños y grandes, cofinanciando fases o componentes específicos.
            </span>
            <span style={{display:'block', marginTop:'1.2em'}}>
              <b>En síntesis:</b> FONPLATA no compite por volumen con el BID o el BIRF, pero sobresale como el actor con mayor “potencia” dentro del segmento interno y como un socio predecible para proyectos de tamaño medio en el entorno subnacional.
            </span>
          </div>
        </div>
        {/* Derecha: Espacio para gráficos */}
        <div style={{ flex: 1, minWidth: 350, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 56, paddingTop: 0, paddingLeft: 0, marginTop: 140 }}>
          {/* Botones para cambiar de vista */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 40, justifyContent: 'center', marginTop: -16 }}>
            <span
              onClick={() => setVista('exteriores')}
              style={{
                cursor: 'pointer',
                color: vista === 'exteriores' ? '#c1121f' : '#888',
                fontWeight: vista === 'exteriores' ? 700 : 500,
                fontSize: 18,
                borderBottom: vista === 'exteriores' ? '3px solid #c1121f' : '2px solid transparent',
                padding: '4px 0',
                transition: 'color 0.2s, border-bottom 0.2s',
                letterSpacing: '0.01em',
              }}
            >Actores Exteriores</span>
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
            >Actores Internos</span>
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
          </div>
          {/* Aquí puedes agregar los componentes de gráficos que desees */}
          <div style={{ width: '100%', height: 400, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem', background: 'transparent' }}>
            <BoxPlot datos={datos} width={700} height={450} acreedoresMostrar={acreedoresMostrar} />
          </div>
        </div>
      </div>
    </div>
  );
} 