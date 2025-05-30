
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy,
  Target,
  Phone,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Activity,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Zap,
  Eye,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface AdvisorMetrics {
  id: string;
  name: string;
  avatar: string;
  status: 'available' | 'incall' | 'paused' | 'offline';
  extension: string;
  dailyStats: {
    calls: number;
    connected: number;
    conversions: number;
    revenue: number;
    avgCallDuration: number;
    workingTime: number;
    talkTime: number;
    pauseTime: number;
  };
  weeklyStats: {
    calls: number;
    conversions: number;
    revenue: number;
    avgPerformance: number;
  };
  monthlyStats: {
    calls: number;
    conversions: number;
    revenue: number;
    target: number;
    ranking: number;
  };
  goals: {
    dailyCalls: number;
    dailyConversions: number;
    monthlyRevenue: number;
  };
  skills: {
    name: string;
    level: number;
  }[];
  performanceHistory: {
    date: string;
    calls: number;
    conversions: number;
    efficiency: number;
  }[];
}

const AdvisorPerformance = () => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('');
  const [timeRange, setTimeRange] = useState('today');

  // Datos simulados de asesores
  const advisors: AdvisorMetrics[] = [
    {
      id: 'advisor1',
      name: 'Carlos Rodríguez',
      avatar: 'CR',
      status: 'incall',
      extension: '1001',
      dailyStats: {
        calls: 45,
        connected: 38,
        conversions: 8,
        revenue: 8500000,
        avgCallDuration: 520, // segundos
        workingTime: 480, // minutos
        talkTime: 320,
        pauseTime: 45
      },
      weeklyStats: {
        calls: 215,
        conversions: 35,
        revenue: 42500000,
        avgPerformance: 92
      },
      monthlyStats: {
        calls: 890,
        conversions: 145,
        revenue: 165000000,
        target: 180000000,
        ranking: 1
      },
      goals: {
        dailyCalls: 50,
        dailyConversions: 10,
        monthlyRevenue: 180000000
      },
      skills: [
        { name: 'Ventas', level: 95 },
        { name: 'Comunicación', level: 90 },
        { name: 'Contabilidad', level: 85 },
        { name: 'Excel', level: 88 },
        { name: 'Seguimiento', level: 92 }
      ],
      performanceHistory: [
        { date: '2024-01-20', calls: 42, conversions: 7, efficiency: 87 },
        { date: '2024-01-21', calls: 38, conversions: 6, efficiency: 82 },
        { date: '2024-01-22', calls: 45, conversions: 9, efficiency: 95 },
        { date: '2024-01-23', calls: 40, conversions: 8, efficiency: 90 },
        { date: '2024-01-24', calls: 47, conversions: 10, efficiency: 98 },
        { date: '2024-01-25', calls: 43, conversions: 8, efficiency: 89 },
        { date: '2024-01-26', calls: 45, conversions: 8, efficiency: 92 }
      ]
    },
    {
      id: 'advisor2',
      name: 'María González',
      avatar: 'MG',
      status: 'available',
      extension: '1002',
      dailyStats: {
        calls: 38,
        connected: 32,
        conversions: 6,
        revenue: 6800000,
        avgCallDuration: 480,
        workingTime: 480,
        talkTime: 280,
        pauseTime: 60
      },
      weeklyStats: {
        calls: 190,
        conversions: 28,
        revenue: 35600000,
        avgPerformance: 87
      },
      monthlyStats: {
        calls: 780,
        conversions: 118,
        revenue: 142000000,
        target: 160000000,
        ranking: 2
      },
      goals: {
        dailyCalls: 45,
        dailyConversions: 8,
        monthlyRevenue: 160000000
      },
      skills: [
        { name: 'Ventas', level: 88 },
        { name: 'Comunicación', level: 92 },
        { name: 'Marketing', level: 90 },
        { name: 'Excel', level: 82 },
        { name: 'Seguimiento', level: 89 }
      ],
      performanceHistory: [
        { date: '2024-01-20', calls: 35, conversions: 5, efficiency: 78 },
        { date: '2024-01-21', calls: 40, conversions: 7, efficiency: 85 },
        { date: '2024-01-22', calls: 42, conversions: 8, efficiency: 90 },
        { date: '2024-01-23', calls: 36, conversions: 6, efficiency: 82 },
        { date: '2024-01-24', calls: 39, conversions: 7, efficiency: 87 },
        { date: '2024-01-25', calls: 41, conversions: 8, efficiency: 92 },
        { date: '2024-01-26', calls: 38, conversions: 6, efficiency: 87 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      incall: 'bg-blue-500',
      paused: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts = {
      available: 'Disponible',
      incall: 'En Llamada',
      paused: 'En Pausa',
      offline: 'Desconectado'
    };
    return texts[status as keyof typeof texts] || 'Desconocido';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const advisor = advisors.find(a => a.id === selectedAdvisor) || advisors[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rendimiento de Asesores</h1>
          <p className="text-gray-600">Análisis detallado de performance individual</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      {/* Selector de asesor */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Asesor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisors.map((adv) => (
              <div
                key={adv.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAdvisor === adv.id || (selectedAdvisor === '' && adv.id === advisors[0].id)
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAdvisor(adv.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{adv.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{adv.name}</h4>
                    <p className="text-sm text-gray-600">Ext. {adv.extension}</p>
                  </div>
                  <Badge className={`${getStatusColor(adv.status)} text-white`}>
                    {getStatusText(adv.status)}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold">{adv.dailyStats.calls}</div>
                    <div className="text-xs text-gray-600">Llamadas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{adv.dailyStats.conversions}</div>
                    <div className="text-xs text-gray-600">Conversiones</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {((adv.dailyStats.conversions / adv.dailyStats.calls) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Tasa</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Panel detallado del asesor seleccionado */}
      {advisor && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Header del asesor */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">{advisor.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{advisor.name}</h2>
                      <p className="text-gray-600">Extensión {advisor.extension}</p>
                      <Badge className={`${getStatusColor(advisor.status)} text-white mt-2`}>
                        {getStatusText(advisor.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Ranking Mensual</div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <span className="text-2xl font-bold">#{advisor.monthlyStats.ranking}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas del día */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Llamadas Realizadas</p>
                      <p className="text-3xl font-bold">{advisor.dailyStats.calls}</p>
                      <p className="text-sm text-green-600">
                        {advisor.dailyStats.connected} conectadas
                      </p>
                    </div>
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversiones</p>
                      <p className="text-3xl font-bold">{advisor.dailyStats.conversions}</p>
                      <p className="text-sm text-green-600">
                        {((advisor.dailyStats.conversions / advisor.dailyStats.calls) * 100).toFixed(1)}% tasa
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ingresos Generados</p>
                      <p className="text-2xl font-bold">{formatCurrency(advisor.dailyStats.revenue)}</p>
                      <p className="text-sm text-gray-600">Hoy</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tiempo en Llamadas</p>
                      <p className="text-2xl font-bold">{formatTime(advisor.dailyStats.talkTime)}</p>
                      <p className="text-sm text-gray-600">
                        de {formatTime(advisor.dailyStats.workingTime)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribución del tiempo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución del Tiempo Laboral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tiempo en llamadas</span>
                      <span>{formatTime(advisor.dailyStats.talkTime)} / {formatTime(advisor.dailyStats.workingTime)}</span>
                    </div>
                    <Progress value={(advisor.dailyStats.talkTime / advisor.dailyStats.workingTime) * 100} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tiempo en pausa</span>
                      <span>{formatTime(advisor.dailyStats.pauseTime)}</span>
                    </div>
                    <Progress value={(advisor.dailyStats.pauseTime / advisor.dailyStats.workingTime) * 100} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tiempo disponible</span>
                      <span>{formatTime(advisor.dailyStats.workingTime - advisor.dailyStats.talkTime - advisor.dailyStats.pauseTime)}</span>
                    </div>
                    <Progress 
                      value={((advisor.dailyStats.workingTime - advisor.dailyStats.talkTime - advisor.dailyStats.pauseTime) / advisor.dailyStats.workingTime) * 100} 
                      className="h-3" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Gráfico de rendimiento semanal */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Performance (Últimos 7 días)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={advisor.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#3b82f6" name="Llamadas" />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" name="Conversiones" />
                    <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" name="Eficiencia %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métricas comparativas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Semana Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Llamadas:</span>
                      <span className="font-bold">{advisor.weeklyStats.calls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversiones:</span>
                      <span className="font-bold">{advisor.weeklyStats.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ingresos:</span>
                      <span className="font-bold">{formatCurrency(advisor.weeklyStats.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="font-bold">{advisor.weeklyStats.avgPerformance}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mes Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Llamadas:</span>
                      <span className="font-bold">{advisor.monthlyStats.calls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversiones:</span>
                      <span className="font-bold">{advisor.monthlyStats.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ingresos:</span>
                      <span className="font-bold">{formatCurrency(advisor.monthlyStats.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ranking:</span>
                      <span className="font-bold">#{advisor.monthlyStats.ranking}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Promedios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Llamadas/día:</span>
                      <span className="font-bold">{(advisor.monthlyStats.calls / 20).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversiones/día:</span>
                      <span className="font-bold">{(advisor.monthlyStats.conversions / 20).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duración promedio:</span>
                      <span className="font-bold">{Math.floor(advisor.dailyStats.avgCallDuration / 60)}:{(advisor.dailyStats.avgCallDuration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa conversión:</span>
                      <span className="font-bold">{((advisor.monthlyStats.conversions / advisor.monthlyStats.calls) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {/* Metas y cumplimiento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Meta de Llamadas Diarias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{advisor.dailyStats.calls}</div>
                      <div className="text-sm text-gray-600">de {advisor.goals.dailyCalls} meta</div>
                    </div>
                    <Progress value={(advisor.dailyStats.calls / advisor.goals.dailyCalls) * 100} className="h-3" />
                    <div className="text-center">
                      <span className={`text-lg font-bold ${advisor.dailyStats.calls >= advisor.goals.dailyCalls ? 'text-green-600' : 'text-yellow-600'}`}>
                        {((advisor.dailyStats.calls / advisor.goals.dailyCalls) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Meta de Conversiones Diarias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{advisor.dailyStats.conversions}</div>
                      <div className="text-sm text-gray-600">de {advisor.goals.dailyConversions} meta</div>
                    </div>
                    <Progress value={(advisor.dailyStats.conversions / advisor.goals.dailyConversions) * 100} className="h-3" />
                    <div className="text-center">
                      <span className={`text-lg font-bold ${advisor.dailyStats.conversions >= advisor.goals.dailyConversions ? 'text-green-600' : 'text-yellow-600'}`}>
                        {((advisor.dailyStats.conversions / advisor.goals.dailyConversions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Meta de Ingresos Mensuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(advisor.monthlyStats.revenue)}</div>
                      <div className="text-sm text-gray-600">de {formatCurrency(advisor.goals.monthlyRevenue)} meta</div>
                    </div>
                    <Progress value={(advisor.monthlyStats.revenue / advisor.goals.monthlyRevenue) * 100} className="h-3" />
                    <div className="text-center">
                      <span className={`text-lg font-bold ${advisor.monthlyStats.revenue >= advisor.goals.monthlyRevenue ? 'text-green-600' : 'text-yellow-600'}`}>
                        {((advisor.monthlyStats.revenue / advisor.goals.monthlyRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progreso mensual detallado */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso Mensual Detallado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Llamadas vs Meta</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Realizadas:</span>
                        <span>{advisor.monthlyStats.calls}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meta (20 días):</span>
                        <span>{advisor.goals.dailyCalls * 20}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Promedio diario:</span>
                        <span>{(advisor.monthlyStats.calls / 20).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Diferencia:</span>
                        <span className={advisor.monthlyStats.calls >= (advisor.goals.dailyCalls * 20) ? 'text-green-600' : 'text-red-600'}>
                          {advisor.monthlyStats.calls - (advisor.goals.dailyCalls * 20) > 0 ? '+' : ''}
                          {advisor.monthlyStats.calls - (advisor.goals.dailyCalls * 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Conversiones vs Meta</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Realizadas:</span>
                        <span>{advisor.monthlyStats.conversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meta (20 días):</span>
                        <span>{advisor.goals.dailyConversions * 20}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Promedio diario:</span>
                        <span>{(advisor.monthlyStats.conversions / 20).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Diferencia:</span>
                        <span className={advisor.monthlyStats.conversions >= (advisor.goals.dailyConversions * 20) ? 'text-green-600' : 'text-red-600'}>
                          {advisor.monthlyStats.conversions - (advisor.goals.dailyConversions * 20) > 0 ? '+' : ''}
                          {advisor.monthlyStats.conversions - (advisor.goals.dailyConversions * 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* Radar chart de habilidades */}
            <Card>
              <CardHeader>
                <CardTitle>Perfil de Habilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={advisor.skills}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Nivel" dataKey="level" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Desglose de habilidades */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluación Detallada de Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisor.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-3" />
                      <div className="mt-1 text-xs text-gray-500">
                        {skill.level >= 90 ? 'Excelente' : 
                         skill.level >= 80 ? 'Muy Bueno' : 
                         skill.level >= 70 ? 'Bueno' : 
                         skill.level >= 60 ? 'Regular' : 'Necesita Mejora'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones de mejora */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Desarrollo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {advisor.skills
                    .filter(skill => skill.level < 90)
                    .sort((a, b) => a.level - b.level)
                    .slice(0, 3)
                    .map((skill, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800">{skill.name}</h4>
                        <p className="text-sm text-yellow-700">
                          Nivel actual: {skill.level}% - Se recomienda capacitación adicional para alcanzar el nivel óptimo.
                        </p>
                      </div>
                    ))}
                  {advisor.skills.every(skill => skill.level >= 90) && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">¡Excelente Performance!</h4>
                      <p className="text-sm text-green-700">
                        Todas las habilidades están en nivel óptimo. Continúa manteniendo este estándar.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Gráfico histórico detallado */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={advisor.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calls" fill="#3b82f6" name="Llamadas" />
                    <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabla de historial */}
            <Card>
              <CardHeader>
                <CardTitle>Detalle Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-center p-2">Llamadas</th>
                        <th className="text-center p-2">Conversiones</th>
                        <th className="text-center p-2">Tasa Conversión</th>
                        <th className="text-center p-2">Eficiencia</th>
                        <th className="text-center p-2">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advisor.performanceHistory.map((day, index) => {
                        const conversionRate = (day.conversions / day.calls * 100).toFixed(1);
                        const previousDay = advisor.performanceHistory[index - 1];
                        const trend = previousDay ? day.efficiency - previousDay.efficiency : 0;
                        
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">{new Date(day.date).toLocaleDateString('es-ES')}</td>
                            <td className="text-center p-2">{day.calls}</td>
                            <td className="text-center p-2">{day.conversions}</td>
                            <td className="text-center p-2">{conversionRate}%</td>
                            <td className="text-center p-2">
                              <span className={`font-medium ${day.efficiency >= 90 ? 'text-green-600' : day.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {day.efficiency}%
                              </span>
                            </td>
                            <td className="text-center p-2">
                              {trend !== 0 && (
                                <span className={`flex items-center justify-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                  {Math.abs(trend).toFixed(1)}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvisorPerformance;
