import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Package } from 'lucide-react';

export default function ComercialDashboard({ data }) {
  const comercialData = Array.isArray(data) ? data : [];
  
  if (comercialData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Agrupar por línea y año
  const lineasMap = {};
  comercialData.forEach(d => {
    const linea = d.linea || 'Sin línea';
    if (!lineasMap[linea]) {
      lineasMap[linea] = { linea, kg2024: 0, kg2025: 0, sede: d.sede };
    }
    const kg = parseFloat(d.kg) || 0;
    if (d.anio === 2024) {
      lineasMap[linea].kg2024 += kg;
    } else if (d.anio === 2025) {
      lineasMap[linea].kg2025 += kg;
    }
  });
  
  const lineasData = Object.values(lineasMap);
  const totalKg2025 = lineasData.reduce((sum, d) => sum + d.kg2025, 0);
  const totalKg2024 = lineasData.reduce((sum, d) => sum + d.kg2024, 0);
  const variacionTotal = totalKg2024 > 0 ? (((totalKg2025 - totalKg2024) / totalKg2024) * 100).toFixed(1) : 0;

  lineasData.forEach(d => {
    d.participacion = totalKg2025 > 0 ? ((d.kg2025 / totalKg2025) * 100) : 0;
    d.variacion = d.kg2024 > 0 ? (((d.kg2025 - d.kg2024) / d.kg2024) * 100) : 0;
  });

  const topLineas = lineasData.sort((a, b) => b.kg2025 - a.kg2025).slice(0, 8);
  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)} kg
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
          <div className="text-3xl font-bold text-white">{formatNumber(totalKg2025)} kg</div>
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
            <span className="text-gray-400 text-sm">Líneas Activas</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{lineasData.length}</div>
          <div className="text-sm text-gray-400 mt-1">Líneas de producto</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Crecimiento</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totalKg2025 - totalKg2024)} kg</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Diferencia anual
          </div>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación 2024 vs 2025 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top 8 Líneas - Comparativa</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topLineas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="linea" 
                stroke="#9ca3af" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="kg2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="kg2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
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
          <h3 className="text-lg font-semibold text-white mb-4">Participación 2025</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={topLineas}
                dataKey="participacion"
                nameKey="linea"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name.substring(0, 15)}: ${(percent * 100).toFixed(1)}%`}
                labelLine={{ stroke: '#9ca3af' }}
              >
                {topLineas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                        <p className="text-white font-semibold">{payload[0].name}</p>
                        <p className="text-green-400">{payload[0].value.toFixed(1)}% del total</p>
                        <p className="text-gray-400 text-sm">{formatNumber(payload[0].payload.kg2025)} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tendencia de crecimiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Variación % por Línea (2025 vs 2024)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topLineas} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis 
              dataKey="linea" 
              type="category" 
              stroke="#9ca3af" 
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-1">{data.linea}</p>
                      <p className={data.variacion >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {data.variacion > 0 ? '+' : ''}{data.variacion.toFixed(1)}%
                      </p>
                      <p className="text-gray-400 text-sm">2024: {formatNumber(data.kg2024)} kg</p>
                      <p className="text-gray-400 text-sm">2025: {formatNumber(data.kg2025)} kg</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="variacion" 
              fill="#38bdf8" 
              radius={[0, 8, 8, 0]}
              name="Variación %"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
