import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export default function CarteraDashboard({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0';
    
    const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
    return `$${formatted}`;
  };

  // Calcular promedios y totales
  const promedioCartera = data.reduce((sum, d) => sum + (parseFloat(d.total_cartera) || 0), 0) / data.length;
  const promedioMora = data.reduce((sum, d) => sum + (parseFloat(d.indice_mora) || 0), 0) / data.length;
  const promedioRotacion = data.reduce((sum, d) => sum + (parseFloat(d.rotacion_dias) || 0), 0) / data.length;

  // Datos para gráficos comparativos
  const chartData = data.map(d => ({
    mes: d.mes,
    exp2024: parseFloat(d.exp_millones_2024) || 0,
    exp2025: parseFloat(d.exp_millones_2025) || 0,
    mora: parseFloat(d.indice_mora) || 0,
    rotacion: parseFloat(d.rotacion_dias) || 0
  }));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cartera Promedio</span>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(promedioCartera)}</div>
          <div className="text-sm text-gray-400 mt-1">Promedio mensual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Índice de Mora</span>
            <TrendingDown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioMora.toFixed(2)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Rotación Cartera</span>
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioRotacion.toFixed(0)} días</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación Exportaciones 2024 vs 2025 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Exportaciones 2024 vs 2025 (Millones)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `$${value}M`}
              />
              <Legend />
              <Bar dataKey="exp2024" fill="#6366f1" name="2024" />
              <Bar dataKey="exp2025" fill="#10b981" name="2025" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Evolución Índice de Mora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Evolución Índice de Mora</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `${value}%`}
              />
              <Legend />
              <Line type="monotone" dataKey="mora" stroke="#f59e0b" strokeWidth={2} name="Índice Mora %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla Detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle Mensual de Cartera</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Mes</th>
              <th className="text-right py-2 px-4 text-gray-400">Total Cartera</th>
              <th className="text-right py-2 px-4 text-gray-400">Cartera Vencida</th>
              <th className="text-right py-2 px-4 text-gray-400">Índice Mora</th>
              <th className="text-right py-2 px-4 text-gray-400">Rotación (días)</th>
              <th className="text-right py-2 px-4 text-gray-400">Exp 2024 (M)</th>
              <th className="text-right py-2 px-4 text-gray-400">Exp 2025 (M)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-4 text-white font-medium">{row.mes || 'N/A'}</td>
                <td className="py-2 px-4 text-right text-blue-400">{formatCurrency(row.total_cartera)}</td>
                <td className="py-2 px-4 text-right text-red-400">{formatCurrency(row.cartera_vencida)}</td>
                <td className="py-2 px-4 text-right text-yellow-400">{parseFloat(row.indice_mora || 0).toFixed(2)}%</td>
                <td className="py-2 px-4 text-right text-green-400">{parseFloat(row.rotacion_dias || 0).toFixed(0)}</td>
                <td className="py-2 px-4 text-right text-purple-400">${parseFloat(row.exp_millones_2024 || 0).toFixed(1)}M</td>
                <td className="py-2 px-4 text-right text-green-400">${parseFloat(row.exp_millones_2025 || 0).toFixed(1)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
