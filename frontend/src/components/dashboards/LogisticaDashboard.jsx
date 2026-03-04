import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Truck, TrendingUp, Building } from 'lucide-react';

export default function LogisticaDashboard({ data }) {
  const logisticaData = Array.isArray(data) ? data : [];
  
  if (logisticaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const conceptosMap = {};
  logisticaData.forEach(d => {
    const key = `${d.sede}-${d.concepto}`;
    if (!conceptosMap[key]) {
      conceptosMap[key] = { sede: d.sede, concepto: d.concepto, valor2024: 0, valor2025: 0 };
    }
    const valor = parseFloat(d.valor) || 0;
    if (d.anio === 2024) conceptosMap[key].valor2024 += valor;
    else if (d.anio === 2025) conceptosMap[key].valor2025 += valor;
  });
  
  const conceptosData = Object.values(conceptosMap);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;

  const sedesMap = {};
  conceptosData.forEach(d => {
    if (!sedesMap[d.sede]) sedesMap[d.sede] = { sede: d.sede, total2024: 0, total2025: 0 };
    sedesMap[d.sede].total2024 += d.valor2024;
    sedesMap[d.sede].total2025 += d.valor2025;
  });
  const sedesData = Object.values(sedesMap);

  const topConceptos = conceptosData
    .sort((a, b) => b.valor2025 - a.valor2025)
    .slice(0, 8)
    .map(d => ({
      ...d,
      nombre: `${d.sede} - ${d.concepto.substring(0, 20)}`,
      variacion: d.valor2024 > 0 ? (((d.valor2025 - d.valor2024) / d.valor2024) * 100) : 0
    }));

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total 2025</span>
            <Truck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(total2025)}</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal > 0 ? '+' : ''}{variacionTotal}% vs 2024
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Variación</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(Math.abs(total2025 - total2024))}</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {variacionTotal >= 0 ? 'Incremento' : 'Reducción'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Sedes</span>
            <Building className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{sedesData.length}</div>
          <div className="text-sm text-gray-400 mt-1">Activas</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Gastos por Sede</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sedesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sede" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-2">{payload[0].payload.sede}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatCurrency(entry.value)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="total2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Distribución 2025</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={sedesData} dataKey="total2025" nameKey="sede" cx="50%" cy="50%" outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                {sedesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold">{payload[0].name}</p>
                      <p className="text-green-400">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top 8 Conceptos - Variación %</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topConceptos} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="nombre" type="category" stroke="#9ca3af" width={180} tick={{ fontSize: 11 }} />
            <Tooltip content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-1">{data.concepto}</p>
                    <p className={data.variacion >= 0 ? 'text-red-400' : 'text-green-400'}>
                      {data.variacion > 0 ? '+' : ''}{data.variacion.toFixed(1)}%
                    </p>
                    <p className="text-gray-400 text-sm">2024: {formatCurrency(data.valor2024)}</p>
                    <p className="text-gray-400 text-sm">2025: {formatCurrency(data.valor2025)}</p>
                  </div>
                );
              }
              return null;
            }} />
            <Bar dataKey="variacion" fill="#38bdf8" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
