import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import DashboardRenderer from '../components/dashboards/DashboardRenderer';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { ROUTES } from '../routes/paths';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('fuentes-usos');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapeo de secciones a tipos de dashboard
  const sectionToDashboardType = {
    'fuentes-usos': 'fuentes-usos',
    'cartera': 'cartera',
    'comercial': 'comercial',
    'humana': 'humana',
    'logistica': 'logistica',
    'produccion-granjas': 'produccion-granjas',
    'produccion-historico': 'produccion-historico',
    'sagrilaft': 'sagrilaft',
    'gerencia': 'gerencia'
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  useEffect(() => {
    const dashboardType = sectionToDashboardType[activeSection];
    if (dashboardType) {
      loadDashboardData(dashboardType);
    }
  }, [activeSection]);

  const loadDashboardData = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardData(type);
      setDashboardData(response);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {activeSection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Análisis y métricas en tiempo real</p>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Cargando datos...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && dashboardData && (
            <DashboardRenderer type={sectionToDashboardType[activeSection]} data={dashboardData} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
