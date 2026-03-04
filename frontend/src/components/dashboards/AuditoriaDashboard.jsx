import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingDown, AlertTriangle, Target, CheckCircle } from 'lucide-react';

export default function AuditoriaDashboard({ data }) {
  if (!data || !data.mermaAnual) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const { mermaAnual, devoluciones, narrativas } = data;

  // Agrupar merma por año
  const merma2023 = mermaAnual.filter(d => d.anio === 2023);
  const merma2024 = mermaAnual.filter(d => d.anio === 2024);
  const merma2025 = mermaAnual.filter(d => d.anio === 2025);

  // Preparar datos para gráfico comparativo
  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const chartDataMerma = mesesNombres.map((mes, idx) => ({
    mes,
    '2023': merma2023.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
    '2024': merma2024.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
    '2025': merma2025.find(m => m.mes === idx + 1)?.porcentaje_merma || null,
  }));

  // Calcular promedios
  const promedio2023 = merma2023.reduce((sum, d) => sum + (d.porcentaje_merma || 0), 0) / merma2023.length;
  const promedio2024 = merma2024.reduce((sum, d) => sum + (d.porcentaje_merma || 0), 0) / merma2024.length;
  const promedio2025 = merma2025.reduce((sum, d) => sum + (d.porcentaje_merma || 0), 0) / merma2025.length;

  // Preparar datos de devoluciones por sede
  const devolucionesPorSede = {};
  devoluciones.forEach(d => {
    const key = `Sede ${d.sede}`;
    if (!devolucionesPorSede[key]) {
      devolucionesPorSede[key] = { sede: key, '2024': [], '2025': [] };
    }
    if (d.anio === 2024) {
      devolucionesPorSede[key]['2024'].push(d.devolucion_pct);
    } else if (d.anio === 2025) {
      devolucionesPorSede[key]['2025'].push(d.devolucion_pct);
    }
  });

  const devolucionesChart = Object.values(devolucionesPorSede).map(sede => ({
    sede: sede.sede,
    '2024': sede['2024'].reduce((a, b) => a + b, 0) / sede['2024'].length || 0,
    '2025': sede['2025'].reduce((a, b) => a + b, 0) / sede['2025'].length || 0,
  }));

  // Obtener narrativas
  const narrativasTexto = narrativas.filter(n => n.categoria === 'NARRATIVA').map(n => n.comentario);

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
            <span className="text-gray-400 text-sm">Merma 2023</span>
            <TrendingDown className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedio2023.toFixed(2)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Merma 2024</span>
            <TrendingDown className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedio2024.toFixed(2)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Merma 2025</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{promedio2025.toFixed(2)}%</div>
          <div className="text-sm text-gray-400 mt-1">Promedio anual</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Meta Merma</span>
            <Target className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">10.00%</div>
          <div className="text-sm text-gray-400 mt-1">Objetivo 2026</div>
        </motion.div>
      </div>

      {/* Gráfico comparativo de merma 2023-2025 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Evolución de Merma 2023-2025 (Comparativa)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartDataMerma}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => value ? `${value.toFixed(2)}%` : 'N/A'}
            />
            <Legend />
            <Line type="monotone" dataKey="2023" stroke="#3b82f6" name="2023" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="2024" stroke="#a855f7" name="2024" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="2025" stroke="#10b981" name="2025" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Gráfico de devoluciones por sede */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Devoluciones por Sede (2024 vs 2025)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={devolucionesChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="sede" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => `${value.toFixed(2)}%`}
            />
            <Legend />
            <Bar dataKey="2024" fill="#a855f7" name="2024" />
            <Bar dataKey="2025" fill="#10b981" name="2025" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Narrativas y comentarios */}
      {narrativasTexto.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Análisis y Comentarios</h3>
          <div className="space-y-3">
            {narrativasTexto.map((texto, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-gray-300 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
