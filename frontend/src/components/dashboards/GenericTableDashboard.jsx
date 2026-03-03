import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GenericTableDashboard({ type, data }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const getTitleByType = (type) => {
    const titles = {
      'fuentes-usos': 'Balance General - Fuentes y Usos',
      'auditoria': 'Análisis de Merma',
      'comercial-ventas': 'Ventas por Canal',
      'equipo-ventas': 'Desempeño Equipo de Ventas',
      'humana-personal': 'Planta de Personal',
      'humana-costos': 'Costos de Nómina',
      'humana-retiros': 'Retiros de Personal',
      'logistica': 'Gestión Logística',
      'produccion-encasetado': 'Producción - Encasetado',
      'produccion-granjas': 'Capacidad de Granjas',
      'sagrilaft': 'Sistema SAGRILAFT'
    };
    return titles[type] || 'Dashboard';
  };

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    // Convertir a número si es string numérico
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Formatear moneda
    if ((key.includes('valor') || key.includes('ventas') || key.includes('cartera') || key.includes('total')) && typeof numValue === 'number' && !isNaN(numValue)) {
      if (numValue > 1000) {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(numValue);
      }
    }
    
    // Formatear porcentaje
    if ((key.includes('porcentaje') || key.includes('variacion')) && typeof numValue === 'number' && !isNaN(numValue)) {
      return `${numValue.toFixed(2)}%`;
    }
    
    // Si es número, formatearlo con separadores de miles
    if (typeof numValue === 'number' && !isNaN(numValue)) {
      return numValue.toLocaleString('es-CO');
    }
    
    return value;
  };

  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key !== 'created_at' && key !== 'updated_at' && key !== 'id');
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      {/* Tabla de datos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-xl font-semibold text-white mb-6">{getTitleByType(type)}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {columns.map((col) => (
                  <th key={col} className="text-left py-3 px-4 text-gray-400 font-medium capitalize">
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="py-3 px-4 text-white">
                      {formatValue(col, row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Total de registros: {data.length}
        </div>
      </motion.div>

      {/* Gráfico si hay datos numéricos */}
      {type === 'produccion-encasetado' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Programado vs Real</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.filter(d => d.anio === 2025).slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Bar dataKey="programado" fill="#38bdf8" name="Programado" />
              <Bar dataKey="real" fill="#10b981" name="Real" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
