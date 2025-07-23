import { FaArrowUp } from 'react-icons/fa';
import fonpilogo from './assets/fonpilogo.png';
import { useEffect, useState } from 'react';
import useWindowSize from './hooks/useWindowSize';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function OportunidadesPage({ onBack, onNext }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const tableWidth = Math.min(730, windowWidth - (isMobile ? 40 : 200));
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
          top: isMobile ? 60 : 80,
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
      {/* Botón de flecha abajo (deshabilitado/oculto) */}
      {/* <div
        style={{
          position: 'fixed',
          bottom: 40,
          right: 32,
          opacity: 0.3,
          pointerEvents: 'none',
          display: 'none',
        }}
      >
        <FaArrowUp style={{ fontSize: 36, color: '#c1121f', transform: 'rotate(180deg)' }} />
      </div> */}
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
            Oportunidades
          </h2>
          <div style={{ color: '#222', fontSize: '1rem', width: '100%' }}>
            <span style={{display:'block', marginTop:'5em', marginBottom:'5em'}}>
              Para <b style={{color:'#c1121f'}}>FONPLATA</b>, las oportunidades más afines se encuentran en municipios con tickets promedio entre 10 y 50 millones de dólares y sectores como desarrollo urbano, transporte y agua. <b>Marabá</b> resalta como el caso más atractivo por monto y sector. Otros municipios como <b>Valinhos</b>, <b>Vilhena</b> y <b>Ponta Grossa</b> también presentan potencial, aunque sus tickets individuales son algo menores.
            </span>
            <span style={{display:'block', marginTop:'5em', marginBottom:'5em', color:'#888', fontSize:'0.91em'}}>
              Cabe aclarar que este análisis no constituye una sugerencia de inversión, sino una descripción de los municipios que presentan mayor afinidad con el perfil operativo y el rol que juega FONPLATA en el mercado regional de financiamiento al desarrollo.
            </span>
          </div>
        </div>
        {/* Derecha: Espacio para gráficos o contenido futuro */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 300, maxWidth: isMobile ? '100%' : 700, display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 0, paddingTop: 0, paddingLeft: 0, marginTop: isMobile ? 20 : '3.7rem', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: tableWidth, height: 600, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem', background: 'transparent', overflow: 'hidden', boxSizing: 'border-box', margin: '0 auto' }}>
            {/* Tabla de mejores calificaciones por criterios invariables1 y CAPAG "A" */}
            <MejoresMunicipiosTable />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tabla de mejores municipios con toggles
function MejoresMunicipiosTable() {
  const municipios = [
    { nombre: 'Abreu e Lima', poblacion: '100.698', region: 'Nordeste', endeudamiento: 74 },
    { nombre: 'Piraquara', poblacion: '116.852', region: 'Sul', endeudamiento: 87 },
    { nombre: 'Vilhena', poblacion: '104.517', region: 'Norte', endeudamiento: 111 },
    { nombre: 'Conselheiro Lafaiete', poblacion: '130.584', region: 'Sudeste', endeudamiento: 123 },
    { nombre: 'Jataí', poblacion: '103.221', region: 'Centro-Oeste', endeudamiento: 152 },
    { nombre: 'Barcarena', poblacion: '129.333', region: 'Norte', endeudamiento: 191 },
    { nombre: 'Itaquaquecetuba', poblacion: '379.082', region: 'Sudeste', endeudamiento: 196 },
    { nombre: 'Valinhos', poblacion: '133.169', region: 'Sudeste', endeudamiento: 217 },
    { nombre: 'Ponta Grossa', poblacion: '358.838', region: 'Sul', endeudamiento: 240 },
    { nombre: 'Chapecó', poblacion: '227.587', region: 'Sul', endeudamiento: 290 },
    { nombre: 'Marabá', poblacion: '287.664', region: 'Norte', endeudamiento: 320 },
    { nombre: 'Dourados', poblacion: '227.990', region: 'Centro-Oeste', endeudamiento: 359 },
    { nombre: 'Cubatão', poblacion: '132.521', region: 'Sudeste', endeudamiento: 477 },
    { nombre: 'São Gonçalo', poblacion: '1.098.357', region: 'Sudeste', endeudamiento: 485 },
    { nombre: 'Serra', poblacion: '536.765', region: 'Sudeste', endeudamiento: 511 },
    { nombre: 'Paulínia', poblacion: '114.508', region: 'Sudeste', endeudamiento: 583 },
    { nombre: 'São Luís', poblacion: '1.115.932', region: 'Nordeste', endeudamiento: 1284 },
  ];
  // Datos de detalles por municipio
  const detalles = {
    'Abreu e Lima': {
      financiadores: null,
      sectores: null,
      ticket: null,
    },
    'Piraquara': {
      financiadores: [
        { nombre: 'Caixa', monto: 23279100 },
        { nombre: 'Agência de Fomento do Paraná S/A', monto: 15677640 },
        { nombre: 'Banco do Brasil S/A', monto: 6102150 },
        { nombre: 'Banco Regional de Desenvolvimento do Extremo Sul', monto: 992211 },
      ],
      sectores: [
        { nombre: 'Transport policy, planning and administration', monto: 29329010 },
        { nombre: 'Urban development', monto: 9923447 },
        { nombre: 'Other', monto: 4704849 },
        { nombre: 'Social protection and welfare services policy', monto: 1101579 },
      ],
      ticket: 2878194,
    },
    'Vilhena': {
      financiadores: [
        { nombre: 'Caixa', monto: 23117240 },
      ],
      sectores: [
        { nombre: 'Transport policy, planning and administration', monto: 18160560 },
        { nombre: 'Urban development', monto: 4956679 },
      ],
      ticket: 7705748,
    },
    'Conselheiro Lafaiete': {
      financiadores: null,
      sectores: null,
      ticket: null,
    },
    'Jataí': {
      financiadores: [
        { nombre: 'Caixa', monto: 11493064 },
      ],
      sectores: [
        { nombre: 'Formal sector financial intermediaries', monto: 11493064 },
      ],
      ticket: 11493064,
    },
    'Barcarena': {
      financiadores: null,
      sectores: null,
      ticket: null,
    },
    'Itaquaquecetuba': {
      financiadores: [
        { nombre: 'Caixa', monto: 3582440 },
      ],
      sectores: [
        { nombre: 'Urban development', monto: 3582440 },
      ],
      ticket: 3582440,
    },
    'Valinhos': {
      financiadores: [
        { nombre: 'Agência de Fomento do Estado de São Paulo', monto: 14112067 },
        { nombre: 'Caixa', monto: 456541 },
        { nombre: 'Banco do Brasil S/A', monto: 3727426 },
      ],
      sectores: [
        { nombre: 'Transport policy, planning and administration', monto: 8940545 },
        { nombre: 'Water supply - large systems', monto: 5171522 },
        { nombre: 'Urban development', monto: 3727426 },
      ],
      ticket: 7056034,
    },
    'Ponta Grossa': {
      financiadores: [
        { nombre: 'Caixa', monto: 28003148 },
        { nombre: 'Banco do Brasil S/A', monto: 3778888 },
        { nombre: 'Banco Regional de Desenvolvimento do Extremo Sul', monto: 2280734 },
        { nombre: 'Agência de Fomento do Paraná S/A', monto: 5660470 },
      ],
      sectores: [
        { nombre: 'Transport policy, planning and administration', monto: 19097850 },
        { nombre: 'Urban development', monto: 13231478 },
        { nombre: 'Water supply - large systems', monto: 5660470 },
        { nombre: 'Other', monto: 1021442 },
      ],
      ticket: 6557257,
    },
    'Chapecó': {
      financiadores: [
        { nombre: 'Agência de Fomento do Estado de Santa Catarina S.A.', monto: 2080673 },
      ],
      sectores: [
        { nombre: 'Transport policy, planning and administration', monto: 2080673 },
      ],
      ticket: 2080673,
    },
    'Marabá': {
      financiadores: [
        { nombre: 'Caixa', monto: 26516000 },
        { nombre: 'Banco do Brasil S/A', monto: 169600 },
      ],
      sectores: [
        { nombre: 'Other', monto: 26516000 },
        { nombre: 'Urban development', monto: 169600 },
      ],
      ticket: 13350800,
    },
    'Dourados': {
      financiadores: [
        { nombre: 'FONPLATA', monto: 8136200 },
      ],
      sectores: [
        { nombre: 'Other', monto: 8136200 },
      ],
      ticket: 8136200,
    },
    'Cubatão': {
      financiadores: [
        { nombre: 'Caixa', monto: 1977387 },
      ],
      sectores: [
        { nombre: 'Urban development', monto: 1977387 },
      ],
      ticket: 1977387,
    },
    'São Gonçalo': {
      financiadores: [
        { nombre: 'Caixa', monto: 73555720 },
      ],
      sectores: [
        { nombre: 'Formal sector financial intermediaries', monto: 73555720 },
      ],
      ticket: 73555720,
    },
    'Serra': {
      financiadores: [
        { nombre: 'Caixa', monto: 3768817 },
      ],
      sectores: [
        { nombre: 'Urban development', monto: 3768817 },
      ],
      ticket: 3768817,
    },
    'Paulínia': {
      financiadores: null,
      sectores: null,
      ticket: null,
    },
    'São Luís': {
      financiadores: [
        { nombre: 'Caixa', monto: 7471630 },
        { nombre: 'Banco do Brasil S/A', monto: 8271630 },
      ],
      sectores: [
        { nombre: 'Other', monto: 15743260 },
      ],
      ticket: 15743260,
    },
  };
  const [expandido, setExpandido] = useState(Array(municipios.length).fill(false));
  const toggleExpand = idx => setExpandido(a => a.map((v, i) => i === idx ? !v : v));
  return (
    <div style={{ width: 730, height: 570, background: '#fff', borderRadius: 10, boxShadow: '0 4px 24px #0001', padding: '1.2rem 1.2rem', fontSize: 13, overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', margin: '0 auto' }}>
      <div style={{ fontWeight: 700, color: '#c1121f', fontSize: 17, marginBottom: 10, textAlign: 'center', width: '100%' }}>
        Mejores calificaciones por criterios invariables y CAPAG "A"
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f7f7f9' }}>
            <th style={{ textAlign: 'center', padding: '8px 6px', fontWeight: 700, color: '#111', width: 36 }}></th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111' }}>Municipio</th>
            <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 700, color: '#111' }}>Población</th>
            <th style={{ textAlign: 'left', padding: '8px 6px', fontWeight: 700, color: '#111' }}>Región</th>
            <th style={{ textAlign: 'right', padding: '8px 6px', fontWeight: 700, color: '#111' }}>Espacio endeudamiento</th>
          </tr>
        </thead>
        <tbody>
          {municipios.map((m, idx) => (
            <>
              <tr key={m.nombre} style={{ borderBottom: '1px solid #eee', background: expandido[idx] ? '#f3f3f7' : '#fff', transition: 'background 0.18s' }}>
                <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                  <button onClick={() => toggleExpand(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none' }} aria-label={expandido[idx] ? 'Cerrar detalles' : 'Ver detalles'}>
                    {expandido[idx] ? <FaChevronDown color="#c1121f" size={16} /> : <FaChevronRight color="#c1121f" size={16} />}
                  </button>
                </td>
                <td style={{ padding: '8px 6px', fontWeight: 500, color: '#222' }}>{m.nombre}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right', color: '#333' }}>{m.poblacion}</td>
                <td style={{ padding: '8px 6px', color: '#444' }}>{m.region}</td>
                <td style={{ padding: '8px 6px', textAlign: 'right', color: '#c1121f', fontWeight: 600 }}>{m.endeudamiento}</td>
              </tr>
              {expandido[idx] && (
                <tr>
                  <td colSpan={5} style={{ background: '#f8f8fa', padding: '12px 18px', color: '#333', fontSize: 13, borderBottom: '1px solid #eee' }}>
                    <div style={{ padding: '0.2em 0.2em 0.2em 1.2em' }}>
                      <b>Top Financiadores:</b><br/>
                      {detalles[m.nombre].financiadores ? (
                        <ol style={{ margin: '0.2em 0 0.7em 1.2em', padding: 0 }}>
                          {detalles[m.nombre].financiadores.map((f, i) => (
                            <li key={f.nombre + i} style={{ marginBottom: 2 }}>
                              {f.nombre} – USD {(f.monto / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span style={{ color: '#888' }}>No se encontraron registros para este municipio en la base.</span>
                      )}
                      <b>Top Sectores:</b><br/>
                      {detalles[m.nombre].sectores ? (
                        <ol style={{ margin: '0.2em 0 0.7em 1.2em', padding: 0 }}>
                          {detalles[m.nombre].sectores.map((s, i) => (
                            <li key={s.nombre + i} style={{ marginBottom: 2 }}>
                              {s.nombre} – USD {(s.monto / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span style={{ color: '#888' }}>No se encontraron registros para este municipio en la base.</span>
                      )}
                      <b>Ticket promedio:</b> {detalles[m.nombre].ticket ? `USD ${(detalles[m.nombre].ticket / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M` : <span style={{ color: '#888' }}>No disponible</span>}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
} 