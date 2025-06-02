
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Phone, 
  Target, 
  DollarSign,
  Calendar,
  Clock,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageSquare,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  // Datos simulados para métricas en tiempo real
  const metrics = {
    leads: {
      total: 1247,
      new: 89,
      contacted: 156,
      converted: 23,
      trend: 12.5
    },
    calls: {
      total: 342,
      connected: 234,
      avgDuration: '8:45',
      conversionRate: 6.7,
      trend: -2.3
    },
    revenue: {
      total: 45670000,
      monthly: 67800000,
      target: 80000000,
      trend: 18.2
    },
    advisors: {
      active: 12,
      available: 8,
      inCall: 3,
      onBreak: 1,
      avgPerformance: 78.5
    }
  };

  // Datos para gráficos
  const dailyTrends = [
    { time: '09:00', leads: 45, calls: 32, conversions: 3 },
    { time: '10:00', leads: 67, calls: 48, conversions: 5 },
    { time: '11:00', leads: 89, calls: 67, conversions: 8 },
    { time: '12:00', leads: 78, calls: 56, conversions: 6 },
    { time: '13:00', leads: 45, calls: 34, conversions: 4 },
    { time: '14:00', leads: 98, calls: 78, conversions: 12 },
    { time: '15:00', leads: 123, calls: 89, conversions: 15 },
    { time: '16:00', leads: 109, calls: 82, conversions: 11 },
    { time: '17:00', leads: 87, calls: 65, conversions: 9 },
    { time: '18:00', leads: 56, calls: 43, conversions: 6 }
  ];

  const sourceData = [
    { name: 'Meta Ads', value: 342, cost: 2500000, conversions: 23, color: '#3b82f6' },
    { name: 'TikTok Ads', value: 189, cost: 1800000, conversions: 15, color: '#10b981' },
    { name: 'Google Ads', value: 156, cost: 2200000, conversions: 18, color: '#f59e0b' },
    { name: 'Instagram', value: 98, cost: 1200000, conversions: 8, color: '#ef4444' },
    { name: 'Orgánico', value: 67, cost: 0, conversions: 5, color: '#8b5cf6' }
  ];

  const advisorPerformance = [
    { name: 'Carlos R.', calls: 45, conversions: 8, revenue: 8500000, efficiency: 92 },
    { name: 'María G.', calls: 38, conversions: 6, revenue: 6800000, efficiency: 87 },
    { name: 'Luis M.', calls: 42, conversions: 7, revenue: 7200000, efficiency: 89 },
    { name: 'Ana L.', calls: 35, conversions: 5, revenue: 5900000, efficiency: 78 },
    { name: 'Diego S.', calls: 40, conversions: 6, revenue: 6500000, efficiency: 85 }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Comercial</h1>
          <p className="text-gray-600">Monitoreo en tiempo real - CCD Capacitación</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Trimestre</option>
          </select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Totales</p>
                <p className="text-3xl font-bold">{metrics.leads.total.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {metrics.leads.trend > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm ${metrics.leads.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metrics.leads.trend)}%
                  </span>
                  <span className="text-sm text-gray-600 ml-1">vs ayer</span>
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
                <p className="text-sm text-gray-600">Llamadas Realizadas</p>
                <p className="text-3xl font-bold">{metrics.calls.total}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {metrics.calls.connected} conectadas ({((metrics.calls.connected/metrics.calls.total)*100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversiones</p>
                <p className="text-3xl font-bold">{metrics.leads.converted}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    Tasa: {metrics.calls.conversionRate}%
                  </span>
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
                <p className="text-sm text-gray-600">Ingresos Hoy</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.revenue.total)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    {metrics.revenue.trend}% vs ayer
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="advisors">Asesores</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de tendencias diarias */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="calls" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="conversions" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución por fuentes */}
            <Card>
              <CardHeader>
                <CardTitle>Leads por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Estado de asesores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Estado del Equipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.advisors.available}</div>
                  <div className="text-sm text-gray-600">Disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.advisors.inCall}</div>
                  <div className="text-sm text-gray-600">En Llamada</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{metrics.advisors.onBreak}</div>
                  <div className="text-sm text-gray-600">En Pausa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{metrics.advisors.avgPerformance}%</div>
                  <div className="text-sm text-gray-600">Performance Promedio</div>
                </div>
              </div>

              <div className="space-y-3">
                {advisorPerformance.map((advisor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{advisor.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{advisor.name}</h4>
                        <p className="text-sm text-gray-600">{advisor.calls} llamadas • {advisor.conversions} conversiones</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(advisor.revenue)}</div>
                      <div className="flex items-center gap-2">
                        <Progress value={advisor.efficiency} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">{advisor.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estados de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Nuevos</span>
                    <Badge variant="secondary">{metrics.leads.new}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Contactados</span>
                    <Badge variant="outline">{metrics.leads.contacted}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Convertidos</span>
                    <Badge className="bg-green-100 text-green-800">{metrics.leads.converted}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sourceData.map((source, index) => {
                    const roi = ((source.conversions * 1000000 - source.cost) / source.cost * 100).toFixed(1);
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{source.name}</span>
                        <span className={`text-sm font-medium ${parseFloat(roi) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {roi}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Ingresos</span>
                      <span>{formatCurrency(metrics.revenue.monthly)} / {formatCurrency(metrics.revenue.target)}</span>
                    </div>
                    <Progress value={(metrics.revenue.monthly / metrics.revenue.target) * 100} />
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold">
                      {((metrics.revenue.monthly / metrics.revenue.target) * 100).toFixed(1)}%
                    </span>
                    <p className="text-sm text-gray-600">de la meta alcanzada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advisors">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Detallado de Asesores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={advisorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#3b82f6" name="Llamadas" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Costo por Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value) / 1000)} />
                    <Bar dataKey="cost" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversiones por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Conversión</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
