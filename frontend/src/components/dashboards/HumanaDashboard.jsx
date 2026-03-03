import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Clock } from 'lucide-react';

export default function HumanaDashboard({ data }) {
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

  // Calcular totales
  const total2025 = data.reduce((sum, d) => sum + (parseFloat(d.valor_2025) || 0), 0);
  const total2024 = data.reduce((sum, d) => sum + (parseFloat(d.valor_2024) || 0), 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;
  const totalHoras = data.reduce((sum, d) => sum + (parseFloat(d.cantidad_horas) || 0), 0);

  // Datos para gráficos
  const chartData = data.slice(0, 10).map(d => ({
    concepto: d.concepto && d.concepto.length > 20 ? d.concepto.substring(0, 20) + '...' : (d.concepto || 'Sin concepto'),
    valor2024: parseFloat(d.valor_2024) || 0,
    valor2025: parseFloat(d.valor_2025) || 0
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
            <span className="text-gray-400 text-sm">Total Gestión 2025</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(total2025)}</div>
          <div className="text-sm text-gray-400">2024: {formatCurrency(total2024)}</div>
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
            <span className="text-gray-400 text-sm">Variación Anual</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(total2025 - total2024)}</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% de cambio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Horas</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalHoras.toLocaleString('es-CO')}</div>
          <div className="text-sm text-gray-400 mt-1">Horas registradas</div>
        </motion.div>
      </div>

      {/* Gráfico Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Conceptos - Comparativa 2024 vs 2025</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="concepto" type="category" stroke="#9ca3af" width={150} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="valor2024" fill="#6366f1" name="2024" />
            <Bar dataKey="valor2025" fill="#10b981" name="2025" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla Detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle de Gestión Humana - Comparativa 2024 vs 2025</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Concepto</th>
              <th className="text-right py-2 px-4 text-gray-400">Valor 2024</th>
              <th className="text-right py-2 px-4 text-gray-400">Valor 2025</th>
              <th className="text-right py-2 px-4 text-gray-400">Variación</th>
              <th className="text-right py-2 px-4 text-gray-400">%</th>
              <th className="text-right py-2 px-4 text-gray-400">Horas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const val2024 = parseFloat(row.valor_2024) || 0;
              const val2025 = parseFloat(row.valor_2025) || 0;
              const variacion = val2025 - val2024;
              const variacionPct = val2024 > 0 ? ((variacion / val2024) * 100).toFixed(1) : 0;
              
              return (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 px-4 text-white">{row.concepto || 'Sin concepto'}</td>
                  <td className="py-2 px-4 text-right text-blue-400">{formatCurrency(val2024)}</td>
                  <td className="py-2 px-4 text-right text-green-400">{formatCurrency(val2025)}</td>
                  <td className={`py-2 px-4 text-right ${variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(Math.abs(variacion))}
                  </td>
                  <td className={`py-2 px-4 text-right ${variacionPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {variacionPct > 0 ? '+' : ''}{variacionPct}%
                  </td>
                  <td className="py-2 px-4 text-right text-purple-400">
                    {parseFloat(row.cantidad_horas || 0).toLocaleString('es-CO')}
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
