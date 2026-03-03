import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonView = memo(({ items, onClose }) => {
  if (!items || items.length === 0) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const chartData = items.map((item, index) => ({
    name: `Item ${index + 1}`,
    fullName: item.accountName,
    '2025': item.value2025 / 1000000000,
    '2024': item.value2024 / 1000000000,
    variacion: item.variation / 1000000000
  }));

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#1e293b',
          border: '2px solid #38bdf8',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          minWidth: '250px'
        }}>
          <p style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '15px',
            marginBottom: '8px',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          }}>
            {payload[0].payload.fullName}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: '500',
              margin: '4px 0'
            }}>
              {entry.name}: {entry.value.toFixed(2)} Miles de Millones
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(148, 163, 184, 0.3)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl p-4 sm:p-6 border-b"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.3)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Análisis Comparativo</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Comparando {items.length} {items.length === 1 ? 'elemento' : 'elementos'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Chart */}
          <div className="backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Comparación Visual (Miles de Millones)</h3>
            
            {/* Leyenda de items */}
            <div className="mb-4 p-4 rounded-lg" style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <p className="text-xs text-gray-400 mb-2">Referencias:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sky-400 font-semibold text-sm">Item {index + 1}:</span>
                    <span className="text-gray-300 text-sm">{item.accountName}</span>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorBar1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorBar2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="name" 
                  stroke="#e5e7eb"
                  style={{ fontSize: '14px', fontWeight: '600', fill: '#f3f4f6' }}
                />
                <YAxis 
                  stroke="#e5e7eb"
                  style={{ fontSize: '13px', fontWeight: '500', fill: '#f3f4f6' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
                <Bar dataKey="2024" fill="url(#colorBar1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="2025" fill="url(#colorBar2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {items.map((item, index) => {
              const variationPercent = item.value2024 !== 0 
                ? ((item.variation / item.value2024) * 100).toFixed(2)
                : 0;
              const isPositive = parseFloat(variationPercent) > 0;
              const isNegative = parseFloat(variationPercent) < 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl rounded-lg sm:rounded-xl p-4 sm:p-6"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 pr-2">
                      <h4 className="text-sm sm:text-base text-white font-semibold break-words">{item.accountName}</h4>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        {item.category} • {item.subcategory}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{
                        background: isPositive ? 'rgba(34, 197, 94, 0.1)' : isNegative ? 'rgba(239, 68, 68, 0.1)' : 'rgba(148, 163, 184, 0.1)'
                      }}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : isNegative ? (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      ) : (
                        <Minus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Valor 2025</p>
                      <p className="text-lg sm:text-xl font-bold text-white break-all">{formatCurrency(item.value2025)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Valor 2024</p>
                      <p className="text-base sm:text-lg text-gray-400 break-all">{formatCurrency(item.value2024)}</p>
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-500 mb-1">Variación</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-base sm:text-lg font-semibold break-all ${
                          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {formatCurrency(item.variation)}
                        </p>
                        <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {isPositive && '+'}{variationPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
});

ComparisonView.displayName = 'ComparisonView';

export default ComparisonView;
