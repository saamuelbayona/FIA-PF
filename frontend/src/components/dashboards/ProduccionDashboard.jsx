import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Factory, TrendingUp, Calendar } from 'lucide-react';

export default function ProduccionDashboard({ data }) {
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
  const totalProg2024 = data.reduce((sum, d) => sum + (parseFloat(d.prog_2024) || 0), 0);
  const totalReal2024 = data.reduce((sum, d) => sum + (parseFloat(d.real_2024) || 0), 0);
  const totalReal2025 = data.reduce((sum, d) => sum + (parseFloat(d.encasetado_real_2025) || 0), 0);
  
  const cumplimiento2024 = totalProg2024 > 0 ? ((totalReal2024 / totalProg2024) * 100).toFixed(1) : 0;
  const variacion2025vs2024 = totalReal2024 > 0 ? (((totalReal2025 - totalReal2024) / totalReal2024) * 100).toFixed(1) : 0;

  // Datos para gráficos
  const chartData = data.map(d => ({
    mes: d.mes,
    prog2024: parseFloat(d.prog_2024) || 0,
    real2024: parseFloat(d.real_2024) || 0,
    real2025: parseFloat(d.encasetado_real_2025) || 0
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
            <span className="text-gray-400 text-sm">Total Real 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalReal2025)}</div>
          <div className="text-sm text-gray-400">2024: {formatNumber(totalReal2024)}</div>
          <div className={`text-sm mt-1 ${variacion2025vs2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacion2025vs2024 > 0 ? '+' : ''}{variacion2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cumplimiento 2024</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{cumplimiento2024}%</div>
          <div className="text-sm text-gray-400 mt-1">Real vs Programado</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Variación 2025</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalReal2025 - totalReal2024)}</div>
          <div className={`text-sm mt-1 ${variacion2025vs2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacion2025vs2024 > 0 ? '+' : ''}{variacion2025vs2024}% de cambio
          </div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación Mensual 2024 vs 2025 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Producción Real 2024 vs 2025</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value)}
              />
              <Legend />
              <Bar dataKey="real2024" fill="#6366f1" name="Real 2024" />
              <Bar dataKey="real2025" fill="#10b981" name="Real 2025" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cumplimiento 2024: Programado vs Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Cumplimiento 2024: Programado vs Real</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="prog2024" stroke="#f59e0b" strokeWidth={2} name="Programado 2024" />
              <Line type="monotone" dataKey="real2024" stroke="#6366f1" strokeWidth={2} name="Real 2024" />
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
        <h3 className="text-lg font-semibold text-white mb-4">Histórico de Sacrificio - Comparativa Mensual</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Mes</th>
              <th className="text-right py-2 px-4 text-gray-400">Prog. 2024</th>
              <th className="text-right py-2 px-4 text-gray-400">Real 2024</th>
              <th className="text-right py-2 px-4 text-gray-400">Cumpl. 2024</th>
              <th className="text-right py-2 px-4 text-gray-400">Real 2025</th>
              <th className="text-right py-2 px-4 text-gray-400">Var. 2025 vs 2024</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const prog2024 = parseFloat(row.prog_2024) || 0;
              const real2024 = parseFloat(row.real_2024) || 0;
              const real2025 = parseFloat(row.encasetado_real_2025) || 0;
              const cumpl = prog2024 > 0 ? ((real2024 / prog2024) * 100).toFixed(1) : 0;
              const variacion = real2024 > 0 ? (((real2025 - real2024) / real2024) * 100).toFixed(1) : 0;
              
              return (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-4 text-white font-medium">{row.mes || 'N/A'}</td>
                  <td className="py-2 px-4 text-right text-yellow-400">{formatNumber(prog2024)}</td>
                  <td className="py-2 px-4 text-right text-blue-400">{formatNumber(real2024)}</td>
                  <td className={`py-2 px-4 text-right ${cumpl >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                    {cumpl}%
                  </td>
                  <td className="py-2 px-4 text-right text-green-400">{formatNumber(real2025)}</td>
                  <td className={`py-2 px-4 text-right ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {variacion > 0 ? '+' : ''}{variacion}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
