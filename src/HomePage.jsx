import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import useWindowSize from './hooks/useWindowSize';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import fonpilogo from './assets/fonpilogo.png';
import { FaSearch } from 'react-icons/fa';
import BrasilPage from './BrasilPage';
import { AnimatePresence, motion } from 'framer-motion';
import * as d3 from 'd3';

const countries = [
  { name: 'Brasil', code: 'BR', color: '#1976d2', clickable: true },
  { name: 'Argentina', code: 'AR', color: '#e0e0e0', clickable: false },
  { name: 'Uruguay', code: 'UY', color: '#e0e0e0', clickable: false },
  { name: 'Paraguay', code: 'PY', color: '#e0e0e0', clickable: false },
  { name: 'Bolivia', code: 'BO', color: '#e0e0e0', clickable: false },
  { name: 'Chile', code: 'CL', color: '#e0e0e0', clickable: false },
  { name: 'Perú', code: 'PE', color: '#e0e0e0', clickable: false },
  { name: 'Ecuador', code: 'EC', color: '#e0e0e0', clickable: false },
  { name: 'Colombia', code: 'CO', color: '#e0e0e0', clickable: false },
  { name: 'Venezuela', code: 'VE', color: '#e0e0e0', clickable: false },
  { name: 'Guyana', code: 'GY', color: '#e0e0e0', clickable: false },
  { name: 'Surinam', code: 'SR', color: '#e0e0e0', clickable: false },
  { name: 'Guayana Francesa', code: 'GF', color: '#e0e0e0', clickable: false },
];

const countryPaths = {
  BR: "M 220 220 L 250 200 L 270 230 L 260 270 L 230 280 L 210 260 L 220 220 Z",
  AR: "M 230 280 L 260 270 L 270 320 L 250 350 L 220 340 L 210 300 L 230 280 Z",
  UY: "M 250 350 L 270 320 L 280 340 L 260 360 L 250 350 Z",
  PY: "M 230 280 L 210 300 L 220 320 L 240 310 L 230 280 Z",
  BO: "M 210 260 L 230 280 L 240 310 L 220 320 L 200 300 L 210 260 Z",
  CL: "M 210 300 L 220 340 L 200 370 L 190 350 L 200 300 Z",
  PE: "M 200 230 L 210 260 L 200 300 L 190 270 L 180 240 L 200 230 Z",
  EC: "M 180 240 L 190 270 L 170 260 L 160 240 L 180 240 Z",
  CO: "M 170 210 L 180 240 L 160 240 L 150 210 L 170 210 Z",
  VE: "M 170 210 L 150 210 L 160 190 L 180 190 L 170 210 Z",
  GY: "M 180 190 L 190 200 L 200 190 L 180 190 Z",
  SR: "M 200 190 L 210 200 L 210 190 L 200 190 Z",
  GF: "M 210 190 L 220 200 L 220 190 L 210 190 Z",
};

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const svgRef = useRef();
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const mapWidth = Math.min(520, windowWidth - (isMobile ? 40 : 200));

  useEffect(() => {
    fetch('/geojson/southamerica.json')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select('#paises');
    g.selectAll('*').remove();
    // Proyección para Sudamérica (ajustada para 520x520, escala aún más reducida)
    const projection = d3.geoMercator()
      .scale(300)
      .center([-60, -15])
      .translate([260, 220]);
    const path = d3.geoPath().projection(projection);
    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => {
        if (hovered === (d.properties.iso_a2 || d.properties.admin)) {
          return '#c1121f';
        }
        return '#e0e0e0';
      })
      .attr('stroke', '#111')
      .attr('stroke-width', 0.3)
      .style('cursor', d => {
        const admin = d.properties.admin;
        return admin === 'Brazil' || admin === 'Brasil' ? 'pointer' : 'default';
      })
      .on('click', (event, d) => {
        const admin = d.properties.admin;
        if (admin === 'Brazil' || admin === 'Brasil') {
          setSearch('Brasil');
          setSelectedCountry('BR');
        }
      })
      .on('mouseenter', (event, d) => {
        setHovered(d.properties.iso_a2 || d.properties.admin);
      })
      .on('mouseleave', () => {
        setHovered(null);
      });
    // Ya no se agrega la etiqueta de texto 'BRASIL'.
  }, [geoData, hovered]);

  const particlesInit = async (engine) => {
    if (engine && typeof engine.checkVersion === 'function') {
      await loadFull(engine);
    }
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        options={{
          fullScreen: false,
          background: { color: 'transparent' },
          fpsLimit: 60,
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            opacity: { value: 0.4, random: true },
            size: { value: 2, random: true },
            move: { enable: true, speed: 0.5, direction: 'none', outModes: 'out' },
            links: {
              enable: true,
              color: '#ffffff',
              opacity: 0.18,
              width: 1,
              distance: 120,
            },
          },
          detectRetina: true,
        }}
      />
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#f7f7f9',
        position: 'relative',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 2.5rem',
      }}>
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
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          zIndex: 2,
          gap: isMobile ? 16 : 32,
          position: 'relative',
        }}>
          {/* Columna izquierda: texto y barra de selección */}
          <div style={{flex: 1, minWidth: isMobile ? '100%' : 320, maxWidth: isMobile ? '100%' : 500, paddingRight: isMobile ? 0 : 32}}>
            <h1 style={{color: '#c1121f', fontWeight: 700, fontSize: '2.5rem', marginBottom: 16}}>Contexto Estratégico</h1>
            {/* Buscador de país moderno */}
            <div style={{ marginBottom: 24, position: 'relative', maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '2px solid #c1121f', borderRadius: 8, boxShadow: '0 2px 8px rgba(193, 18, 31, 0.06)', padding: '0.5rem 1rem' }}>
                <FaSearch style={{ color: '#c1121f', marginRight: 8 }} />
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    if (e.target.value.toLowerCase().includes('brasil')) {
                      setSelectedCountry('BR');
                    } else {
                      setSelectedCountry(null);
                    }
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#c1121f',
                    background: 'transparent',
                    width: '100%',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                  }}
                />
              </div>
              {/* Sugerencia de Brasil */}
              {search && 'brasil'.startsWith(search.toLowerCase()) && search.toLowerCase() !== 'brasil' && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '100%',
                    background: '#fff',
                    border: '1px solid #c1121f',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 10,
                    cursor: 'pointer',
                    color: '#c1121f',
                    fontWeight: 500,
                    padding: '0.5rem 1rem',
                  }}
                  onClick={() => {
                    setSearch('Brasil');
                    setSelectedCountry('BR');
                  }}
                >
                  Brasil
                </div>
              )}
            </div>
            <p style={{fontSize: '1.15rem', color: '#333', margin: '1.5rem 0 2.5rem'}}>
              Visualización interactiva de datos de deuda pública subnacional en Brasil y Sudamérica.<br/>
              Explora la información seleccionando el país en el mapa o buscador.
            </p>
            {/* Botón Comenzar */}
            <button
              disabled={!selectedCountry}
              onClick={() => {
                navigate('/brasil');
              }}
              style={{
                background: '#c1121f',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.13rem',
                padding: '0.7rem 2.1rem',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(193, 18, 31, 0.10)',
                textDecoration: 'none',
                border: 'none',
                outline: 'none',
                cursor: !selectedCountry ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
                marginTop: 16,
                opacity: !selectedCountry ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              Comenzar
            </button>
          </div>
          {/* Columna derecha: globo terraqueo SVG realista de Sudamérica */}
          <div style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: isMobile ? '100%' : 520, position: 'relative'}}>
            <svg ref={svgRef} viewBox="0 0 520 520" width={mapWidth} height={mapWidth} style={{background: 'none'}}>
              <circle cx="250" cy="260" r="240" fill="none" stroke="#111" strokeWidth="0.7" />
              <g id="paises" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
} 