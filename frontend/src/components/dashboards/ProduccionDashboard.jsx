import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Factory, TrendingUp, Calendar } from 'lucide-react';

export default function ProduccionDashboard({ data }) {
  const produccionData = Array.isArray(data) ? data : [];
  
  if (produccionData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const mesesMap = {};
  produccionData.forEach(d => {
    const mes = d.mes || 'N/A';
    if (!mesesMap[mes]) {
      mesesMap[mes] = { mes, prog2024: 0, real2024: 0, real2025: 0 };
    }
    const prog = parseFloat(d.programado) || 0;
    const real = parseFloat(d.real) || 0;
    
    if (d.anio === 2024) {
      mesesMap[mes].prog2024 += prog;
      mesesMap[mes].real2024 += real;
    } else if (d.anio === 2025) {
      mesesMap[mes].real2025 += real;
    }
  });
  
  const mesesData = Object.values(mesesMap);
  const totalProg2024 = mesesData.reduce((sum, d) => sum + d.prog2024, 0);
  const totalReal2024 = mesesData.reduce((sum, d) => sum + d.real2024, 0);
  const totalReal2025 = mesesData.reduce((sum, d) => sum + d.real2025, 0);
  
  const cumplimiento2024 = totalProg2024 > 0 ? ((totalReal2024 / totalProg2024) * 100).toFixed(1) : 0;
  const variacion2025vs2024 = totalReal2024 > 0 ? (((totalReal2025 - totalReal2024) / totalReal2024) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total 2025</span>
            <Factory className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totalReal2025)}</div>
          <div className={`text-sm mt-1 ${variacion2025vs2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacion2025vs2024 > 0 ? '+' : ''}{variacion2025vs2024}% vs 2024
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Cumplimiento 2024</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{cumplimiento2024}%</div>
          <div className="text-sm text-gray-400 mt-1">Real vs Programado</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Variación</span>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{formatNumber(totalReal2025 - totalReal2024)}</div>
          <div className={`text-sm mt-1 ${variacion2025vs2024 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Diferencia anual
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Producción Real 2024 vs 2025</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={mesesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatNumber(entry.value)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Bar dataKey="real2024" fill="#6366f1" name="2024" radius={[8, 8, 0, 0]} />
              <Bar dataKey="real2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Cumplimiento 2024</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mesesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                      <p className="text-white font-semibold mb-2">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {formatNumber(entry.value)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Line type="monotone" dataKey="prog2024" stroke="#f59e0b" strokeWidth={3} name="Programado" />
              <Line type="monotone" dataKey="real2024" stroke="#6366f1" strokeWidth={3} name="Real" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Evolución Anual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mesesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {formatNumber(entry.value)}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }} />
            <Legend />
            <Area type="monotone" dataKey="real2024" stroke="#6366f1" fill="url(#color2024)" strokeWidth={2} name="2024" />
            <Area type="monotone" dataKey="real2025" stroke="#10b981" fill="url(#color2025)" strokeWidth={2} name="2025" />
            <defs>
              <linearGradient id="color2024" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
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
