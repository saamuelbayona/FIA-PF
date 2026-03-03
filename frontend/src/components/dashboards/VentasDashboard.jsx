import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

export default function VentasDashboard({ data, type }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  // Dashboard de Equipo de Ventas
  if (type === 'equipo-ventas') {
    const totalVentasKg = data.reduce((sum, d) => sum + (d.ventas_kg || 0), 0);
    const totalVentasValor = data.reduce((sum, d) => sum + (d.ventas_valor || 0), 0);
    const promedioMeta = data.length > 0 ? (data.reduce((sum, d) => sum + (d.meta || 0), 0) / data.length).toFixed(1) : '0.0';
    const promedioCumplimiento = data.length > 0 ? (data.reduce((sum, d) => sum + (d.cumplimiento || 0), 0) / data.length).toFixed(1) : '0.0';

    // Top 5 vendedores
    const topVendedores = [...data].sort((a, b) => b.ventas_kg - a.ventas_kg).slice(0, 5);

    return (
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Ventas (Kg)</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalVentasKg.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Ventas ($)</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">{formatCurrency(totalVentasValor)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Meta Promedio</span>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{promedioMeta}%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Cumplimiento Promedio</span>
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{promedioCumplimiento}%</div>
          </motion.div>
        </div>

        {/* Top 5 Vendedores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top 5 Vendedores</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topVendedores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="vendedor" type="category" stroke="#9ca3af" width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => value.toLocaleString()}
              />
              <Legend />
              <Bar dataKey="ventas_kg" fill="#10b981" name="Ventas (Kg)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución por Sede */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Ventas por Sede</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(
                    data.reduce((acc, d) => {
                      acc[d.sede] = (acc[d.sede] || 0) + d.ventas_kg;
                      return acc;
                    }, {})
                  ).map(([sede, total]) => ({ name: sede, value: total }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cumplimiento por Vendedor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Cumplimiento de Meta</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topVendedores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="vendedor" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="cumplimiento" fill="#f59e0b" name="Cumplimiento %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Tabla detallada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Detalle por Vendedor</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400">Sede</th>
                <th className="text-left py-3 px-4 text-gray-400">Vendedor</th>
                <th className="text-right py-3 px-4 text-gray-400">Ventas (Kg)</th>
                <th className="text-right py-3 px-4 text-gray-400">Ventas ($)</th>
                <th className="text-right py-3 px-4 text-gray-400">Meta</th>
                <th className="text-right py-3 px-4 text-gray-400">Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{row.sede}</td>
                  <td className="py-3 px-4 text-white">{row.vendedor}</td>
                  <td className="py-3 px-4 text-right text-blue-400">{row.ventas_kg?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-green-400">{formatCurrency(row.ventas_valor)}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{row.meta}%</td>
                  <td className={`py-3 px-4 text-right ${row.cumplimiento >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {row.cumplimiento}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    );
  }

  // Dashboard de Ventas Comerciales
  const totalVentasKg = data.reduce((sum, d) => sum + (d.valor_kg || 0), 0);
  const promedioParticipacion = data.length > 0 ? (data.reduce((sum, d) => sum + (d.porcentaje_participacion || 0), 0) / data.length).toFixed(1) : '0.0';

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
            <span className="text-gray-400 text-sm">Total Ventas (Kg)</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalVentasKg.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Participación Promedio</span>
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioParticipacion}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Canales Activos</span>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{new Set(data.map(d => d.canal)).size}</div>
        </motion.div>
      </div>

      {/* Ventas por Canal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Ventas por Canal</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="canal" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend />
            <Bar dataKey="valor_kg" fill="#10b981" name="Ventas (Kg)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle por Canal y Sede</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400">Sede</th>
              <th className="text-left py-3 px-4 text-gray-400">Canal</th>
              <th className="text-left py-3 px-4 text-gray-400">Concepto</th>
              <th className="text-right py-3 px-4 text-gray-400">Valor (Kg)</th>
              <th className="text-right py-3 px-4 text-gray-400">Participación</th>
              <th className="text-right py-3 px-4 text-gray-400">Variación</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-3 px-4 text-white">{row.sede}</td>
                <td className="py-3 px-4 text-white">{row.canal}</td>
                <td className="py-3 px-4 text-gray-300">{row.concepto}</td>
                <td className="py-3 px-4 text-right text-blue-400">{row.valor_kg?.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-green-400">{row.porcentaje_participacion}%</td>
                <td className={`py-3 px-4 text-right ${row.variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.variacion > 0 ? '+' : ''}{row.variacion}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
