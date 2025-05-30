
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  MapPin,
  Mail,
  Building,
  GraduationCap,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PhoneCall,
  Save,
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Disposition {
  code: string;
  name: string;
  category: string;
  color: string;
  requiresCallback: boolean;
  requiresComment: boolean;
  nextAction: string;
  points: number;
}

interface CallbackSchedule {
  date: string;
  time: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

interface LeadTypificationData {
  leadId: number;
  callId: string;
  disposition: string;
  subDisposition?: string;
  comments: string;
  callback?: CallbackSchedule;
  nextContactDate?: string;
  contactAttempts: number;
  callDuration: number;
  callQuality: number;
  callResult: string;
  additionalInfo: {
    budget: string;
    timeframe: string;
    decisionMaker: boolean;
    courseInterest: string;
    competitorMention: string;
    objections: string[];
  };
}

const LeadTypification = ({ leadId, callData, onSave, onCancel }: {
  leadId: number;
  callData: any;
  onSave: (data: LeadTypificationData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<LeadTypificationData>({
    leadId,
    callId: callData?.id || '',
    disposition: '',
    comments: '',
    contactAttempts: callData?.contactAttempts || 1,
    callDuration: callData?.duration || 0,
    callQuality: 3,
    callResult: '',
    additionalInfo: {
      budget: '',
      timeframe: '',
      decisionMaker: false,
      courseInterest: '',
      competitorMention: '',
      objections: []
    }
  });

  const [showCallback, setShowCallback] = useState(false);
  const [selectedObjections, setSelectedObjections] = useState<string[]>([]);
  const { toast } = useToast();

  // Tipificaciones disponibles
  const dispositions: Disposition[] = [
    {
      code: 'CONTACT',
      name: 'Contactado',
      category: 'SUCCESS',
      color: 'bg-green-100 text-green-800',
      requiresCallback: false,
      requiresComment: true,
      nextAction: 'Seguimiento comercial',
      points: 10
    },
    {
      code: 'INTERESTED',
      name: 'Interesado',
      category: 'SUCCESS',
      color: 'bg-blue-100 text-blue-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Agendar presentación',
      points: 15
    },
    {
      code: 'VERY_INTERESTED',
      name: 'Muy Interesado',
      category: 'SUCCESS',
      color: 'bg-purple-100 text-purple-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Enviar propuesta',
      points: 20
    },
    {
      code: 'SALE',
      name: 'Venta Realizada',
      category: 'SALE',
      color: 'bg-green-200 text-green-900',
      requiresCallback: false,
      requiresComment: true,
      nextAction: 'Proceso de matrícula',
      points: 50
    },
    {
      code: 'NA',
      name: 'No Contesta',
      category: 'NO_CONTACT',
      color: 'bg-gray-100 text-gray-800',
      requiresCallback: true,
      requiresComment: false,
      nextAction: 'Reintentar llamada',
      points: 1
    },
    {
      code: 'BUSY',
      name: 'Ocupado',
      category: 'NO_CONTACT',
      color: 'bg-yellow-100 text-yellow-800',
      requiresCallback: true,
      requiresComment: false,
      nextAction: 'Reintentar en 2 horas',
      points: 1
    },
    {
      code: 'ANSWM',
      name: 'Contestadora',
      category: 'NO_CONTACT',
      color: 'bg-orange-100 text-orange-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Llamar nuevamente',
      points: 2
    },
    {
      code: 'CALLBACK',
      name: 'Callback Solicitado',
      category: 'CALLBACK',
      color: 'bg-blue-100 text-blue-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Llamar en fecha acordada',
      points: 8
    },
    {
      code: 'NI',
      name: 'No Interesado',
      category: 'NO_SALE',
      color: 'bg-red-100 text-red-800',
      requiresCallback: false,
      requiresComment: true,
      nextAction: 'Marcar como no prospecto',
      points: 3
    },
    {
      code: 'NO_BUDGET',
      name: 'Sin Presupuesto',
      category: 'NO_SALE',
      color: 'bg-red-100 text-red-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Callback en 3 meses',
      points: 5
    },
    {
      code: 'NO_TIME',
      name: 'Sin Tiempo',
      category: 'NO_SALE',
      color: 'bg-orange-100 text-orange-800',
      requiresCallback: true,
      requiresComment: true,
      nextAction: 'Callback en 1 mes',
      points: 4
    },
    {
      code: 'COMPETITOR',
      name: 'Ya estudió con competencia',
      category: 'NO_SALE',
      color: 'bg-purple-100 text-purple-800',
      requiresCallback: false,
      requiresComment: true,
      nextAction: 'Análisis competencia',
      points: 6
    },
    {
      code: 'DNC',
      name: 'No Molestar',
      category: 'DNC',
      color: 'bg-black text-white',
      requiresCallback: false,
      requiresComment: true,
      nextAction: 'Agregar a lista negra',
      points: 0
    },
    {
      code: 'WRONG',
      name: 'Número Equivocado',
      category: 'INVALID',
      color: 'bg-gray-100 text-gray-800',
      requiresCallback: false,
      requiresComment: false,
      nextAction: 'Actualizar datos',
      points: 0
    },
    {
      code: 'DC',
      name: 'Desconectado',
      category: 'INVALID',
      color: 'bg-gray-100 text-gray-800',
      requiresCallback: false,
      requiresComment: false,
      nextAction: 'Verificar número',
      points: 0
    }
  ];

  const subDispositions = {
    'INTERESTED': [
      'Quiere información adicional',
      'Consultará con familia',
      'Evaluando opciones',
      'Interesado en modalidad virtual',
      'Interesado en modalidad presencial'
    ],
    'NO_BUDGET': [
      'Muy costoso',
      'Buscando opciones más económicas',
      'Esperando bonificación',
      'Problemas económicos actuales'
    ],
    'NO_TIME': [
      'Muy ocupado en el trabajo',
      'Compromisos familiares',
      'Estudiando otras materias',
      'Viajando próximamente'
    ]
  };

  const objectionsList = [
    'Precio muy alto',
    'No tengo tiempo',
    'Ya estudié algo similar',
    'No es el momento',
    'Debo consultar',
    'No confío en educación virtual',
    'Prefiero presencial',
    'No veo el valor',
    'Hay opciones más baratas',
    'No tengo computador'
  ];

  const selectedDisposition = dispositions.find(d => d.code === formData.disposition);

  const handleDispositionChange = (value: string) => {
    const disp = dispositions.find(d => d.code === value);
    setFormData(prev => ({
      ...prev,
      disposition: value,
      subDisposition: ''
    }));
    setShowCallback(disp?.requiresCallback || false);
  };

  const handleSave = () => {
    const disp = dispositions.find(d => d.code === formData.disposition);
    
    if (!formData.disposition) {
      toast({
        title: "Error",
        description: "Debes seleccionar una tipificación",
        variant: "destructive",
      });
      return;
    }

    if (disp?.requiresComment && !formData.comments.trim()) {
      toast({
        title: "Error",
        description: "Esta tipificación requiere comentarios",
        variant: "destructive",
      });
      return;
    }

    if (disp?.requiresCallback && !formData.callback?.date) {
      toast({
        title: "Error",
        description: "Esta tipificación requiere programar callback",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Tipificación guardada",
      description: `Llamada tipificada como: ${disp?.name}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addObjection = (objection: string) => {
    if (!selectedObjections.includes(objection)) {
      const newObjections = [...selectedObjections, objection];
      setSelectedObjections(newObjections);
      setFormData(prev => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          objections: newObjections
        }
      }));
    }
  };

  const removeObjection = (objection: string) => {
    const newObjections = selectedObjections.filter(o => o !== objection);
    setSelectedObjections(newObjections);
    setFormData(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        objections: newObjections
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header de la tipificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Tipificación de Llamada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Duración: {formatTime(formData.callDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Intento #{formData.contactAttempts}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Lead ID: {leadId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selección de tipificación principal */}
      <Card>
        <CardHeader>
          <CardTitle>Resultado de la Llamada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="disposition">Tipificación Principal *</Label>
            <Select value={formData.disposition} onValueChange={handleDispositionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipificación" />
              </SelectTrigger>
              <SelectContent>
                {dispositions.map((disp) => (
                  <SelectItem key={disp.code} value={disp.code}>
                    <div className="flex items-center gap-2">
                      <Badge className={disp.color} variant="secondary">
                        {disp.name}
                      </Badge>
                      <span className="text-xs text-gray-600">({disp.points} pts)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-tipificación si está disponible */}
          {selectedDisposition && subDispositions[formData.disposition as keyof typeof subDispositions] && (
            <div>
              <Label htmlFor="subDisposition">Detalle Específico</Label>
              <Select value={formData.subDisposition} onValueChange={(value) => setFormData(prev => ({ ...prev, subDisposition: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar detalle" />
                </SelectTrigger>
                <SelectContent>
                  {subDispositions[formData.disposition as keyof typeof subDispositions].map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Calificación de la llamada */}
          <div>
            <Label>Calidad de la Llamada</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={formData.callQuality >= rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, callQuality: rating }))}
                >
                  <Star className={`h-4 w-4 ${formData.callQuality >= rating ? 'fill-current' : ''}`} />
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formData.callQuality === 1 ? 'Muy mala conexión/comunicación' :
               formData.callQuality === 2 ? 'Mala comunicación' :
               formData.callQuality === 3 ? 'Comunicación regular' :
               formData.callQuality === 4 ? 'Buena comunicación' :
               'Excelente comunicación'}
            </p>
          </div>

          {/* Información adicional del lead */}
          {['CONTACT', 'INTERESTED', 'VERY_INTERESTED', 'SALE'].includes(formData.disposition) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="budget">Presupuesto Disponible</Label>
                <Select 
                  value={formData.additionalInfo.budget} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, budget: value } 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Bajo (Menos de $500,000)</SelectItem>
                    <SelectItem value="medium">Medio ($500,000 - $1,000,000)</SelectItem>
                    <SelectItem value="high">Alto (Más de $1,000,000)</SelectItem>
                    <SelectItem value="unknown">No especificó</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeframe">Marco de Tiempo</Label>
                <Select 
                  value={formData.additionalInfo.timeframe} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, timeframe: value } 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuándo quiere empezar?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Inmediatamente</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                    <SelectItem value="quarter">En 3 meses</SelectItem>
                    <SelectItem value="later">Más adelante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="courseInterest">Curso de Mayor Interés</Label>
                <Input
                  value={formData.additionalInfo.courseInterest}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, courseInterest: e.target.value } 
                  }))}
                  placeholder="¿Qué curso le interesa más?"
                />
              </div>

              <div>
                <Label htmlFor="competitor">Competencia Mencionada</Label>
                <Input
                  value={formData.additionalInfo.competitorMention}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, competitorMention: e.target.value } 
                  }))}
                  placeholder="¿Mencionó algún competidor?"
                />
              </div>

              <div className="md:col-span-2">
                <Label>¿Es quien toma las decisiones?</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant={formData.additionalInfo.decisionMaker ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      additionalInfo: { ...prev.additionalInfo, decisionMaker: true } 
                    }))}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sí, decide solo
                  </Button>
                  <Button
                    variant={!formData.additionalInfo.decisionMaker ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      additionalInfo: { ...prev.additionalInfo, decisionMaker: false } 
                    }))}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Debe consultar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Objeciones mencionadas */}
          {['NI', 'NO_BUDGET', 'NO_TIME', 'COMPETITOR'].includes(formData.disposition) && (
            <div className="pt-4 border-t">
              <Label>Objeciones Mencionadas</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 mb-4">
                {objectionsList.map((objection) => (
                  <Button
                    key={objection}
                    variant={selectedObjections.includes(objection) ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectedObjections.includes(objection) ? removeObjection(objection) : addObjection(objection)}
                  >
                    {objection}
                  </Button>
                ))}
              </div>
              {selectedObjections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedObjections.map((objection) => (
                    <Badge key={objection} variant="secondary" className="flex items-center gap-1">
                      {objection}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeObjection(objection)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comentarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentarios de la Llamada
            {selectedDisposition?.requiresComment && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.comments}
            onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Describe los detalles de la conversación, información relevante del lead, próximos pasos, etc."
            rows={4}
            className="w-full"
          />
          <p className="text-xs text-gray-600 mt-2">
            {formData.comments.length}/500 caracteres
          </p>
        </CardContent>
      </Card>

      {/* Programación de Callback */}
      {showCallback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programar Callback
              {selectedDisposition?.requiresCallback && <span className="text-red-500">*</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="callbackDate">Fecha del Callback</Label>
                <Input
                  type="date"
                  value={formData.callback?.date || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    callback: { ...prev.callback!, date: e.target.value }
                  }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="callbackTime">Hora del Callback</Label>
                <Input
                  type="time"
                  value={formData.callback?.time || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    callback: { ...prev.callback!, time: e.target.value }
                  }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="priority">Prioridad del Callback</Label>
              <Select 
                value={formData.callback?.priority || 'medium'} 
                onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({
                  ...prev,
                  callback: { ...prev.callback!, priority: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Alta Prioridad
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Prioridad Media
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Prioridad Baja
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="callbackNotes">Notas para el Callback</Label>
              <Textarea
                value={formData.callback?.notes || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  callback: { ...prev.callback!, notes: e.target.value }
                }))}
                placeholder="Información específica para el próximo contacto..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen de la tipificación */}
      {selectedDisposition && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Tipificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Tipificación:</span>
                <Badge className={selectedDisposition.color}>
                  {selectedDisposition.name}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Categoría:</span>
                <span className="font-medium">{selectedDisposition.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Puntos:</span>
                <span className="font-bold text-blue-600">{selectedDisposition.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Próxima acción:</span>
                <span className="text-sm text-gray-600">{selectedDisposition.nextAction}</span>
              </div>
              {formData.callback?.date && (
                <div className="flex items-center justify-between">
                  <span>Callback programado:</span>
                  <span className="font-medium">
                    {new Date(formData.callback.date).toLocaleDateString('es-ES')} a las {formData.callback.time}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Guardar Tipificación
        </Button>
      </div>
    </div>
  );
};

export default LeadTypification;
