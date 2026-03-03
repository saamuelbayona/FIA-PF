import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SagrilaftDashboard({ data }) {
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
  const totalRechazados = data.reduce((sum, d) => sum + (parseFloat(d.rechazados) || 0), 0);
  const promedioLaFt = data.reduce((sum, d) => sum + (parseFloat(d.pct_la_ft) || 0), 0) / data.length;
  const promedioFallaDoc = data.reduce((sum, d) => sum + (parseFloat(d.pct_falla_doc) || 0), 0) / data.length;
  const promedioAntecedentes = data.reduce((sum, d) => sum + (parseFloat(d.pct_antecedentes) || 0), 0) / data.length;

  // Datos para gráficos
  const chartData = data.map(d => ({
    contraparte: d.contraparte && d.contraparte.length > 15 ? d.contraparte.substring(0, 15) + '...' : (d.contraparte || 'Sin nombre'),
    rechazados: parseFloat(d.rechazados) || 0,
    laFt: parseFloat(d.pct_la_ft) || 0,
    fallaDoc: parseFloat(d.pct_falla_doc) || 0,
    antecedentes: parseFloat(d.pct_antecedentes) || 0
  }));

  // Datos para gráfico de pastel de motivos
  const motivosData = [
    { name: 'LA/FT', value: promedioLaFt },
    { name: 'Falla Doc', value: promedioFallaDoc },
    { name: 'Antecedentes', value: promedioAntecedentes }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-xl p-6 border border-red-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Rechazados</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalRechazados)}</div>
          <div className="text-sm text-gray-400 mt-1">Contrapartes rechazadas</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Promedio LA/FT</span>
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioLaFt.toFixed(1)}%</div>
          <div className="text-sm text-gray-400 mt-1">Lavado de activos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Falla Documental</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedioFallaDoc.toFixed(1)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio de fallas</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rechazados por Contraparte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Rechazados por Contraparte</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="contraparte" type="category" stroke="#9ca3af" width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => formatNumber(value)}
              />
              <Bar dataKey="rechazados" fill="#ef4444" name="Rechazados" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribución de Motivos de Rechazo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Distribución de Motivos (Promedio %)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={motivosData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
              >
                {motivosData.map((entry, index) => (
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
        <h3 className="text-lg font-semibold text-white mb-4">Detalle de Cumplimiento SAGRILAFT</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Contraparte</th>
              <th className="text-right py-2 px-4 text-gray-400">Rechazados</th>
              <th className="text-right py-2 px-4 text-gray-400">% LA/FT</th>
              <th className="text-right py-2 px-4 text-gray-400">% Falla Doc</th>
              <th className="text-right py-2 px-4 text-gray-400">% Antecedentes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-4 text-white font-medium">{row.contraparte || 'Sin nombre'}</td>
                <td className="py-2 px-4 text-right text-red-400">{formatNumber(row.rechazados)}</td>
                <td className="py-2 px-4 text-right text-yellow-400">{parseFloat(row.pct_la_ft || 0).toFixed(1)}%</td>
                <td className="py-2 px-4 text-right text-orange-400">{parseFloat(row.pct_falla_doc || 0).toFixed(1)}%</td>
                <td className="py-2 px-4 text-right text-purple-400">{parseFloat(row.pct_antecedentes || 0).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
