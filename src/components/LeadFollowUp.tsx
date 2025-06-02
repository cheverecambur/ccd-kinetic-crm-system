
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Star,
  Target,
  TrendingUp,
  Activity,
  Bell
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FollowUpTask {
  id: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'proposal';
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
  result?: string;
  nextAction?: string;
}

interface LeadObservation {
  id: string;
  date: string;
  author: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note' | 'system';
  content: string;
  isPrivate: boolean;
  attachments?: string[];
  leadScore?: number;
  tags?: string[];
}

interface LeadStage {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  actions: string[];
  averageTime: number; // días promedio en esta etapa
}

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  content: string;
  type: string;
  author?: string;
  isPrivate?: boolean;
  tags?: string[];
  result?: string;
}

const LeadFollowUp = ({ leadId = 1, leadData = { name: 'Lead Ejemplo' } }: { leadId?: number; leadData?: any }) => {
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [observations, setObservations] = useState<LeadObservation[]>([]);
  const [currentStage, setCurrentStage] = useState<string>('prospecting');
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newObservationOpen, setNewObservationOpen] = useState(false);
  const { toast } = useToast();

  // Definición de etapas del lead
  const leadStages: LeadStage[] = [
    {
      id: 'prospecting',
      name: 'Prospección',
      description: 'Lead recién capturado, primer contacto',
      color: 'bg-gray-100 text-gray-800',
      order: 1,
      actions: ['Llamada inicial', 'Envío de información', 'Calificación'],
      averageTime: 2
    },
    {
      id: 'contacted',
      name: 'Contactado',
      description: 'Se logró contacto exitoso con el lead',
      color: 'bg-blue-100 text-blue-800',
      order: 2,
      actions: ['Identificar necesidades', 'Presentar soluciones', 'Agendar demo'],
      averageTime: 5
    },
    {
      id: 'qualified',
      name: 'Calificado',
      description: 'Lead muestra interés y tiene presupuesto',
      color: 'bg-yellow-100 text-yellow-800',
      order: 3,
      actions: ['Demo personalizada', 'Elaborar propuesta', 'Negociación'],
      averageTime: 7
    },
    {
      id: 'proposal',
      name: 'Propuesta',
      description: 'Propuesta enviada, en proceso de decisión',
      color: 'bg-purple-100 text-purple-800',
      order: 4,
      actions: ['Seguimiento propuesta', 'Resolver objeciones', 'Cierre'],
      averageTime: 5
    },
    {
      id: 'negotiation',
      name: 'Negociación',
      description: 'En proceso de negociación y cierre',
      color: 'bg-orange-100 text-orange-800',
      order: 5,
      actions: ['Ajustar propuesta', 'Resolver dudas', 'Firmar contrato'],
      averageTime: 3
    },
    {
      id: 'closed_won',
      name: 'Cerrado Ganado',
      description: 'Lead convertido exitosamente',
      color: 'bg-green-100 text-green-800',
      order: 6,
      actions: ['Onboarding', 'Seguimiento satisfacción'],
      averageTime: 0
    },
    {
      id: 'closed_lost',
      name: 'Cerrado Perdido',
      description: 'Lead no convertido',
      color: 'bg-red-100 text-red-800',
      order: 6,
      actions: ['Análisis pérdida', 'Futuro seguimiento'],
      averageTime: 0
    }
  ];

  // Datos simulados
  useEffect(() => {
    setTasks([
      {
        id: '1',
        type: 'call',
        title: 'Llamada de seguimiento',
        description: 'Contactar para conocer decisión sobre propuesta enviada',
        dueDate: '2024-01-26',
        dueTime: '10:00',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Carlos Rodríguez',
        createdAt: '2024-01-24T10:00:00Z'
      },
      {
        id: '2',
        type: 'email',
        title: 'Enviar información adicional',
        description: 'Enviar brochure del curso de Excel Avanzado solicitado',
        dueDate: '2024-01-25',
        dueTime: '14:00',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'Carlos Rodríguez',
        createdAt: '2024-01-23T15:00:00Z',
        completedAt: '2024-01-25T13:45:00Z',
        result: 'Información enviada correctamente, lead confirmó recepción'
      }
    ]);

    setObservations([
      {
        id: '1',
        date: '2024-01-26T09:30:00Z',
        author: 'Carlos Rodríguez',
        type: 'call',
        content: 'Llamada exitosa. Lead muy interesado en curso de Excel. Trabaja en contabilidad y necesita certificación. Presupuesto disponible. Solicitó información sobre modalidades de pago.',
        isPrivate: false,
        leadScore: 85,
        tags: ['interesado', 'presupuesto-ok', 'excel']
      },
      {
        id: '2',
        date: '2024-01-25T14:20:00Z',
        author: 'Sistema',
        type: 'system',
        content: 'Lead score actualizado de 70 a 85 puntos debido a interacción positiva',
        isPrivate: false
      },
      {
        id: '3',
        date: '2024-01-24T16:15:00Z',
        author: 'María González',
        type: 'note',
        content: 'NOTA INTERNA: Lead contactado por primera vez. Mostró interés inicial pero necesita más información. Recomendar llamada de seguimiento.',
        isPrivate: true,
        tags: ['primer-contacto', 'seguimiento-requerido']
      }
    ]);

    setCurrentStage('qualified');
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4 text-yellow-600" />,
      completed: <CheckCircle className="h-4 w-4 text-green-600" />,
      overdue: <AlertTriangle className="h-4 w-4 text-red-600" />,
      cancelled: <XCircle className="h-4 w-4 text-gray-600" />
    };
    return icons[status as keyof typeof icons] || null;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      call: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      whatsapp: <MessageSquare className="h-4 w-4" />,
      meeting: <Calendar className="h-4 w-4" />,
      proposal: <FileText className="h-4 w-4" />,
      note: <FileText className="h-4 w-4" />,
      system: <Activity className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string, dueTime: string) => {
    const due = new Date(`${dueDate}T${dueTime}`);
    return due < new Date();
  };

  const addNewTask = () => {
    setNewTaskOpen(true);
  };

  const addNewObservation = () => {
    setNewObservationOpen(true);
  };

  const moveToNextStage = () => {
    const currentStageData = leadStages.find(s => s.id === currentStage);
    if (currentStageData) {
      const nextStageIndex = leadStages.findIndex(s => s.order === currentStageData.order + 1);
      if (nextStageIndex !== -1) {
        setCurrentStage(leadStages[nextStageIndex].id);
        toast({
          title: "Etapa actualizada",
          description: `Lead movido a etapa: ${leadStages[nextStageIndex].name}`,
        });
      }
    }
  };

  const currentStageData = leadStages.find(s => s.id === currentStage);
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const overdueTasks = tasks.filter(t => t.status === 'pending' && isOverdue(t.dueDate, t.dueTime));

  // Crear timeline unificado
  const createTimelineItems = (): TimelineItem[] => {
    const timelineItems: TimelineItem[] = [];

    // Agregar observaciones
    observations.forEach(obs => {
      timelineItems.push({
        id: `obs-${obs.id}`,
        date: obs.date,
        title: obs.author,
        content: obs.content,
        type: obs.type,
        author: obs.author,
        isPrivate: obs.isPrivate,
        tags: obs.tags
      });
    });

    // Agregar tareas completadas
    tasks.filter(t => t.status === 'completed' && t.completedAt).forEach(task => {
      timelineItems.push({
        id: `task-${task.id}`,
        date: task.completedAt!,
        title: task.title,
        content: task.description,
        type: task.type,
        result: task.result
      });
    });

    // Ordenar por fecha descendente
    return timelineItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const timelineItems = createTimelineItems();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Seguimiento de Lead #{leadId}</h1>
          <p className="text-gray-600">{leadData?.name || 'Lead'} - Gestión completa de seguimiento</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addNewTask}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
          <Button variant="outline" onClick={addNewObservation}>
            <Plus className="h-4 w-4 mr-2" />
            Observación
          </Button>
        </div>
      </div>

      {/* Estado actual y pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pipeline de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-2 mb-6">
            {leadStages.filter(s => s.id !== 'closed_lost').map((stage, index) => (
              <div
                key={stage.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  currentStage === stage.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : stage.order < (currentStageData?.order || 0)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => setCurrentStage(stage.id)}
              >
                <div className="text-center">
                  <Badge className={stage.color} variant="secondary">
                    {stage.name}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{stage.averageTime} días prom.</p>
                </div>
                {index < leadStages.length - 2 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>

          {currentStageData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Etapa Actual: {currentStageData.name}</h4>
              <p className="text-sm text-blue-700 mb-3">{currentStageData.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm font-medium text-blue-800">Acciones recomendadas:</span>
                {currentStageData.actions.map((action, index) => (
                  <Badge key={index} variant="outline" className="text-blue-700">
                    {action}
                  </Badge>
                ))}
              </div>
              {currentStageData.id !== 'closed_won' && (
                <Button size="sm" onClick={moveToNextStage}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Avanzar a Siguiente Etapa
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas y resumen */}
      {(overdueTasks.length > 0 || pendingTasks.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overdueTasks.length > 0 && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Tareas Vencidas</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
                <p className="text-sm text-red-500">Requieren atención inmediata</p>
              </CardContent>
            </Card>
          )}
          
          <Card className="border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Tareas Pendientes</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</p>
              <p className="text-sm text-yellow-500">En cola de seguimiento</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">
            Tareas ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="timeline">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="observations">
            Observaciones ({observations.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Lista de tareas */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className={task.status === 'overdue' ? 'border-red-200' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getTypeIcon(task.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)} variant="secondary">
                            {task.priority.toUpperCase()}
                          </Badge>
                          {getStatusIcon(task.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Vence: {formatDate(`${task.dueDate}T${task.dueTime}`)}</span>
                          <span>Asignado a: {task.assignedTo}</span>
                          {task.completedAt && (
                            <span>Completado: {formatDate(task.completedAt)}</span>
                          )}
                        </div>
                        {task.result && (
                          <div className="mt-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                            <p className="text-sm text-green-700">{task.result}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulario nueva tarea */}
          {newTaskOpen && (
            <Card>
              <CardHeader>
                <CardTitle>Nueva Tarea de Seguimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Tarea</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Llamada</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="meeting">Reunión</SelectItem>
                        <SelectItem value="proposal">Propuesta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prioridad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Título de la Tarea</Label>
                  <Input placeholder="Describir la tarea..." />
                </div>

                <div>
                  <Label>Descripción Detallada</Label>
                  <Textarea placeholder="Detalles específicos de la tarea..." rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de Vencimiento</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <Input type="time" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Crear Tarea
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {/* Timeline integrado */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Interacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.date)}
                        </span>
                        {item.isPrivate && (
                          <Badge variant="outline" className="text-xs">Privado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{item.content}</p>
                      {item.result && (
                        <p className="text-sm text-green-600 mt-1">Resultado: {item.result}</p>
                      )}
                      {item.tags && (
                        <div className="flex gap-1 mt-2">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observations" className="space-y-6">
          {/* Lista de observaciones */}
          <div className="space-y-4">
            {observations.map((obs) => (
              <Card key={obs.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {obs.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{obs.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(obs.date)}</span>
                        {getTypeIcon(obs.type)}
                        {obs.isPrivate && (
                          <Badge variant="outline" className="text-xs">Nota Privada</Badge>
                        )}
                        {obs.leadScore && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Score: {obs.leadScore}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{obs.content}</p>
                      {obs.tags && (
                        <div className="flex gap-1">
                          {obs.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Formulario nueva observación */}
          {newObservationOpen && (
            <Card>
              <CardHeader>
                <CardTitle>Nueva Observación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Observación</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Llamada</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="meeting">Reunión</SelectItem>
                        <SelectItem value="note">Nota General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="private" />
                    <Label htmlFor="private">Observación privada</Label>
                  </div>
                </div>
                
                <div>
                  <Label>Contenido de la Observación</Label>
                  <Textarea placeholder="Describe la interacción, información relevante, próximos pasos..." rows={4} />
                </div>

                <div>
                  <Label>Tags (separados por coma)</Label>
                  <Input placeholder="interesado, seguimiento, presupuesto-ok..." />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewObservationOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Guardar Observación
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics del lead */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Score del Lead</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">85</p>
                <p className="text-sm text-gray-600">Muy alta probabilidad</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Tiempo en Pipeline</span>
                </div>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-600">días en proceso</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Interacciones</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{observations.length + tasks.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-gray-600">contactos totales</p>
              </CardContent>
            </Card>
          </div>

          {/* Progreso por etapa */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso en el Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadStages.filter(s => s.id !== 'closed_lost').map((stage, index) => {
                  const isCompleted = stage.order < (currentStageData?.order || 0);
                  const isCurrent = stage.id === currentStage;
                  
                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{stage.name}</h4>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {stage.averageTime} días prom.
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Métricas de engagement */}
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Por Canal de Comunicación</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Llamadas:</span>
                      <span className="font-medium">{observations.filter(o => o.type === 'call').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emails:</span>
                      <span className="font-medium">{observations.filter(o => o.type === 'email').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WhatsApp:</span>
                      <span className="font-medium">{observations.filter(o => o.type === 'whatsapp').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reuniones:</span>
                      <span className="font-medium">{observations.filter(o => o.type === 'meeting').length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Actividad Reciente</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Última interacción:</span>
                      <span className="font-medium">Hoy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frecuencia contacto:</span>
                      <span className="font-medium">Alta</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Respuesta promedio:</span>
                      <span className="font-medium">2 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de respuesta:</span>
                      <span className="font-medium">85%</span>
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

export default LeadFollowUp;
