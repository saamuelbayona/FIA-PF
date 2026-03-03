import GerenciaDashboard from './GerenciaDashboard';
import CarteraDashboard from './CarteraDashboard';
import FuentesUsosDashboard from './FuentesUsosDashboard';
import HumanaDashboard from './HumanaDashboard';
import LogisticaDashboard from './LogisticaDashboard';
import SagrilaftDashboard from './SagrilaftDashboard';
import GranjasDashboard from './GranjasDashboard';
import ComercialDashboard from './ComercialDashboard';
import ProduccionDashboard from './ProduccionDashboard';

export default function DashboardRenderer({ type, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-12 border border-slate-700 text-center">
        <div className="text-gray-400 text-lg">No hay datos disponibles para este dashboard</div>
      </div>
    );
  }

  switch (type) {
    case 'fuentes-usos':
      return <FuentesUsosDashboard data={data} />;
    case 'cartera':
      return <CarteraDashboard data={data} />;
    case 'comercial':
      return <ComercialDashboard data={data} />;
    case 'humana':
      return <HumanaDashboard data={data} />;
    case 'logistica':
      return <LogisticaDashboard data={data} />;
    case 'produccion-granjas':
      return <GranjasDashboard data={data} />;
    case 'produccion-historico':
      return <ProduccionDashboard data={data} />;
    case 'sagrilaft':
      return <SagrilaftDashboard data={data} />;
    case 'gerencia':
      return <GerenciaDashboard data={data} />;
    default:
      return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <div className="text-gray-400 text-lg mb-4">Dashboard tipo: {type}</div>
          <pre className="text-white text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
}
