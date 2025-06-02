
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search,
  TrendingDown,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';

interface CauseAnalysis {
  id: string;
  advisor: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  variance: number;
  category: 'conversion' | 'quality' | 'time' | 'attitude';
  rootCauses: {
    cause: string;
    impact: 'high' | 'medium' | 'low';
    frequency: number;
  }[];
  actionPlan: {
    action: string;
    responsible: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'high' | 'medium' | 'low';
  }[];
  dateIdentified: Date;
  status: 'identified' | 'analyzing' | 'action_plan' | 'monitoring' | 'resolved';
}

const CauseAnalysis = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<CauseAnalysis | null>(null);

  const analyses: CauseAnalysis[] = [
    {
      id: '1',
      advisor: 'Carlos Rodríguez',
      metric: 'Tasa de Conversión',
      currentValue: 12,
      targetValue: 20,
      variance: -40,
      category: 'conversion',
      rootCauses: [
        { cause: 'Falta de conocimiento técnico del producto', impact: 'high', frequency: 8 },
        { cause: 'Objeciones no manejadas correctamente', impact: 'medium', frequency: 6 },
        { cause: 'Llamadas muy cortas, no construye rapport', impact: 'medium', frequency: 5 }
      ],
      actionPlan: [
        {
          action: 'Capacitación intensiva en productos técnicos',
          responsible: 'Gerente de Capacitación',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'in_progress',
          priority: 'high'
        },
        {
          action: 'Coaching individual en manejo de objeciones',
          responsible: 'Supervisor Directo',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: 'pending',
          priority: 'high'
        },
        {
          action: 'Establecer tiempo mínimo de llamada de 6 minutos',
          responsible: 'Supervisor Directo',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          status: 'completed',
          priority: 'medium'
        }
      ],
      dateIdentified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'action_plan'
    },
    {
      id: '2',
      advisor: 'María González',
      metric: 'Calidad de Llamadas',
      currentValue: 75,
      targetValue: 90,
      variance: -16.7,
      category: 'quality',
      rootCauses: [
        { cause: 'Técnicas de cierre deficientes', impact: 'high', frequency: 7 },
        { cause: 'No confirma información del cliente', impact: 'medium', frequency: 4 },
        { cause: 'Interrumpe frecuentemente al cliente', impact: 'low', frequency: 3 }
      ],
      actionPlan: [
        {
          action: 'Entrenamiento en técnicas de cierre consultivo',
          responsible: 'Coach de Ventas',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'pending',
          priority: 'high'
        },
        {
          action: 'Role playing con casos reales',
          responsible: 'Supervisor Directo',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: 'pending',
          priority: 'medium'
        }
      ],
      dateIdentified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'analyzing'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      identified: 'bg-blue-500',
      analyzing: 'bg-yellow-500',
      action_plan: 'bg-orange-500',
      monitoring: 'bg-purple-500',
      resolved: 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts = {
      identified: 'Identificado',
      analyzing: 'Analizando',
      action_plan: 'Plan de Acción',
      monitoring: 'Monitoreando',
      resolved: 'Resuelto'
    };
    return texts[status as keyof typeof texts] || 'Desconocido';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[impact as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Resumen de análisis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Activos</p>
                <p className="text-2xl font-bold">{analyses.filter(a => a.status !== 'resolved').length}</p>
              </div>
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Plan de Acción</p>
                <p className="text-2xl font-bold">{analyses.filter(a => a.status === 'action_plan').length}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monitoreando</p>
                <p className="text-2xl font-bold">{analyses.filter(a => a.status === 'monitoring').length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resueltos</p>
                <p className="text-2xl font-bold">{analyses.filter(a => a.status === 'resolved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de análisis de causas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análisis de Causas Raíz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{analysis.advisor}</span>
                      </div>
                      <div className="text-sm text-gray-600">{analysis.metric}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 font-medium">{analysis.variance}%</span>
                      <span className="text-sm text-gray-600">
                        ({analysis.currentValue} vs {analysis.targetValue})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(analysis.status)}>
                      {getStatusText(analysis.status)}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          Ver Detalle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Análisis Detallado - {selectedAnalysis?.advisor}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedAnalysis && (
                          <div className="space-y-6">
                            {/* Información general */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Información del Caso</h4>
                                <div className="space-y-1 text-sm">
                                  <div><span className="font-medium">Métrica afectada:</span> {selectedAnalysis.metric}</div>
                                  <div><span className="font-medium">Valor actual:</span> {selectedAnalysis.currentValue}{selectedAnalysis.category === 'conversion' || selectedAnalysis.category === 'quality' ? '%' : ''}</div>
                                  <div><span className="font-medium">Objetivo:</span> {selectedAnalysis.targetValue}{selectedAnalysis.category === 'conversion' || selectedAnalysis.category === 'quality' ? '%' : ''}</div>
                                  <div><span className="font-medium">Variación:</span> <span className="text-red-600">{selectedAnalysis.variance}%</span></div>
                                  <div><span className="font-medium">Fecha identificación:</span> {selectedAnalysis.dateIdentified.toLocaleDateString()}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Estado del Análisis</h4>
                                <Badge className={`${getStatusColor(selectedAnalysis.status)} mb-2`}>
                                  {getStatusText(selectedAnalysis.status)}
                                </Badge>
                                <Progress 
                                  value={
                                    selectedAnalysis.status === 'identified' ? 20 :
                                    selectedAnalysis.status === 'analyzing' ? 40 :
                                    selectedAnalysis.status === 'action_plan' ? 60 :
                                    selectedAnalysis.status === 'monitoring' ? 80 : 100
                                  } 
                                  className="h-2 mb-2" 
                                />
                                <div className="text-sm text-gray-600">
                                  Progreso del caso
                                </div>
                              </div>
                            </div>

                            {/* Causas raíz */}
                            <div>
                              <h4 className="font-medium mb-4">Causas Raíz Identificadas</h4>
                              <div className="space-y-3">
                                {selectedAnalysis.rootCauses.map((cause, index) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">{cause.cause}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge className={getPriorityColor(cause.impact)}>
                                          {cause.impact === 'high' ? 'Alto Impacto' : 
                                           cause.impact === 'medium' ? 'Medio Impacto' : 'Bajo Impacto'}
                                        </Badge>
                                        <span className="text-sm text-gray-600">
                                          Frecuencia: {cause.frequency}/10
                                        </span>
                                      </div>
                                    </div>
                                    <Progress value={cause.frequency * 10} className="h-2" />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Plan de acción */}
                            <div>
                              <h4 className="font-medium mb-4">Plan de Acción</h4>
                              <div className="space-y-3">
                                {selectedAnalysis.actionPlan.map((action, index) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="font-medium mb-1">{action.action}</div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <div className="flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            Responsable: {action.responsible}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            Fecha límite: {action.dueDate.toLocaleDateString()}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <Badge className={getPriorityColor(action.priority)}>
                                          {action.priority === 'high' ? 'Alta' : 
                                           action.priority === 'medium' ? 'Media' : 'Baja'}
                                        </Badge>
                                        <Badge className={
                                          action.status === 'completed' ? 'bg-green-500' :
                                          action.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                                        }>
                                          {action.status === 'completed' ? 'Completada' :
                                           action.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Seguimiento */}
                            <div>
                              <h4 className="font-medium mb-2">Notas de Seguimiento</h4>
                              <Textarea 
                                placeholder="Agregar notas de seguimiento..."
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end mt-2">
                                <Button size="sm">Guardar Nota</Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Preview de causas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Principales Causas</h5>
                    <div className="space-y-1">
                      {analysis.rootCauses.slice(0, 2).map((cause, index) => (
                        <div key={index} className="text-sm flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            cause.impact === 'high' ? 'bg-red-500' : 
                            cause.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <span className="truncate">{cause.cause}</span>
                        </div>
                      ))}
                      {analysis.rootCauses.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{analysis.rootCauses.length - 2} causas más
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Acciones Pendientes</h5>
                    <div className="space-y-1">
                      {analysis.actionPlan.filter(a => a.status !== 'completed').slice(0, 2).map((action, index) => (
                        <div key={index} className="text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="truncate">{action.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CauseAnalysis;
