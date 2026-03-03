import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Charts = memo(({ data }) => {
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.value2025 || 0), 0);
  };

  // Tooltip personalizado para mostrar texto completo
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      const formatValue = (value) => {
        if (typeof value === 'number') {
          // Si el valor es menor a 10000, probablemente está en miles de millones
          if (value < 10000) {
            const fullValue = value * 1000000000;
            return '$' + new Intl.NumberFormat('es-CO', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(fullValue);
          }
          // Si no, es un valor completo
          return '$' + new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value);
        }
        return value;
      };
      
      return (
        <div style={{
          backgroundColor: '#1e293b',
          border: '2px solid #38bdf8',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          minWidth: '200px'
        }}>
          <p style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '15px',
            marginBottom: '8px',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          }}>
            {data.fullName || payload[0].name}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: '500',
              margin: '4px 0'
            }}>
              {entry.dataKey || entry.name}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Datos para comparación
  const comparisonData = [
    {
      name: 'Activos',
      '2024': data.activos.reduce((sum, item) => sum + (item.value2024 || 0), 0) / 1000000000,
      '2025': calculateTotal(data.activos) / 1000000000
    },
    {
      name: 'Pasivos',
      '2024': data.pasivos.reduce((sum, item) => sum + (item.value2024 || 0), 0) / 1000000000,
      '2025': calculateTotal(data.pasivos) / 1000000000
    },
    {
      name: 'Patrimonio',
      '2024': data.patrimonio.reduce((sum, item) => sum + (item.value2024 || 0), 0) / 1000000000,
      '2025': calculateTotal(data.patrimonio) / 1000000000
    }
  ];

  // Top 5 activos con nombres completos para tooltip
  const topActivos = data.activos
    .filter(item => item.value2025 > 0 && item.subcategory !== 'TOTAL')
    .sort((a, b) => b.value2025 - a.value2025)
    .slice(0, 5)
    .map(item => ({
      name: item.accountName.length > 20 ? item.accountName.substring(0, 18) + '...' : item.accountName,
      fullName: item.accountName,
      value: item.value2025 / 1000000000
    }));

  // Evolución de variaciones
  const variationData = [
    {
      category: 'Activos',
      variacion: data.activos.reduce((sum, item) => sum + (item.variation || 0), 0) / 1000000000,
      fuentes: data.activos.reduce((sum, item) => sum + (item.fuentes || 0), 0) / 1000000000,
      usos: data.activos.reduce((sum, item) => sum + (item.usos || 0), 0) / 1000000000
    },
    {
      category: 'Pasivos',
      variacion: data.pasivos.reduce((sum, item) => sum + (item.variation || 0), 0) / 1000000000,
      fuentes: data.pasivos.reduce((sum, item) => sum + (item.fuentes || 0), 0) / 1000000000,
      usos: data.pasivos.reduce((sum, item) => sum + (item.usos || 0), 0) / 1000000000
    },
    {
      category: 'Patrimonio',
      variacion: data.patrimonio.reduce((sum, item) => sum + (item.variation || 0), 0) / 1000000000,
      fuentes: data.patrimonio.reduce((sum, item) => sum + (item.fuentes || 0), 0) / 1000000000,
      usos: data.patrimonio.reduce((sum, item) => sum + (item.usos || 0), 0) / 1000000000
    }
  ];

  // Composición de activos
  const activosComposition = [
    {
      name: 'Corrientes',
      value: data.activos
        .filter(item => item.subcategory === 'CORRIENTE')
        .reduce((sum, item) => sum + item.value2025, 0) / 1000000000
    },
    {
      name: 'No Corrientes',
      value: data.activos
        .filter(item => item.subcategory === 'NO CORRIENTE')
        .reduce((sum, item) => sum + item.value2025, 0) / 1000000000
    }
  ];

  // Composición de pasivos
  const pasivosComposition = [
    {
      name: 'Corto Plazo',
      value: data.pasivos
        .filter(item => item.subcategory === 'CORTO PLAZO')
        .reduce((sum, item) => sum + item.value2025, 0) / 1000000000
    },
    {
      name: 'Largo Plazo',
      value: data.pasivos
        .filter(item => item.subcategory === 'LARGO PLAZO')
        .reduce((sum, item) => sum + item.value2025, 0) / 1000000000
    }
  ];

  // Radar de indicadores financieros
  const totalActivos = calculateTotal(data.activos);
  const totalPasivos = calculateTotal(data.pasivos);
  const totalPatrimonio = calculateTotal(data.patrimonio);
  
  const radarData = [
    {
      indicator: 'Liquidez',
      value: Math.min((totalActivos / totalPasivos) * 20, 100)
    },
    {
      indicator: 'Solvencia',
      value: Math.min((totalPatrimonio / totalActivos) * 100, 100)
    },
    {
      indicator: 'Endeudamiento',
      value: 100 - Math.min((totalPasivos / totalActivos) * 100, 100)
    },
    {
      indicator: 'Rentabilidad',
      value: Math.min((totalPatrimonio / totalActivos) * 100, 100)
    },
    {
      indicator: 'Crecimiento',
      value: Math.min(((totalActivos - data.activos.reduce((s, i) => s + i.value2024, 0)) / data.activos.reduce((s, i) => s + i.value2024, 0)) * 50, 100)
    }
  ];

  const COLORS = ['#00f2ff', '#7b2ff7', '#ff006e', '#00ff88', '#ffbe0b'];
  const COLORS2 = ['#00f2ff', '#7b2ff7'];

  const chartContainerClass = "bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary/30 transition-all duration-300";

  return (
    <div className="space-y-6">
      {/* Primera fila - Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Comparación 2024 vs 2025 (Miles de Millones)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <defs>
                <linearGradient id="colorBar1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b2ff7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7b2ff7" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorBar2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#e5e7eb" 
                style={{ fontSize: '14px', fontWeight: '500', fill: '#f3f4f6' }}
              />
              <YAxis 
                stroke="#e5e7eb" 
                style={{ fontSize: '14px', fontWeight: '500', fill: '#f3f4f6' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #38bdf8', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}
                itemStyle={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}
                cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="2024" fill="url(#colorBar1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="2025" fill="url(#colorBar2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Top 5 Activos 2025
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topActivos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {topActivos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Segunda fila - Análisis de variaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Fuentes y Usos de Recursos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={variationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                dataKey="category" 
                stroke="#e5e7eb"
                style={{ fontSize: '14px', fontWeight: '500', fill: '#f3f4f6' }}
              />
              <YAxis 
                stroke="#e5e7eb"
                style={{ fontSize: '14px', fontWeight: '500', fill: '#f3f4f6' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #38bdf8', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}
                itemStyle={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}
                cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="fuentes" fill="#00ff88" radius={[8, 8, 0, 0]} />
              <Bar dataKey="usos" fill="#ff006e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Indicadores Financieros
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#475569" strokeWidth={1.5} />
              <PolarAngleAxis 
                dataKey="indicator" 
                tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
                stroke="#e5e7eb"
              />
              <PolarRadiusAxis 
                angle={90}
                tick={{ fill: '#f3f4f6', fontSize: 12, fontWeight: '500' }}
                stroke="#e5e7eb"
              />
              <Radar 
                name="Indicadores" 
                dataKey="value" 
                stroke="#00f2ff" 
                strokeWidth={3}
                fill="#00f2ff" 
                fillOpacity={0.5} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #38bdf8', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  padding: '12px'
                }}
                labelStyle={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  fontSize: '15px', 
                  marginBottom: '8px' 
                }}
                itemStyle={{ 
                  color: '#f1f5f9', 
                  fontSize: '14px', 
                  fontWeight: '500' 
                }}
                formatter={(value) => `${value.toFixed(2)}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tercera fila - Composición */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Composición de Activos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activosComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {activosComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '13px'
                }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#f3f4f6', fontWeight: '500' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={chartContainerClass}
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
            Composición de Pasivos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pasivosComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pasivosComposition.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '13px'
                }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#f3f4f6', fontWeight: '500' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
});

Charts.displayName = 'Charts';

export default Charts;
