
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  DownloadCloud,
  Calendar,
  TrendingUp,
  UserCheck,
  Mail,
  Phone,
  Repeat,
  Clock,
  BarChart2,
  PieChart as PieChartIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Share2
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('advisor');
  const [dateRange, setDateRange] = useState('week');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const DISPOSITION_COLORS: Record<string, string> = {
    'NO_CONTESTA': '#CBD5E1',    // Gris
    'NO_DESEA': '#F87171',       // Rojo
    'CLTE_POTENCIAL': '#FBBF24', // Amarillo
    'VOLVER_LLAMAR': '#60A5FA',  // Azul
    'MUY_INTERESADO': '#34D399', // Verde claro
    'SER_VACANTE': '#A78BFA',    // Morado
    'PAGO_INCOMPLETO': '#FB923C',// Naranja
    'TRIBULADO': '#22C55E',      // Verde
    'EFICAZ': '#94A3B8'          // Gris oscuro
  };

  // Datos simulados para reportes
  const dailyCallsData = [
    { day: 'Lun', calls: 23, answered: 18, conversions: 3 },
    { day: 'Mar', calls: 18, answered: 15, conversions: 2 },
    { day: 'Mié', calls: 25, answered: 20, conversions: 5 },
    { day: 'Jue', calls: 30, answered: 22, conversions: 4 },
    { day: 'Vie', calls: 28, answered: 24, conversions: 7 },
    { day: 'Sáb', calls: 15, answered: 13, conversions: 3 },
    { day: 'Dom', calls: 0, answered: 0, conversions: 0 }
  ];

  const monthlyPerformance = [
    { month: 'Ene', calls: 120, conversions: 12, target: 15 },
    { month: 'Feb', calls: 150, conversions: 18, target: 15 },
    { month: 'Mar', calls: 180, conversions: 22, target: 20 },
    { month: 'Abr', calls: 170, conversions: 15, target: 20 },
    { month: 'May', calls: 200, conversions: 23, target: 25 },
    { month: 'Jun', calls: 160, conversions: 19, target: 25 }
  ];

  const dispositionData = [
    { name: 'No Contesta', value: 35, code: 'NO_CONTESTA' },
    { name: 'No Desea', value: 12, code: 'NO_DESEA' },
    { name: 'Cliente Potencial', value: 18, code: 'CLTE_POTENCIAL' },
    { name: 'Volver a Llamar', value: 22, code: 'VOLVER_LLAMAR' },
    { name: 'Muy Interesado', value: 15, code: 'MUY_INTERESADO' },
    { name: 'Ser Vacante', value: 8, code: 'SER_VACANTE' },
    { name: 'Pago Incompleto', value: 5, code: 'PAGO_INCOMPLETO' },
    { name: 'Tribulado', value: 6, code: 'TRIBULADO' },
    { name: 'Eficaz', value: 9, code: 'EFICAZ' }
  ];

  const conversionBySourceData = [
    { source: 'Facebook', leads: 45, interested: 22, converted: 8 },
    { source: 'Google', leads: 35, interested: 18, converted: 7 },
    { source: 'TikTok', leads: 25, interested: 10, converted: 3 },
    { source: 'Instagram', leads: 30, interested: 14, converted: 5 },
    { source: 'WhatsApp', leads: 20, interested: 12, converted: 6 },
    { source: 'Referido', leads: 15, interested: 10, converted: 7 },
  ];

  const timeDistributionData = [
    { name: 'Llamadas', value: 35 },
    { name: 'Preparación', value: 15 },
    { name: 'Seguimiento', value: 20 },
    { name: 'Pausas', value: 10 },
    { name: 'Admin', value: 20 }
  ];

  const dailyCallTimes = [
    { name: '08:00', duration: 0 },
    { name: '09:00', duration: 38 },
    { name: '10:00', duration: 52 },
    { name: '11:00', duration: 43 },
    { name: '12:00', duration: 25 },
    { name: '13:00', duration: 0 },
    { name: '14:00', duration: 28 },
    { name: '15:00', duration: 45 },
    { name: '16:00', duration: 32 },
    { name: '17:00', duration: 40 },
    { name: '18:00', duration: 22 },
    { name: '19:00', duration: 0 }
  ];

  const performanceMetrics = {
    callsToday: 25,
    callsWeek: 139,
    callsMonth: 580,
    conversionRate: '18.4%',
    avgCallTime: '4:23',
    connectRate: '72%',
    callbacks: 8,
    avgFollowUps: 2.3
  };

  // Función para renderizar el contenido expandido o contraído de las tarjetas
  const renderCardContent = (id: string, title: string, icon: React.ReactNode, metrics: React.ReactNode, chart: React.ReactNode) => {
    const isExpanded = expandedCard === id;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle>{title}</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpandedCard(isExpanded ? null : id)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {metrics}
          {isExpanded && (
            <div className="mt-4">
              {chart}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analíticos</h1>
          <p className="text-gray-600">
            Visualiza tu desempeño y métricas importantes
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <DownloadCloud className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Tipos de reportes */}
      <Tabs defaultValue="advisor" value={reportType} onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="advisor" disabled={user?.role !== 'AGENT'}>Desempeño del Asesor</TabsTrigger>
          <TabsTrigger value="leads" disabled={user?.role !== 'AGENT'}>Gestión de Leads</TabsTrigger>
          <TabsTrigger value="calls" disabled={user?.role !== 'AGENT'}>Métricas de Llamadas</TabsTrigger>
        </TabsList>

        <TabsContent value="advisor" className="space-y-6 mt-6">
          {/* Métricas rápidas de desempeño */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium text-gray-600">Llamadas (hoy)</p>
                  <p className="text-2xl font-bold">{performanceMetrics.callsToday}</p>
                  <p className="text-xs text-gray-500">{performanceMetrics.callsWeek} esta semana</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                  <p className="text-2xl font-bold">{performanceMetrics.conversionRate}</p>
                  <p className="text-xs text-green-600">+2.3% vs. mes anterior</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold">{performanceMetrics.avgCallTime}</p>
                  <p className="text-xs text-gray-500">por llamada</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <UserCheck className="h-5 w-5 text-purple-500" />
                  <p className="text-sm font-medium text-gray-600">Tasa de Conexión</p>
                  <p className="text-2xl font-bold">{performanceMetrics.connectRate}</p>
                  <p className="text-xs text-red-600">-3.1% vs. semana anterior</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Llamadas diarias */}
            {renderCardContent(
              'daily-calls',
              'Actividad de Llamadas',
              <BarChart2 className="h-5 w-5 text-blue-500" />,
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de llamadas</p>
                  <p className="text-xl font-bold">{dailyCallsData.reduce((sum, item) => sum + item.calls, 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Respondidas</p>
                  <p className="text-xl font-bold">{dailyCallsData.reduce((sum, item) => sum + item.answered, 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversiones</p>
                  <p className="text-xl font-bold">{dailyCallsData.reduce((sum, item) => sum + item.conversions, 0)}</p>
                </div>
              </div>,
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyCallsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" name="Llamadas" fill="#3b82f6" />
                    <Bar dataKey="answered" name="Respondidas" fill="#10b981" />
                    <Bar dataKey="conversions" name="Conversiones" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tipificaciones */}
            {renderCardContent(
              'dispositions',
              'Tipificaciones de Llamadas',
              <PieChartIcon className="h-5 w-5 text-purple-500" />,
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total tipificaciones</p>
                  <p className="text-xl font-bold">{dispositionData.reduce((sum, item) => sum + item.value, 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Más común</p>
                  <p className="text-xl font-bold">No Contesta</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversiones</p>
                  <p className="text-xl font-bold">{dispositionData.filter(d => ['SER_VACANTE', 'TRIBULADO'].includes(d.code)).reduce((sum, item) => sum + item.value, 0)}</p>
                </div>
              </div>,
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dispositionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dispositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DISPOSITION_COLORS[entry.code] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} llamadas`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Gráficos secundarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendencia mensual */}
            {renderCardContent(
              'monthly-performance',
              'Tendencia de Conversiones',
              <TrendingUp className="h-5 w-5 text-green-500" />,
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total conversiones</p>
                  <p className="text-xl font-bold">{monthlyPerformance.reduce((sum, item) => sum + item.conversions, 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Meta cumplida</p>
                  <p className="text-xl font-bold">
                    {Math.round((monthlyPerformance.reduce((sum, item) => sum + item.conversions, 0) / 
                      monthlyPerformance.reduce((sum, item) => sum + item.target, 0)) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tendencia</p>
                  <p className="text-xl font-bold text-green-600">↑</p>
                </div>
              </div>,
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversions" name="Conversiones" stroke="#10b981" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="target" name="Meta" stroke="#f59e0b" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Distribución del tiempo */}
            {renderCardContent(
              'time-distribution',
              'Distribución del Tiempo',
              <Clock className="h-5 w-5 text-blue-500" />,
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo productivo</p>
                  <p className="text-xl font-bold">
                    {Math.round(((timeDistributionData[0].value + timeDistributionData[1].value + timeDistributionData[2].value) / 
                      timeDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo en llamadas</p>
                  <p className="text-xl font-bold">
                    {Math.round((timeDistributionData[0].value / 
                      timeDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo en pausas</p>
                  <p className="text-xl font-bold">
                    {Math.round((timeDistributionData[3].value / 
                      timeDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                  </p>
                </div>
              </div>,
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Análisis de tiempos de llamada */}
          {renderCardContent(
            'call-times',
            'Duración de Llamadas por Hora',
            <BarChart2 className="h-5 w-5 text-orange-500" />,
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-xl font-bold">
                  {Math.round(dailyCallTimes.reduce((sum, item) => sum + item.duration, 0) / 
                    dailyCallTimes.filter(item => item.duration > 0).length)} mins
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hora más productiva</p>
                <p className="text-xl font-bold">
                  {dailyCallTimes.reduce((max, item) => item.duration > max.duration ? item : max, { name: '', duration: 0 }).name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total tiempo</p>
                <p className="text-xl font-bold">
                  {Math.round(dailyCallTimes.reduce((sum, item) => sum + item.duration, 0) / 60)} hrs
                </p>
              </div>
            </div>,
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyCallTimes}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} mins`, 'Duración']} />
                  <Area type="monotone" dataKey="duration" name="Duración (mins)" stroke="#f59e0b" fill="#fef3c7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leads" className="space-y-6 mt-6">
          {/* Resumen de leads */}
          <Card>
            <CardHeader>
              <CardTitle>Visión General de Leads</CardTitle>
              <CardDescription>Análisis de tus leads asignados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold">143</p>
                  <p className="text-xs text-green-600">+12 esta semana</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contactados</p>
                  <p className="text-2xl font-bold">98</p>
                  <p className="text-xs text-gray-500">68.5% del total</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Interesados</p>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-xs text-gray-500">45.9% de contactados</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Convertidos</p>
                  <p className="text-2xl font-bold">19</p>
                  <p className="text-xs text-gray-500">19.3% de contactados</p>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionBySourceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leads" name="Leads" fill="#94a3b8" />
                    <Bar dataKey="interested" name="Interesados" fill="#60a5fa" />
                    <Bar dataKey="converted" name="Convertidos" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tipificaciones por fuente */}
          <Card>
            <CardHeader>
              <CardTitle>Tipificaciones por Fuente</CardTitle>
              <CardDescription>Cómo se comportan los leads según su origen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Fuente</th>
                      <th className="pb-2">No Contesta</th>
                      <th className="pb-2">No Desea</th>
                      <th className="pb-2">Potencial</th>
                      <th className="pb-2">Muy Interesado</th>
                      <th className="pb-2">Vacante</th>
                      <th className="pb-2">Tribulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Facebook</td>
                      <td>24%</td>
                      <td>15%</td>
                      <td>20%</td>
                      <td>18%</td>
                      <td>12%</td>
                      <td>11%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Google</td>
                      <td>20%</td>
                      <td>12%</td>
                      <td>22%</td>
                      <td>25%</td>
                      <td>14%</td>
                      <td>7%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">TikTok</td>
                      <td>35%</td>
                      <td>18%</td>
                      <td>23%</td>
                      <td>10%</td>
                      <td>9%</td>
                      <td>5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Instagram</td>
                      <td>28%</td>
                      <td>14%</td>
                      <td>18%</td>
                      <td>20%</td>
                      <td>12%</td>
                      <td>8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Referido</td>
                      <td>15%</td>
                      <td>10%</td>
                      <td>15%</td>
                      <td>25%</td>
                      <td>20%</td>
                      <td>15%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="space-y-6 mt-6">
          {/* Métricas de llamadas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium text-gray-600">Duración Promedio</p>
                  <p className="text-2xl font-bold">4:23</p>
                  <p className="text-xs text-gray-500">minutos por llamada</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Repeat className="h-5 w-5 text-purple-500" />
                  <p className="text-sm font-medium text-gray-600">Reintentos</p>
                  <p className="text-2xl font-bold">2.4</p>
                  <p className="text-xs text-gray-500">promedio por lead</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-gray-600">Tasa de Respuesta</p>
                  <p className="text-2xl font-bold">72%</p>
                  <p className="text-xs text-green-600">+5% vs. anterior</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <p className="text-sm font-medium text-gray-600">Callbacks Programados</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-gray-500">pendientes actualmente</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalles de llamadas */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado de Llamadas</CardTitle>
              <CardDescription>Distribución de resultados de llamadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dispositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dispositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DISPOSITION_COLORS[entry.code] || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} llamadas`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-4">Distribución de Resultados</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">No Contesta (35)</span>
                        <span className="text-sm font-medium">27.3%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-500 rounded-full" style={{ width: '27.3%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Muy Interesado (15)</span>
                        <span className="text-sm font-medium">11.7%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '11.7%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Cliente Potencial (18)</span>
                        <span className="text-sm font-medium">14.1%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '14.1%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Tribulado + Ser Vacante (14)</span>
                        <span className="text-sm font-medium">10.9%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '10.9%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Otros (46)</span>
                        <span className="text-sm font-medium">35.9%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '35.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
