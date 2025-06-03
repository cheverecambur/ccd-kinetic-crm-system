
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  PhoneCall,
  Save,
  RotateCcw,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Disposition {
  code: string;
  name: string;
  category: string;
  color: string;
  requiresCallback: boolean;
  requiresComment: boolean;
  description: string;
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
  comments: string;
  callback?: CallbackSchedule;
  contactAttempts: number;
  callDuration: number;
  callQuality: number;
  additionalInfo: {
    budget: string;
    timeframe: string;
    paymentAmount: string;
    fullName: string;
    dni: string;
    confirmationTime: string;
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
    additionalInfo: {
      budget: '',
      timeframe: '',
      paymentAmount: '',
      fullName: '',
      dni: '',
      confirmationTime: ''
    }
  });

  const [showCallback, setShowCallback] = useState(false);
  const { toast } = useToast();

  // Tipificaciones específicas según los requerimientos
  const dispositions: Disposition[] = [
    {
      code: 'NO_CONTESTA',
      name: 'No Contesta',
      category: 'NO_CONTACT',
      color: 'bg-gray-100 text-gray-800',
      requiresCallback: true,
      requiresComment: true,
      description: 'NC (3 VECES) SE DEJA MENSAJE DE HABERLO LLAMADO',
      points: 1
    },
    {
      code: 'NO_DESEA',
      name: 'No Desea',
      category: 'NO_SALE',
      color: 'bg-red-100 text-red-800',
      requiresCallback: false,
      requiresComment: true,
      description: 'CLTE NO DESEA POR PRECIO, TIEMPO, NO INDICA MOTIVO, ETC',
      points: 2
    },
    {
      code: 'CLTE_POTENCIAL',
      name: 'Cliente Potencial',
      category: 'POTENTIAL',
      color: 'bg-yellow-100 text-yellow-800',
      requiresCallback: true,
      requiresComment: true,
      description: 'CLTE NO TIENE EL PRESUPUESTO, LO LLEVARA PARA EL SOTE INICIO, DEJO DE CONTESTAR',
      points: 5
    },
    {
      code: 'VOLVER_LLAMAR',
      name: 'Volver a Llamar',
      category: 'CALLBACK',
      color: 'bg-blue-100 text-blue-800',
      requiresCallback: true,
      requiresComment: true,
      description: 'NO DEJA EXPLICAR QUIERE QUE LO LLAMEN A OTRA HORA',
      points: 3
    },
    {
      code: 'MUY_INTERESADO',
      name: 'Muy Interesado',
      category: 'INTERESTED',
      color: 'bg-green-100 text-green-800',
      requiresCallback: true,
      requiresComment: true,
      description: 'CLTE EVALUA PROMOCION, CONFIRMARA A LAS 5 PM',
      points: 15
    },
    {
      code: 'SER_VACANTE',
      name: 'Ser Vacante',
      category: 'SALE',
      color: 'bg-purple-100 text-purple-800',
      requiresCallback: false,
      requiresComment: true,
      description: 'FECHA Y HORA DE PAGO (S/50 a mas) (NOMBRE COMPLETO Y DNI)',
      points: 30
    },
    {
      code: 'PAGO_INCOMPLETO',
      name: 'Pago Incompleto',
      category: 'PARTIAL_SALE',
      color: 'bg-orange-100 text-orange-800',
      requiresCallback: true,
      requiresComment: true,
      description: 'FECHA Y HORA DE PAGO (S/50 o menos del 50%)',
      points: 20
    },
    {
      code: 'TRIBULADO',
      name: 'Tribulado',
      category: 'FULL_SALE',
      color: 'bg-green-200 text-green-900',
      requiresCallback: false,
      requiresComment: true,
      description: 'PAGO 50% PAGO COMPLETO + CURSO DE REGALO',
      points: 50
    },
    {
      code: 'EFICAZ',
      name: 'Eficaz',
      category: 'NO_PROSPECT',
      color: 'bg-gray-200 text-gray-800',
      requiresCallback: false,
      requiresComment: true,
      description: 'CLTE NO RESPONDE LLAMADAS EN 3 DIAS DISTINTOS, NUNCA PIDIO INFORMACION, NIÑOS, ETC',
      points: 0
    }
  ];

  const selectedDisposition = dispositions.find(d => d.code === formData.disposition);

  const handleDispositionChange = (value: string) => {
    const disp = dispositions.find(d => d.code === value);
    setFormData(prev => ({
      ...prev,
      disposition: value
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

    // Validaciones específicas según tipo
    if (['SER_VACANTE', 'PAGO_INCOMPLETO', 'TRIBULADO'].includes(formData.disposition)) {
      if (!formData.additionalInfo.paymentAmount || !formData.additionalInfo.fullName || !formData.additionalInfo.dni) {
        toast({
          title: "Error",
          description: "Para esta tipificación se requiere monto de pago, nombre completo y DNI",
          variant: "destructive",
        });
        return;
      }
    }

    if (formData.disposition === 'MUY_INTERESADO' && !formData.additionalInfo.confirmationTime) {
      toast({
        title: "Error",
        description: "Para 'Muy Interesado' se requiere hora de confirmación",
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

  return (
    <div className="space-y-6">
      {/* Header de la tipificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Tipificación de Llamada - Lead {leadId}
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
              <span className="text-sm">Calidad: {formData.callQuality}/5</span>
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
            <Label htmlFor="disposition">Tipificación *</Label>
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
            {selectedDisposition && (
              <p className="text-xs text-gray-600 mt-1">
                {selectedDisposition.description}
              </p>
            )}
          </div>

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
          </div>

          {/* Información específica según tipificación */}
          {['SER_VACANTE', 'PAGO_INCOMPLETO', 'TRIBULADO'].includes(formData.disposition) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="paymentAmount">Monto de Pago (S/) *</Label>
                <Input
                  value={formData.additionalInfo.paymentAmount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, paymentAmount: e.target.value } 
                  }))}
                  placeholder="50"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  value={formData.additionalInfo.fullName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, fullName: e.target.value } 
                  }))}
                  placeholder="Nombre completo del cliente"
                />
              </div>
              <div>
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  value={formData.additionalInfo.dni}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, dni: e.target.value } 
                  }))}
                  placeholder="12345678"
                />
              </div>
              <div>
                <Label htmlFor="timeframe">Fecha y Hora de Pago</Label>
                <Input
                  type="datetime-local"
                  value={formData.additionalInfo.timeframe}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    additionalInfo: { ...prev.additionalInfo, timeframe: e.target.value } 
                  }))}
                />
              </div>
            </div>
          )}

          {formData.disposition === 'MUY_INTERESADO' && (
            <div className="pt-4 border-t">
              <Label htmlFor="confirmationTime">Hora de Confirmación *</Label>
              <Input
                type="time"
                value={formData.additionalInfo.confirmationTime}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  additionalInfo: { ...prev.additionalInfo, confirmationTime: e.target.value } 
                }))}
                placeholder="17:00"
              />
              <p className="text-xs text-gray-600 mt-1">
                Cliente confirmará a esta hora si procede con la promoción
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comentarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Observaciones
            {selectedDisposition?.requiresComment && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.comments}
            onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Describe los detalles de la conversación, motivos del cliente, próximos pasos, etc."
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

      {/* Resumen */}
      {selectedDisposition && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tipificación:</span>
                <Badge className={selectedDisposition.color}>{selectedDisposition.name}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Categoría:</span>
                <span>{selectedDisposition.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Puntos:</span>
                <span className="font-bold">{selectedDisposition.points}</span>
              </div>
              {formData.callback?.date && (
                <div className="flex justify-between">
                  <span>Callback:</span>
                  <span>{formData.callback.date} - {formData.callback.time}</span>
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
