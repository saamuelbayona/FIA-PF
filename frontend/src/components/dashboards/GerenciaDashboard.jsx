import { motion } from 'framer-motion';
import { Briefcase, Target, TrendingUp } from 'lucide-react';

export default function GerenciaDashboard({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const totalIndicadores = data.length;

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
            <span className="text-gray-400 text-sm">Total Indicadores</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalIndicadores}</div>
          <div className="text-sm text-gray-400 mt-1">Indicadores estratégicos</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Áreas Monitoreadas</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalIndicadores}</div>
          <div className="text-sm text-gray-400 mt-1">Áreas de gestión</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Estado General</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">Activo</div>
          <div className="text-sm text-gray-400 mt-1">Sistema de monitoreo</div>
        </motion.div>
      </div>

      {/* Tarjetas de Indicadores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Indicadores Estratégicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all"
            >
              <div className="text-sm text-gray-400 mb-2">{item.indicador || 'Sin indicador'}</div>
              <div className="text-xl font-bold text-white">{item.resultado || 'N/A'}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tabla Detallada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 overflow-x-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detalle de Indicadores Estratégicos</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-4 text-gray-400">Indicador</th>
              <th className="text-left py-2 px-4 text-gray-400">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-4 text-white">{row.indicador || 'Sin indicador'}</td>
                <td className="py-2 px-4 text-blue-400 font-semibold">{row.resultado || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
