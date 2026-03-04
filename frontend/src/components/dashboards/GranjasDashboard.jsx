import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, TrendingUp } from 'lucide-react';

export default function GranjasDashboard({ data }) {
  // Validar que data sea un array
  const granjasData = Array.isArray(data) ? data : [];
  
  if (granjasData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const totalMetros = granjasData.reduce((sum, d) => sum + (parseFloat(d.metros) || 0), 0);
  const totalAves = granjasData.reduce((sum, d) => sum + (parseFloat(d.aves) || 0), 0);
  const totalGranjas = granjasData.length;

  const COLORS = ['#38bdf8', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  // Agrupar por tipo
  const porTipo = granjasData.reduce((acc, d) => {
    const tipo = d.tipo || 'Sin tipo';
    if (!acc[tipo]) {
      acc[tipo] = { metros: 0, aves: 0, count: 0 };
    }
    acc[tipo].metros += parseFloat(d.metros) || 0;
    acc[tipo].aves += parseFloat(d.aves) || 0;
    acc[tipo].count += 1;
    return acc;
  }, {});

  const tipoData = Object.entries(porTipo).map(([tipo, values]) => ({
    tipo,
    metros: values.metros,
    aves: values.aves,
    granjas: values.count
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
            <span className="text-gray-400 text-sm">Total Granjas</span>
            <Home className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalGranjas}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Metros²</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalMetros.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Aves</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalAves.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Tipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Distribución de Aves por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tipoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, aves }) => `${tipo}: ${aves.toLocaleString()}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="aves"
              >
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Metros por Tipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Metros² por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tipo" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => value.toLocaleString()}
              />
              <Bar dataKey="metros" fill="#10b981" name="Metros²" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Capacidad por Granja */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Capacidad por Granja</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={granjasData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="granja" type="category" stroke="#9ca3af" width={150} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend />
            <Bar dataKey="aves" fill="#38bdf8" name="Aves" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabla detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle por Granja</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-gray-400">Tipo</th>
              <th className="text-left py-3 px-4 text-gray-400">Granja</th>
              <th className="text-right py-3 px-4 text-gray-400">Metros²</th>
              <th className="text-right py-3 px-4 text-gray-400">Aves</th>
              <th className="text-right py-3 px-4 text-gray-400">Densidad (aves/m²)</th>
            </tr>
          </thead>
          <tbody>
            {granjasData.map((row, idx) => {
              const metros = parseFloat(row.metros) || 0;
              const aves = parseFloat(row.aves) || 0;
              const densidad = (metros > 0 && aves) ? (aves / metros).toFixed(2) : 'N/A';
              return (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-white">{row.tipo || 'N/A'}</td>
                  <td className="py-3 px-4 text-white">{row.granja || 'N/A'}</td>
                  <td className="py-3 px-4 text-right text-green-400">{metros.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-blue-400">{aves.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-purple-400">{densidad}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
