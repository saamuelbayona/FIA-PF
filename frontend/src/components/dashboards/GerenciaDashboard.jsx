import { motion } from 'framer-motion';
import { Briefcase, Target, TrendingUp } from 'lucide-react';

export default function GerenciaDashboard({ data }) {
  // Validar que data sea un array
  const gerenciaData = Array.isArray(data) ? data : [];
  
  if (gerenciaData.length === 0) {
    return <div className="text-gray-400">No hay datos disponibles</div>;
  }

  const totalIndicadores = gerenciaData.length;

  // Agrupar por sección
  const seccionesMap = {};
  gerenciaData.forEach(d => {
    const seccion = d.seccion || 'Sin sección';
    if (!seccionesMap[seccion]) {
      seccionesMap[seccion] = [];
    }
    seccionesMap[seccion].push(d);
  });

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
            <span className="text-gray-400 text-sm">Secciones</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{Object.keys(seccionesMap).length}</div>
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

      {/* Secciones con Indicadores */}
      {Object.entries(seccionesMap).map(([seccion, items], secIdx) => (
        <motion.div
          key={secIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + secIdx * 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{seccion}</h3>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-blue-500/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Proceso</div>
                    <div className="text-sm text-white font-medium">{item.proceso || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Tema</div>
                    <div className="text-sm text-blue-400 font-medium">{item.tema || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Descripción</div>
                    <div className="text-sm text-gray-300">{item.descripcion || 'N/A'}</div>
                  </div>
                </div>
                {item.narrativa && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="text-xs text-gray-400 mb-1">Narrativa</div>
                    <div className="text-sm text-gray-300 italic">{item.narrativa}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

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
              <th className="text-left py-2 px-4 text-gray-400">Sección</th>
              <th className="text-left py-2 px-4 text-gray-400">Proceso</th>
              <th className="text-left py-2 px-4 text-gray-400">Tema</th>
              <th className="text-left py-2 px-4 text-gray-400">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {gerenciaData.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-2 px-4 text-white font-medium">{row.seccion || 'N/A'}</td>
                <td className="py-2 px-4 text-gray-300">{row.proceso || 'N/A'}</td>
                <td className="py-2 px-4 text-blue-400">{row.tema || 'N/A'}</td>
                <td className="py-2 px-4 text-gray-300">{row.descripcion || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
