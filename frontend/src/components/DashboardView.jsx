import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardView({ dashboardType, title }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [dashboardType]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getDashboardData(dashboardType);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button
          onClick={loadDashboardData}
          className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-blue-400" />
        </button>
      </div>

      {renderDashboardContent(dashboardType, data)}
    </div>
  );
}

function renderDashboardContent(type, data) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No hay datos disponibles para este dashboard
      </div>
    );
  }

  switch (type) {
    case 'auditoria':
      return <AuditoriaDashboard data={data} />;
    case 'cartera':
      return <CarteraDashboard data={data} />;
    case 'humana':
      return <HumanaDashboard data={data} />;
    case 'logistica':
      return <LogisticaDashboard data={data} />;
    case 'produccion-encasetado':
      return <ProduccionEncasetadoDashboard data={data} />;
    case 'produccion-granjas':
      return <ProduccionGranjasDashboard data={data} />;
    default:
      return <GenericDashboard data={data} />;
  }
}

// Dashboard de Auditoría
function AuditoriaDashboard({ data }) {
  const chartData = data
    .filter(d => d.anio >= 2024)
    .map(d => ({
      mes: d.mes,
      anio: d.anio,
      merma: d.porcentaje_merma
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Merma Promedio 2025"
          value={`${(chartData.filter(d => d.anio === 2025).reduce((acc, d) => acc + d.merma, 0) / chartData.filter(d => d.anio === 2025).length).toFixed(2)}%`}
          trend="down"
        />
        <StatCard
          title="Merma Promedio 2024"
          value={`${(chartData.filter(d => d.anio === 2024).reduce((acc, d) => acc + d.merma, 0) / chartData.filter(d => d.anio === 2024).length).toFixed(2)}%`}
        />
        <StatCard
          title="Total Registros"
          value={data.length}
        />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Análisis de Merma por Mes</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Line type="monotone" dataKey="merma" stroke="#3b82f6" name="% Merma" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Dashboard de Cartera
function CarteraDashboard({ data }) {
  const latestData = data.slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Cartera Total"
          value={`$${(latestData[0]?.total_cartera / 1000000).toFixed(1)}M`}
        />
        <StatCard
          title="Cartera Vencida"
          value={`$${(latestData[0]?.cartera_vencida / 1000000).toFixed(1)}M`}
          trend="down"
        />
        <StatCard
          title="Índice Morosidad"
          value={`${latestData[0]?.indice_morosidad}%`}
          trend={latestData[0]?.indice_morosidad > 45 ? 'up' : 'down'}
        />
        <StatCard
          title="Días Rotación"
          value={latestData[0]?.dias_rotacion?.toFixed(1)}
        />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Evolución de Cartera</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={latestData.reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="total_cartera" fill="#3b82f6" name="Cartera Total" />
            <Bar dataKey="cartera_vencida" fill="#ef4444" name="Cartera Vencida" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Dashboard de Gestión Humana
function HumanaDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <StatCard
            key={idx}
            title={`Personal ${item.anio}`}
            value={item.numero_personas}
            subtitle={`Variación: ${item.variacion_porcentaje}%`}
            trend={item.variacion_porcentaje > 0 ? 'up' : 'down'}
          />
        ))}
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Comparativo de Personal</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="anio" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="numero_personas" fill="#10b981" name="Número de Personas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Dashboard de Logística
function LogisticaDashboard({ data }) {
  const sedes = [...new Set(data.map(d => d.sede))];
  
  return (
    <div className="space-y-6">
      {sedes.map(sede => {
        const sedeData = data.filter(d => d.sede === sede);
        const total2024 = sedeData.reduce((acc, d) => acc + (d.total_2024 || 0), 0);
        const total2025 = sedeData.reduce((acc, d) => acc + (d.total_2025 || 0), 0);
        const variacion = ((total2025 - total2024) / total2024 * 100).toFixed(2);

        return (
          <div key={sede} className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{sede}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">${(total2025 / 1000).toFixed(0)}K</div>
                <div className={`text-sm ${variacion > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {variacion > 0 ? '+' : ''}{variacion}% vs 2024
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sedeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="concepto" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="total_2024" fill="#6366f1" name="2024" />
                <Bar dataKey="total_2025" fill="#3b82f6" name="2025" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

// Dashboard de Producción - Encasetado
function ProduccionEncasetadoDashboard({ data }) {
  const data2025 = data.filter(d => d.anio === 2025);
  const cumplimiento = data2025.map(d => ({
    mes: d.mes,
    programado: d.programado,
    real: d.real,
    cumplimiento: ((d.real / d.programado) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Programado 2025"
          value={(data2025.reduce((acc, d) => acc + d.programado, 0) / 1000000).toFixed(2) + 'M'}
        />
        <StatCard
          title="Real 2025"
          value={(data2025.reduce((acc, d) => acc + d.real, 0) / 1000000).toFixed(2) + 'M'}
        />
        <StatCard
          title="Cumplimiento Promedio"
          value={`${(cumplimiento.reduce((acc, d) => acc + parseFloat(d.cumplimiento), 0) / cumplimiento.length).toFixed(1)}%`}
        />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Programado vs Real 2025</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cumplimiento}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#f1f5f9' }}
            />
            <Legend />
            <Bar dataKey="programado" fill="#6366f1" name="Programado" />
            <Bar dataKey="real" fill="#10b981" name="Real" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Dashboard de Producción - Granjas
function ProduccionGranjasDashboard({ data }) {
  const tipoData = data.reduce((acc, granja) => {
    const existing = acc.find(item => item.tipo === granja.tipo);
    if (existing) {
      existing.aves += granja.aves;
      existing.metros += granja.metros;
    } else {
      acc.push({ tipo: granja.tipo, aves: granja.aves, metros: granja.metros });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Granjas" value={data.length} />
        <StatCard title="Total Aves" value={(data.reduce((acc, d) => acc + d.aves, 0) / 1000).toFixed(0) + 'K'} />
        <StatCard title="Total Metros" value={(data.reduce((acc, d) => acc + d.metros, 0) / 1000).toFixed(0) + 'K'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tipoData}
                dataKey="aves"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Capacidad por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tipoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="tipo" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="aves" fill="#3b82f6" name="Aves" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Dashboard Genérico
function GenericDashboard({ data }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <pre className="text-gray-300 text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// Componente de Tarjeta de Estadística
function StatCard({ title, value, subtitle, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            {trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-red-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-400" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
