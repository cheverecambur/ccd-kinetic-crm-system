
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Save, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  leadName?: string;
  phoneNumber?: string;
  onCallbackScheduled: () => void;
}

interface CallbackData {
  callback_time: string;
  comments: string;
  priority: 'low' | 'medium' | 'high';
  recipient: string;
}

const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
  phoneNumber,
  onCallbackScheduled
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CallbackData>({
    callback_time: '',
    comments: '',
    priority: 'medium',
    recipient: 'ANYONE'
  });

  const priorities = [
    { value: 'high', label: 'Alta Prioridad', color: 'text-red-600', icon: '🔴' },
    { value: 'medium', label: 'Prioridad Media', color: 'text-yellow-600', icon: '🟡' },
    { value: 'low', label: 'Prioridad Baja', color: 'text-green-600', icon: '🟢' }
  ];

  const recipients = [
    { value: 'ANYONE', label: 'Cualquier Asesor' },
    { value: 'SAME_AGENT', label: 'Mismo Asesor' },
    { value: 'SUPERVISOR', label: 'Supervisor' }
  ];

  const handleInputChange = (field: keyof CallbackData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.callback_time) {
      toast({
        title: "Error",
        description: "Debes seleccionar fecha y hora para el callback",
        variant: "destructive",
      });
      return false;
    }

    // Verificar que la fecha sea futura
    const callbackDateTime = new Date(formData.callback_time);
    const now = new Date();
    
    if (callbackDateTime <= now) {
      toast({
        title: "Error",
        description: "La fecha del callback debe ser en el futuro",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.comments.trim()) {
      toast({
        title: "Error",
        description: "Los comentarios son obligatorios para el callback",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const callbackData = {
        lead_id: leadId ? parseInt(leadId) : null,
        callback_time: formData.callback_time,
        comments: formData.comments,
        recipient: formData.recipient,
        status: 'SCHEDULED',
        campaign_id: 'MANUAL',
        user_id: 'current_user', // TODO: Get from auth context
        completed: false,
        entry_time: new Date().toISOString()
      };

      const { error } = await supabase
        .from('callbacks')
        .insert([callbackData]);

      if (error) throw error;

      toast({
        title: "Callback programado",
        description: `Callback programado para ${new Date(formData.callback_time).toLocaleString()}`,
      });

      // Limpiar formulario
      setFormData({
        callback_time: '',
        comments: '',
        priority: 'medium',
        recipient: 'ANYONE'
      });

      onCallbackScheduled();
      onClose();

    } catch (error) {
      console.error('Error scheduling callback:', error);
      toast({
        title: "Error al programar callback",
        description: "No se pudo programar el callback. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generar opciones de tiempo comunes
  const getTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Programar Callback
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del lead */}
          {leadName && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lead:</strong> {leadName}
              </p>
              {phoneNumber && (
                <p className="text-sm text-blue-600">
                  <strong>Teléfono:</strong> {phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Fecha y hora del callback */}
          <div>
            <Label htmlFor="callback_time">Fecha y Hora del Callback *</Label>
            <Input
              id="callback_time"
              type="datetime-local"
              value={formData.callback_time}
              onChange={(e) => handleInputChange('callback_time', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Selecciona cuándo debe realizarse el siguiente contacto
            </p>
          </div>

          {/* Prioridad */}
          <div>
            <Label htmlFor="priority">Prioridad del Callback</Label>
            <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <span>{priority.icon}</span>
                      <span className={priority.color}>{priority.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asignación */}
          <div>
            <Label htmlFor="recipient">Asignar a</Label>
            <Select value={formData.recipient} onValueChange={(value) => handleInputChange('recipient', value)}>
              <SelectTrigger>
                <SelectValue placeholder="¿Quién debe hacer el callback?" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.value} value={recipient.value}>
                    {recipient.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comentarios */}
          <div>
            <Label htmlFor="comments">Comentarios para el Callback *</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Describe qué se debe tratar en el callback, estado del cliente, información importante..."
              rows={4}
            />
          </div>

          {/* Recordatorio */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Recordatorio</p>
                <p>El callback será visible en el panel de todos los asesores y aparecerá en las notificaciones.</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Programando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Programar Callback
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackModal;
