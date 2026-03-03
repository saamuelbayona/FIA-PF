import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Package } from 'lucide-react';

export default function ComercialDashboard({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0';
    
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Calcular totales
  const totalKg2025 = data.reduce((sum, d) => sum + (parseFloat(d.kg_2025) || 0), 0);
  const totalKg2024 = data.reduce((sum, d) => sum + (parseFloat(d.kg_2024) || 0), 0);
  const variacionTotal = totalKg2024 > 0 ? (((totalKg2025 - totalKg2024) / totalKg2024) * 100).toFixed(1) : 0;
  const cumplimientoPromedio = data.reduce((sum, d) => sum + (parseFloat(d.cumplimiento_meta) || 0), 0) / data.length;

  // Datos para gráficos
  const chartData = data.map(d => ({
    linea: d.linea && d.linea.length > 15 ? d.linea.substring(0, 15) + '...' : (d.linea || 'Sin línea'),
    kg2024: parseFloat(d.kg_2024) || 0,
    kg2025: parseFloat(d.kg_2025) || 0,
    participacion: parseFloat(d.pct_participacion) || 0
  }));

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
            <span className="text-gray-400 text-sm">Total Ventas 2025</span>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalKg2025)} kg</div>
          <div className="text-sm text-gray-400">2024: {formatNumber(totalKg2024)} kg</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cumplimiento Meta</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{cumplimientoPromedio.toFixed(1)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio por línea</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Variación Total</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalKg2025 - totalKg2024)} kg</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% de crecimiento
          </div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación 2024 vs 2025 por Línea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Ventas por Línea 2024 vs 2025</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="linea" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `${formatNumber(value)} kg`}
              />
              <Legend />
              <Bar dataKey="kg2024" fill="#6366f1" name="2024" />
              <Bar dataKey="kg2025" fill="#10b981" name="2025" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Participación por Línea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Participación por Línea 2025</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="participacion"
                nameKey="linea"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.linea}: ${entry.participacion.toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => `${value.toFixed(1)}%`}
              />
            </PieChart>
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
        <h3 className="text-lg font-semibold text-white mb-4">Detalle por Línea de Producto</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Línea</th>
              <th className="text-left py-2 px-4 text-gray-400">Categoría</th>
              <th className="text-right py-2 px-4 text-gray-400">Kg 2024</th>
              <th className="text-right py-2 px-4 text-gray-400">Kg 2025</th>
              <th className="text-right py-2 px-4 text-gray-400">Variación</th>
              <th className="text-right py-2 px-4 text-gray-400">% Participación</th>
              <th className="text-right py-2 px-4 text-gray-400">Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const kg2024 = parseFloat(row.kg_2024) || 0;
              const kg2025 = parseFloat(row.kg_2025) || 0;
              const variacion = kg2024 > 0 ? (((kg2025 - kg2024) / kg2024) * 100).toFixed(1) : 0;
              
              return (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-4 text-white font-medium">{row.linea || 'Sin línea'}</td>
                  <td className="py-2 px-4 text-gray-300">{row.categoria || 'Sin categoría'}</td>
                  <td className="py-2 px-4 text-right text-blue-400">{formatNumber(kg2024)}</td>
                  <td className="py-2 px-4 text-right text-green-400">{formatNumber(kg2025)}</td>
                  <td className={`py-2 px-4 text-right ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {variacion > 0 ? '+' : ''}{variacion}%
                  </td>
                  <td className="py-2 px-4 text-right text-purple-400">{parseFloat(row.pct_participacion || 0).toFixed(1)}%</td>
                  <td className="py-2 px-4 text-right text-yellow-400">{parseFloat(row.cumplimiento_meta || 0).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
