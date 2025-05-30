
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Users,
  Phone,
  DollarSign,
  Target,
  Clock,
  Globe,
  Mail,
  MessageSquare
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('last30');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Datos simulados para reportes
  const salesData = [
    { month: 'Ene', leads: 2400, conversions: 580, revenue: 173400000, calls: 3200 },
    { month: 'Feb', leads: 2800, conversions: 672, revenue: 201600000, calls: 3600 },
    { month: 'Mar', leads: 3200, conversions: 768, revenue: 230400000, calls: 4100 },
    { month: 'Abr', leads: 2900, conversions: 696, revenue: 208800000, calls: 3800 },
    { month: 'May', leads: 3400, conversions: 816, revenue: 244800000, calls: 4300 },
    { month: 'Jun', leads: 3100, conversions: 744, revenue: 223200000, calls: 4000 }
  ];

  const sourcePerformance = [
    { source: 'Facebook Ads', leads: 8420, conversions: 1970, cpl: 12500, roi: 340, revenue: 590300000 },
    { source: 'TikTok Ads', leads: 3250, conversions: 845, cpl: 15200, roi: 290, revenue: 253350000 },
    { source: 'Google Ads', leads: 2100, conversions: 420, cpl: 18500, roi: 280, revenue: 126000000 },
    { source: 'Instagram', leads: 1650, conversions: 297, cpl: 14800, roi: 250, revenue: 89100000 }
  ];

  const agentPerformance = [
    { agent: 'Carlos Rodríguez', calls: 450, conversions: 89, rate: 19.8, revenue: 26700000, hours: 168 },
    { agent: 'María González', calls: 420, conversions: 92, rate: 21.9, revenue: 27600000, hours: 165 },
    { agent: 'Juan Pérez', calls: 380, conversions: 76, rate: 20.0, revenue: 22800000, hours: 160 },
    { agent: 'Ana López', calls: 410, conversions: 98, rate: 23.9, revenue: 29400000, hours: 170 },
    { agent: 'Luis Martínez', calls: 390, conversions: 82, rate: 21.0, revenue: 24600000, hours: 162 }
  ];

  const coursePerformance = [
    { course: 'Contabilidad Básica', leads: 3200, sales: 890, revenue: 266100000, conversion: 27.8, avgTicket: 299000 },
    { course: 'Excel Avanzado', leads: 2800, sales: 728, revenue: 254120000, conversion: 26.0, avgTicket: 349000 },
    { course: 'Marketing Digital', leads: 2400, sales: 576, revenue: 287520000, conversion: 24.0, avgTicket: 499000 },
    { course: 'Nómina', leads: 2100, sales: 483, revenue: 192717000, conversion: 23.0, avgTicket: 399000 }
  ];

  const hourlyActivity = [
    { hour: '08:00', calls: 45, leads: 25, conversions: 8 },
    { hour: '09:00', calls: 62, leads: 38, conversions: 12 },
    { hour: '10:00', calls: 78, leads: 45, conversions: 15 },
    { hour: '11:00', calls: 85, leads: 52, conversions: 18 },
    { hour: '12:00', calls: 42, leads: 28, conversions: 9 },
    { hour: '13:00', calls: 38, leads: 22, conversions: 7 },
    { hour: '14:00', calls: 72, leads: 48, conversions: 16 },
    { hour: '15:00', calls: 88, leads: 58, conversions: 20 },
    { hour: '16:00', calls: 79, leads: 49, conversions: 17 },
    { hour: '17:00', calls: 65, leads: 42, conversions: 14 },
    { hour: '18:00', calls: 55, leads: 35, conversions: 12 },
    { hour: '19:00', calls: 48, leads: 32, conversions: 11 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return growth.toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reportes y Analytics</h1>
          <p className="text-gray-600">
            Análisis detallado del performance comercial
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="yesterday">Ayer</SelectItem>
              <SelectItem value="last7">Últimos 7 días</SelectItem>
              <SelectItem value="last30">Últimos 30 días</SelectItem>
              <SelectItem value="thisMonth">Este mes</SelectItem>
              <SelectItem value="lastMonth">Mes anterior</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(1058750000)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5% vs mes anterior</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">15,420</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+8.2% vs mes anterior</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversiones</p>
                <p className="text-2xl font-bold">3,537</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+15.1% vs mes anterior</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold">22.9%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+2.1% vs mes anterior</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de reportes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="sources">Fuentes</TabsTrigger>
          <TabsTrigger value="agents">Asesores</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        {/* Vista General */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value as number) : value,
                        name === 'revenue' ? 'Ingresos' : name === 'conversions' ? 'Conversiones' : 'Leads'
                      ]}
                    />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="conversions" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourcePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#8884d8" />
                    <Bar dataKey="roi" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Asesores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentPerformance.slice(0, 5).map((agent, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{agent.agent}</p>
                        <p className="text-xs text-gray-600">{agent.conversions} conversiones</p>
                      </div>
                      <Badge variant="outline">{agent.rate}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cursos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coursePerformance.slice(0, 4).map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{course.course}</p>
                        <p className="text-xs text-gray-600">{course.sales} ventas</p>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(course.avgTicket)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Ticket Promedio</span>
                    <span className="font-bold">{formatCurrency(299000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CPL Promedio</span>
                    <span className="font-bold">{formatCurrency(15200)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI Global</span>
                    <span className="font-bold text-green-600">340%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tiempo Promedio</span>
                    <span className="font-bold">8:30 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte de Ventas */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Ingresos']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversiones vs Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#8884d8" />
                    <Bar dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ventas por Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Conversión</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead>Ticket Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursePerformance.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{course.course}</TableCell>
                      <TableCell>{course.leads.toLocaleString()}</TableCell>
                      <TableCell>{course.sales}</TableCell>
                      <TableCell>
                        <Badge variant={course.conversion > 25 ? "default" : "secondary"}>
                          {course.conversion}%
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(course.revenue)}</TableCell>
                      <TableCell>{formatCurrency(course.avgTicket)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Fuentes */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Detallado por Fuente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fuente</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversiones</TableHead>
                    <TableHead>Tasa Conv.</TableHead>
                    <TableHead>CPL</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sourcePerformance.map((source, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell>{source.leads.toLocaleString()}</TableCell>
                      <TableCell>{source.conversions}</TableCell>
                      <TableCell>
                        <Badge variant={source.conversions/source.leads*100 > 20 ? "default" : "secondary"}>
                          {((source.conversions/source.leads)*100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(source.cpl)}</TableCell>
                      <TableCell>
                        <span className={source.roi > 300 ? 'text-green-600 font-bold' : source.roi > 250 ? 'text-yellow-600 font-bold' : 'text-red-600 font-bold'}>
                          {source.roi}%
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(source.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>CPL por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sourcePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'CPL']} />
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
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sourcePerformance}>
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

        {/* Reporte de Asesores */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Individual de Asesores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asesor</TableHead>
                    <TableHead>Llamadas</TableHead>
                    <TableHead>Conversiones</TableHead>
                    <TableHead>Tasa Conv.</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Conv/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentPerformance.map((agent, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{agent.agent}</TableCell>
                      <TableCell>{agent.calls}</TableCell>
                      <TableCell>{agent.conversions}</TableCell>
                      <TableCell>
                        <Badge variant={agent.rate > 22 ? "default" : agent.rate > 20 ? "secondary" : "destructive"}>
                          {agent.rate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(agent.revenue)}</TableCell>
                      <TableCell>{agent.hours}h</TableCell>
                      <TableCell>{(agent.conversions / agent.hours).toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversiones por Asesor</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={agentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Asesor</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={agentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="agent" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Ingresos']} />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte de Cursos */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursePerformance.map((course, index) => (
                  <Card key={index} className="border-l-4 border-blue-500">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">{course.course}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Leads</p>
                          <p className="text-xl font-bold">{course.leads.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ventas</p>
                          <p className="text-xl font-bold text-green-600">{course.sales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversión</p>
                          <p className="text-xl font-bold">{course.conversion}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ticket Prom.</p>
                          <p className="text-xl font-bold">{formatCurrency(course.avgTicket)}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(course.revenue)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Actividad */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calls" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="conversions" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efectividad por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => [
                      `${((props.payload.conversions / props.payload.calls) * 100).toFixed(1)}%`,
                      'Tasa de Conversión'
                    ]} />
                    <Line 
                      type="monotone" 
                      dataKey={(data: any) => (data.conversions / data.calls) * 100} 
                      stroke="#8884d8" 
                      strokeWidth={3} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Mejor Hora</p>
                <p className="text-xl font-bold">15:00</p>
                <p className="text-xs text-green-600">22.7% conv.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pico Llamadas</p>
                <p className="text-xl font-bold">15:00</p>
                <p className="text-xs text-gray-600">88 llamadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Hora Menos Efectiva</p>
                <p className="text-xl font-bold">13:00</p>
                <p className="text-xs text-red-600">18.4% conv.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Promedio Día</p>
                <p className="text-xl font-bold">21.2%</p>
                <p className="text-xs text-green-600">+2.1% vs ayer</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
