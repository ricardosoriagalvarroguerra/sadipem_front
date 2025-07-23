import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import BrasilPage from './BrasilPage';
import FinanciadorMontosPage from './FinanciadorMontosPage';
import RegionesFinanciadorPage from './RegionesFinanciadorPage';
import DescripcionMercadoPage from './DescripcionMercadoPage';
import ClustersPage from './ClustersPage';
import OportunidadesPage from './OportunidadesPage';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/brasil" element={<BrasilPage onBack={() => navigate('/')} onNext={() => navigate('/financiador-montos')} />} />
          <Route path="/financiador-montos" element={<FinanciadorMontosPage onBack={() => navigate('/brasil')} onNext={() => navigate('/regiones-financiador')} />} />
          <Route path="/regiones-financiador" element={<RegionesFinanciadorPage onBack={() => navigate('/financiador-montos')} onNext={() => navigate('/descripcion-mercado')} />} />
          <Route path="/descripcion-mercado" element={<DescripcionMercadoPage onBack={() => navigate('/regiones-financiador')} onNext={() => navigate('/clusters')} />} />
          <Route path="/clusters" element={<ClustersPage onBack={() => navigate('/descripcion-mercado')} onNext={dest => dest === 'oportunidades' ? navigate('/oportunidades') : navigate('/')} />} />
          <Route path="/oportunidades" element={<OportunidadesPage onBack={() => navigate('/clusters')} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
