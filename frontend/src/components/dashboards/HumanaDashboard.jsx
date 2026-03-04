import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, TrendingUp, Clock } from 'lucide-react';

export default function HumanaDashboard({ data }) {
  const humanaData = Array.isArray(data) ? data : [];
  
  if (humanaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Agrupar por concepto y año
  const conceptosMap = {};
  humanaData.forEach(d => {
    const concepto = d.concepto || 'Sin concepto';
    if (!conceptosMap[concepto]) {
      conceptosMap[concepto] = { concepto, valor2024: 0, valor2025: 0, categoria: d.categoria };
    }
    const valor = parseFloat(d.valor) || 0;
    if (d.anio === 2024) {
      conceptosMap[concepto].valor2024 += valor;
    } else if (d.anio === 2025) {
      conceptosMap[concepto].valor2025 += valor;
    }
  });
  
  const conceptosData = Object.values(conceptosMap);
  const total2025 = conceptosData.reduce((sum, d) => sum + d.valor2025, 0);
  const total2024 = conceptosData.reduce((sum, d) => sum + d.valor2024, 0);
  const variacionTotal = total2024 > 0 ? (((total2025 - total2024) / total2024) * 100).toFixed(1) : 0;

  const topConceptos = conceptosData
    .sort((a, b) => b.valor2025 - a.valor2025)
    .slice(0, 10)
    .map(d => ({
      ...d,
      concepto: d.concepto.length > 25 ? d.concepto.substring(0, 25) + '...' : d.concepto,
      variacion: d.valor2024 > 0 ? (((d.valor2025 - d.valor2024) / d.valor2024) * 100) : 0
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
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
            <span className="text-gray-400 text-sm">Total 2025</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(total2025)}</div>
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
            <span className="text-gray-400 text-sm">Variación</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(Math.abs(total2025 - total2024))}</div>
          <div className={`text-sm mt-1 ${variacionTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacionTotal >= 0 ? 'Incremento' : 'Reducción'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Conceptos</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{conceptosData.length}</div>
          <div className="text-sm text-gray-400 mt-1">Registrados</div>
        </motion.div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Conceptos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top 10 Conceptos - Comparativa</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topConceptos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis 
                dataKey="concepto" 
                type="category" 
                stroke="#9ca3af" 
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="valor2024" fill="#6366f1" name="2024" radius={[0, 8, 8, 0]} />
              <Bar dataKey="valor2025" fill="#10b981" name="2025" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Variación porcentual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Variación % (2025 vs 2024)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topConceptos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis 
                dataKey="concepto" 
                type="category" 
                stroke="#9ca3af" 
                width={150}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                        <p className="text-white font-semibold mb-1">{data.concepto}</p>
                        <p className={data.variacion >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {data.variacion > 0 ? '+' : ''}{data.variacion.toFixed(1)}%
                        </p>
                        <p className="text-gray-400 text-sm">2024: {formatCurrency(data.valor2024)}</p>
                        <p className="text-gray-400 text-sm">2025: {formatCurrency(data.valor2025)}</p>
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

      {/* Comparación total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Evolución Total 2024 vs 2025</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={[
            { año: '2024', valor: total2024 },
            { año: '2025', valor: total2025 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="año" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold">{payload[0].payload.año}</p>
                      <p className="text-green-400">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#10b981" 
              fill="url(#colorValor)" 
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
