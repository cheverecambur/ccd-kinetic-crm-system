
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Clock, 
  PhoneCall,
  MessageSquare,
  Mail,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Globe,
  Smartphone,
  Headphones,
  Timer,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Datos simulados para el dashboard
const dashboardData = {
  realTimeMetrics: {
    totalLeads: 15420,
    todayLeads: 127,
    activeAgents: 18,
    callsInProgress: 12,
    conversionRate: 23.4,
    dailyRevenue: 2850000,
    avgCallDuration: 8.5,
    callsCompleted: 89
  },
  alerts: [
    { type: 'critical', message: 'Facebook Ads: CPL aumentó 40% en últimas 2 horas', time: '10:30 AM' },
    { type: 'success', message: 'Meta mensual alcanzada - Línea Contabilidad', time: '9:15 AM' },
    { type: 'warning', message: '3 asesores inactivos por más de 15 minutos', time: '8:45 AM' },
    { type: 'info', message: 'Lead alta calidad asignado - Score: 95', time: '8:30 AM' }
  ],
  conversionBySource: [
    { source: 'Facebook Ads', leads: 8420, conversions: 1970, conversion_rate: 23.4, cpl: 12500, roi: 340 },
    { source: 'TikTok Ads', leads: 3250, conversions: 845, conversion_rate: 26.0, cpl: 15200, roi: 290 },
    { source: 'Google Ads', leads: 2100, conversions: 420, conversion_rate: 20.0, cpl: 18500, roi: 280 },
    { source: 'Instagram', leads: 1650, conversions: 297, conversion_rate: 18.0, cpl: 14800, roi: 250 }
  ],
  dailyActivity: [
    { hour: '08:00', calls: 15, leads: 25, conversions: 3 },
    { hour: '09:00', calls: 32, leads: 45, conversions: 8 },
    { hour: '10:00', calls: 28, leads: 38, conversions: 6 },
    { hour: '11:00', calls: 35, leads: 42, conversions: 9 },
    { hour: '12:00', calls: 22, leads: 28, conversions: 4 },
    { hour: '13:00', calls: 18, leads: 22, conversions: 3 },
    { hour: '14:00', calls: 30, leads: 40, conversions: 7 },
    { hour: '15:00', calls: 33, leads: 43, conversions: 8 },
    { hour: '16:00', calls: 29, leads: 37, conversions: 6 },
    { hour: '17:00', calls: 25, leads: 32, conversions: 5 }
  ],
  agentStatus: [
    { id: 1, name: 'Carlos Rodríguez', status: 'En llamada', time: '00:05:23', calls: 12, conversions: 3, avatar: 'CR' },
    { id: 2, name: 'María González', status: 'Disponible', time: '00:00:00', calls: 15, conversions: 4, avatar: 'MG' },
    { id: 3, name: 'Juan Pérez', status: 'En pausa', time: '00:02:15', calls: 8, conversions: 2, avatar: 'JP' },
    { id: 4, name: 'Ana López', status: 'En llamada', time: '00:08:42', calls: 18, conversions: 5, avatar: 'AL' },
    { id: 5, name: 'Luis Martínez', status: 'Tipificando', time: '00:01:05', calls: 10, conversions: 3, avatar: 'LM' },
    { id: 6, name: 'Sofia Torres', status: 'Disponible', time: '00:00:00', calls: 14, conversions: 4, avatar: 'ST' }
  ],
  coursesPerformance: [
    { course: 'Contabilidad Básica', leads: 3200, sales: 890, revenue: 266100000, conversion: 27.8 },
    { course: 'Excel Avanzado', leads: 2800, sales: 728, revenue: 254120000, conversion: 26.0 },
    { course: 'Marketing Digital', leads: 2400, sales: 576, revenue: 287520000, conversion: 24.0 },
    { course: 'Nómina', leads: 2100, sales: 483, revenue: 192717000, conversion: 23.0 }
  ],
  weeklyTrends: [
    { day: 'Lun', leads: 180, calls: 245, conversions: 42 },
    { day: 'Mar', leads: 210, calls: 285, conversions: 51 },
    { day: 'Mié', leads: 195, calls: 267, conversions: 47 },
    { day: 'Jue', leads: 225, calls: 298, conversions: 56 },
    { day: 'Vie', leads: 240, calls: 315, conversions: 61 },
    { day: 'Sáb', leads: 165, calls: 198, conversions: 34 },
    { day: 'Dom', leads: 85, calls: 102, conversions: 18 }
  }
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedSource, setSelectedSource] = useState('all');
  const { toast } = useToast();

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Aquí se actualizarían los datos desde la API
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En llamada': return 'bg-green-500';
      case 'Disponible': return 'bg-blue-500';
      case 'En pausa': return 'bg-yellow-500';
      case 'Tipificando': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CCD Capacitación</h1>
          <p className="text-gray-600">
            Última actualización: {lastUpdate.toLocaleTimeString()}
            {autoRefresh && <span className="ml-2 text-green-600">● Auto-refresh activo</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Alertas críticas */}
      <div className="grid grid-cols-1 gap-2">
        {dashboardData.alerts.slice(0, 2).map((alert, index) => (
          <Alert key={index} className={`border-l-4 ${
            alert.type === 'critical' ? 'border-red-500 bg-red-50' :
            alert.type === 'success' ? 'border-green-500 bg-green-50' :
            alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getAlertIcon(alert.type)}
                <AlertDescription className="font-medium">
                  {alert.message}
                </AlertDescription>
              </div>
              <span className="text-sm text-gray-500">{alert.time}</span>
            </div>
          </Alert>
        ))}
      </div>

      {/* Métricas principales en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads Totales</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.realTimeMetrics.totalLeads.toLocaleString()}</div>
            <p className="text-xs opacity-80">
              +{dashboardData.realTimeMetrics.todayLeads} hoy
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.realTimeMetrics.conversionRate}%</div>
            <p className="text-xs opacity-80">
              +2.1% vs ayer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(dashboardData.realTimeMetrics.dailyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs opacity-80">
              Meta: $3.2M
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Asesores Activos</CardTitle>
            <Headphones className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.realTimeMetrics.activeAgents}</div>
            <p className="text-xs opacity-80">
              {dashboardData.realTimeMetrics.callsInProgress} en llamada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="agents">Asesores</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="sources">Fuentes</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Vista General */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de actividad diaria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Actividad del Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dashboardData.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calls" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="conversions" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por fuente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Conversión por Fuente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.conversionBySource.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`}></div>
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{source.conversion_rate}%</div>
                        <div className="text-sm text-gray-500">{source.conversions} ventas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rendimiento de Llamadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Llamadas completadas</span>
                  <span className="font-bold">{dashboardData.realTimeMetrics.callsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duración promedio</span>
                  <span className="font-bold">{dashboardData.realTimeMetrics.avgCallDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span>En progreso</span>
                  <span className="font-bold text-green-600">{dashboardData.realTimeMetrics.callsInProgress}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metas del Día</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Llamadas</span>
                    <span>89/120</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Conversiones</span>
                    <span>21/30</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Ingresos</span>
                    <span>$2.8M/$3.2M</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Alertas Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardData.alerts.slice(0, 4).map((alert, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-400">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestión de Asesores */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estado de Asesores en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.agentStatus.map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{agent.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{agent.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                          <span className="text-sm text-gray-600">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Tiempo:</span>
                        <span className="font-mono">{agent.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Llamadas:</span>
                        <span>{agent.calls}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conversiones:</span>
                        <span className="text-green-600">{agent.conversions}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis de Campañas */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Campañas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.conversionBySource.map((source, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{source.source}</h4>
                        <p className="text-sm text-gray-600">{source.leads.toLocaleString()} leads generados</p>
                      </div>
                      <Badge variant={source.roi > 300 ? "default" : source.roi > 250 ? "secondary" : "destructive"}>
                        ROI: {source.roi}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Conversiones</p>
                        <p className="font-bold text-lg">{source.conversions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasa Conv.</p>
                        <p className="font-bold text-lg">{source.conversion_rate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CPL</p>
                        <p className="font-bold text-lg">${(source.cpl / 1000).toFixed(1)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estado</p>
                        <p className="font-bold text-lg text-green-600">Activa</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis de Fuentes */}
        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Costo por Lead (CPL)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.conversionBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${(value as number / 1000).toFixed(1)}K`, 'CPL']} />
                    <Bar dataKey="cpl" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.conversionBySource}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                    <Bar dataKey="roi" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rendimiento de Cursos */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.coursesPerformance.map((course, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{course.course}</h4>
                        <p className="text-sm text-gray-600">{course.leads} leads • {course.sales} ventas</p>
                      </div>
                      <Badge variant="outline">
                        {course.conversion}% conversión
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Ingresos</p>
                        <p className="font-bold">${(course.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg. Ticket</p>
                        <p className="font-bold">${(course.revenue / course.sales / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tendencia</p>
                        <p className="font-bold text-green-600">↗ +12%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Avanzado */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencias Semanales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heatmap de Actividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 24 * 7 }, (_, i) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm ${
                          intensity > 0.7 ? 'bg-green-500' :
                          intensity > 0.5 ? 'bg-green-400' :
                          intensity > 0.3 ? 'bg-green-300' :
                          intensity > 0.1 ? 'bg-green-200' :
                          'bg-gray-100'
                        }`}
                        title={`Actividad: ${Math.floor(intensity * 100)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Dom</span>
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mié</span>
                  <span>Jue</span>
                  <span>Vie</span>
                  <span>Sáb</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Panel de acciones rápidas flotante */}
      <div className="fixed bottom-6 right-6 space-y-2">
        <Button className="w-12 h-12 rounded-full shadow-lg" size="sm">
          <Plus className="h-5 w-5" />
        </Button>
        <Button variant="secondary" className="w-12 h-12 rounded-full shadow-lg" size="sm">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="w-12 h-12 rounded-full shadow-lg" size="sm">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
