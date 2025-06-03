
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Phone, 
  Users, 
  Target, 
  Clock,
  Star,
  Award,
  Calendar,
  BarChart3,
  DollarSign,
  CheckCircle
} from 'lucide-react';

const AdvisorPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Datos de rendimiento simulados
  const performanceData = {
    overall: {
      score: 89,
      rank: 3,
      totalAdvisors: 12,
      trend: 'up'
    },
    metrics: {
      callsToday: 23,
      callsMonth: 156,
      contactRate: 89,
      conversionRate: 14,
      avgCallDuration: 245,
      leadsAssigned: 47,
      leadsConverted: 8,
      revenue: 4800000
    },
    goals: {
      callsDaily: { current: 23, target: 25, percentage: 92 },
      contactRate: { current: 89, target: 85, percentage: 105 },
      conversions: { current: 8, target: 10, percentage: 80 },
      revenue: { current: 4800000, target: 6000000, percentage: 80 }
    },
    weekly: [
      { week: 'Sem 1', calls: 42, conversions: 3, revenue: 1200000 },
      { week: 'Sem 2', calls: 38, conversions: 2, revenue: 800000 },
      { week: 'Sem 3', calls: 45, conversions: 4, revenue: 1600000 },
      { week: 'Sem 4', calls: 31, conversions: 1, revenue: 400000 }
    ],
    achievements: [
      { id: 1, title: 'Top Performer', description: 'Entre los 3 mejores del mes', icon: Award, color: 'text-yellow-600' },
      { id: 2, title: 'Call Master', description: 'Más de 150 llamadas este mes', icon: Phone, color: 'text-blue-600' },
      { id: 3, title: 'Conversion Expert', description: 'Tasa de conversión >15%', icon: Target, color: 'text-green-600' }
    ]
  };

  const getGoalColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGoalBg = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-100';
    if (percentage >= 80) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Rendimiento</h1>
          <p className="text-gray-600">Métricas y estadísticas de tu desempeño</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Score general y ranking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-4xl font-bold text-blue-600">{performanceData.overall.score}</div>
              <div className="text-sm text-gray-600">Score General</div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="bg-blue-500">
                Puesto #{performanceData.overall.rank} de {performanceData.overall.totalAdvisors}
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-1">
              {performanceData.overall.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Logros Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceData.achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className={`h-8 w-8 ${achievement.color}`} />
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Métricas Clave</TabsTrigger>
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Llamadas Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceData.metrics.callsToday}</p>
                  </div>
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa de Contacto</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceData.metrics.contactRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversiones</p>
                    <p className="text-2xl font-bold text-gray-900">{performanceData.metrics.leadsConverted}</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(performanceData.metrics.revenue)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas detalladas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total de Llamadas</span>
                  <span className="font-bold">{performanceData.metrics.callsMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Leads Asignados</span>
                  <span className="font-bold">{performanceData.metrics.leadsAssigned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tasa de Conversión</span>
                  <span className="font-bold">{performanceData.metrics.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Duración Promedio</span>
                  <span className="font-bold">
                    {Math.floor(performanceData.metrics.avgCallDuration / 60)}:
                    {(performanceData.metrics.avgCallDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Tiempo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Llamadas</span>
                    <span className="text-sm">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Follow-up</span>
                    <span className="text-sm">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Administrativo</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Objetivos y metas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(performanceData.goals).map(([key, goal]) => (
              <Card key={key}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">
                        {key === 'callsDaily' ? 'Llamadas Diarias' :
                         key === 'contactRate' ? 'Tasa de Contacto' :
                         key === 'conversions' ? 'Conversiones' :
                         'Ingresos'}
                      </h3>
                      <Badge className={getGoalColor(goal.percentage) === 'text-green-600' ? 'bg-green-500' :
                                      getGoalColor(goal.percentage) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}>
                        {goal.percentage}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Actual: {key === 'revenue' ? formatCurrency(goal.current) : goal.current}</span>
                        <span>Meta: {key === 'revenue' ? formatCurrency(goal.target) : goal.target}</span>
                      </div>
                      <Progress value={goal.percentage} className="h-3" />
                    </div>

                    <div className={`p-3 rounded-lg ${getGoalBg(goal.percentage)}`}>
                      <p className={`text-sm font-medium ${getGoalColor(goal.percentage)}`}>
                        {goal.percentage >= 100 ? '🎉 ¡Meta alcanzada!' :
                         goal.percentage >= 80 ? '⚡ Cerca de la meta' :
                         '📈 Necesitas esfuerzo extra'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Tendencias semanales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rendimiento Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.weekly.map((week, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="text-center">
                      <div className="font-bold">{week.week}</div>
                      <div className="text-sm text-gray-600">Semana</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{week.calls}</div>
                      <div className="text-sm text-gray-600">Llamadas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{week.conversions}</div>
                      <div className="text-sm text-gray-600">Conversiones</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{formatCurrency(week.revenue)}</div>
                      <div className="text-sm text-gray-600">Ingresos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comparación mensual */}
          <Card>
            <CardHeader>
              <CardTitle>Comparación con Promedio del Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Mis Llamadas</div>
                  <div className="text-xs text-green-600">+12% vs promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Mi Tasa de Contacto</div>
                  <div className="text-xs text-green-600">+5% vs promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">14%</div>
                  <div className="text-sm text-gray-600">Mi Conversión</div>
                  <div className="text-xs text-red-600">-2% vs promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvisorPerformance;
