
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Phone,
  Target,
  Clock,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface AnalyticsData {
  calls_by_hour: any[];
  calls_by_day: any[];
  agent_performance: any[];
  conversion_funnel: any[];
  disposition_breakdown: any[];
  revenue_metrics: any[];
}

const AdminAnalytics = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const [kpis, setKpis] = useState({
    total_calls: 2847,
    total_conversions: 342,
    conversion_rate: 12.01,
    average_call_duration: 285,
    revenue_generated: 125800,
    cost_per_acquisition: 368,
    agent_productivity: 8.7,
    customer_satisfaction: 4.3
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    calls_by_hour: [],
    calls_by_day: [],
    agent_performance: [],
    conversion_funnel: [],
    disposition_breakdown: [],
    revenue_metrics: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, date]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate analytics data fetch
      const mockData: AnalyticsData = {
        calls_by_hour: [
          { hour: '08:00', calls: 45, conversions: 8 },
          { hour: '09:00', calls: 78, conversions: 12 },
          { hour: '10:00', calls: 92, conversions: 18 },
          { hour: '11:00', calls: 105, conversions: 22 },
          { hour: '12:00', calls: 88, conversions: 15 },
          { hour: '13:00', calls: 95, conversions: 19 },
          { hour: '14:00', calls: 112, conversions: 25 },
          { hour: '15:00', calls: 118, conversions: 28 },
          { hour: '16:00', calls: 108, conversions: 23 },
          { hour: '17:00', calls: 95, conversions: 17 },
          { hour: '18:00', calls: 72, conversions: 12 }
        ],
        calls_by_day: [
          { day: 'Lun', calls: 412, conversions: 52, revenue: 18400 },
          { day: 'Mar', calls: 445, conversions: 67, revenue: 23850 },
          { day: 'Mié', calls: 398, conversions: 48, revenue: 17200 },
          { day: 'Jue', calls: 467, conversions: 71, revenue: 25320 },
          { day: 'Vie', calls: 523, conversions: 78, revenue: 28140 },
          { day: 'Sáb', calls: 287, conversions: 35, revenue: 12450 },
          { day: 'Dom', calls: 315, conversions: 41, revenue: 14650 }
        ],
        agent_performance: [
          { agent: 'Ana García', calls: 87, conversions: 15, rate: 17.2, revenue: 5400 },
          { agent: 'Carlos López', calls: 92, conversions: 12, rate: 13.0, revenue: 4320 },
          { agent: 'María Rodríguez', calls: 78, conversions: 18, rate: 23.1, revenue: 6480 },
          { agent: 'Juan Pérez', calls: 95, conversions: 14, rate: 14.7, revenue: 5040 },
          { agent: 'Sofia Mendoza', calls: 83, conversions: 16, rate: 19.3, revenue: 5760 }
        ],
        conversion_funnel: [
          { stage: 'Contactos', value: 2847, percentage: 100 },
          { stage: 'Interesados', value: 1425, percentage: 50.1 },
          { stage: 'Calificados', value: 856, percentage: 30.1 },
          { stage: 'Propuestas', value: 512, percentage: 18.0 },
          { stage: 'Conversiones', value: 342, percentage: 12.0 }
        ],
        disposition_breakdown: [
          { name: 'Venta', value: 342, color: '#22c55e' },
          { name: 'No Interesado', value: 856, color: '#ef4444' },
          { name: 'Callback', value: 512, color: '#f59e0b' },
          { name: 'No Contactado', value: 423, color: '#6b7280' },
          { name: 'Ocupado', value: 314, color: '#8b5cf6' },
          { name: 'Otros', value: 400, color: '#06b6d4' }
        ],
        revenue_metrics: [
          { month: 'Ene', revenue: 95000, cost: 28500 },
          { month: 'Feb', revenue: 108000, cost: 32400 },
          { month: 'Mar', revenue: 125800, cost: 37740 },
          { month: 'Abr', revenue: 142000, cost: 42600 },
          { month: 'May', revenue: 156000, cost: 46800 },
          { month: 'Jun', revenue: 167000, cost: 50100 }
        ]
      };

      setAnalyticsData(mockData);

      // Update KPIs based on the data
      const totalCalls = mockData.calls_by_day.reduce((sum, day) => sum + day.calls, 0);
      const totalConversions = mockData.calls_by_day.reduce((sum, day) => sum + day.conversions, 0);
      const totalRevenue = mockData.calls_by_day.reduce((sum, day) => sum + day.revenue, 0);

      setKpis(prev => ({
        ...prev,
        total_calls: totalCalls,
        total_conversions: totalConversions,
        conversion_rate: (totalConversions / totalCalls) * 100,
        revenue_generated: totalRevenue,
        cost_per_acquisition: totalRevenue / totalConversions
      }));

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos de análisis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast({
      title: "Exportando reporte",
      description: "El reporte se está generando y se descargará en breve",
    });
    
    setTimeout(() => {
      toast({
        title: "Reporte exportado",
        description: "El reporte ha sido exportado exitosamente",
      });
    }, 2000);
  };

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6b7280', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avanzado</h1>
          <p className="text-gray-600">Análisis detallado de rendimiento y métricas</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Hoy</SelectItem>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">90 días</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedPeriod === 'custom' && (
              <div>
                <label className="text-sm font-medium">Rango de fechas</label>
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Métrica</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calls">Llamadas</SelectItem>
                  <SelectItem value="conversions">Conversiones</SelectItem>
                  <SelectItem value="revenue">Ingresos</SelectItem>
                  <SelectItem value="agents">Agentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Llamadas</p>
                <p className="text-2xl font-bold">{kpis.total_calls.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs período anterior
                </p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversiones</p>
                <p className="text-2xl font-bold">{kpis.total_conversions}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% vs período anterior
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                <p className="text-2xl font-bold">{kpis.conversion_rate.toFixed(1)}%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% vs período anterior
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold">${kpis.revenue_generated.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.7% vs período anterior
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Llamadas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.calls_by_day}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#3b82f6" name="Llamadas" />
                <Bar dataKey="conversions" fill="#22c55e" name="Conversiones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calls by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Llamadas por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.calls_by_hour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calls" stroke="#3b82f6" name="Llamadas" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#22c55e" name="Conversiones" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disposition Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Disposiciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.disposition_breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.disposition_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.revenue_metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#22c55e" fill="#22c55e" name="Ingresos" />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#ef4444" fill="#ef4444" name="Costos" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Agente</th>
                  <th className="text-left p-4">Llamadas</th>
                  <th className="text-left p-4">Conversiones</th>
                  <th className="text-left p-4">Tasa</th>
                  <th className="text-left p-4">Ingresos</th>
                  <th className="text-left p-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.agent_performance.map((agent, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{agent.agent}</td>
                    <td className="p-4">{agent.calls}</td>
                    <td className="p-4">{agent.conversions}</td>
                    <td className="p-4">
                      <Badge className={agent.rate > 15 ? "bg-green-500" : agent.rate > 10 ? "bg-yellow-500" : "bg-red-500"}>
                        {agent.rate.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-4">${agent.revenue.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className="bg-green-500">Activo</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Embudo de Conversión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.conversion_funnel.map((stage, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{stage.stage}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div 
                    className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.value.toLocaleString()}
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600">{stage.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
