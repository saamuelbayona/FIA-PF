import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, AlertTriangle } from 'lucide-react';

export default function AuditoriaDashboard({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  // Separar por serie
  const data2024 = data.filter(d => d.serie === '2024');
  const data2025 = data.filter(d => d.serie === '2025');
  
  // Calcular promedio de merma
  const promedioMerma = data.length > 0 ? (data.reduce((sum, d) => sum + (d.porcentaje_merma || 0), 0) / data.length).toFixed(2) : '0.00';
  const maxMerma = data.length > 0 ? Math.max(...data.map(d => d.porcentaje_merma || 0)).toFixed(2) : '0.00';
  const minMerma = data.length > 0 ? Math.min(...data.map(d => d.porcentaje_merma || 0)).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Promedio Merma</span>
            <TrendingDown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioMerma}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-xl p-6 border border-red-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Máxima Merma</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{maxMerma}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Mínima Merma</span>
            <TrendingDown className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{minMerma}%</div>
        </motion.div>
      </div>

      {/* Gráfico de línea - Evolución de merma */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Evolución de Merma por Mes</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Line type="monotone" dataKey="porcentaje_merma" stroke="#f59e0b" name="% Merma" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Comparación 2024 vs 2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Comparación 2024 vs 2025</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data2025.map((d, i) => ({
            mes: d.mes,
            '2024': data2024[i]?.porcentaje_merma || 0,
            '2025': d.porcentaje_merma
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="2024" fill="#6366f1" name="2024" />
            <Bar dataKey="2025" fill="#10b981" name="2025" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
