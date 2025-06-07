
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Save, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (disposition: DispositionData) => void;
  leadName?: string;
  phoneNumber?: string;
}

export interface DispositionData {
  disposition: string;
  comments: string;
  callbackDate?: string;
  callbackTime?: string;
  requiresCallback: boolean;
}

const DispositionModal: React.FC<DispositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  leadName,
  phoneNumber
}) => {
  const [disposition, setDisposition] = useState('');
  const [comments, setComments] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const { toast } = useToast();

  const dispositions = [
    { 
      value: 'SALE', 
      label: 'Venta Realizada',
      requiresCallback: false,
      category: 'success'
    },
    { 
      value: 'INTERESTED', 
      label: 'Muy Interesado',
      requiresCallback: false,
      category: 'success'
    },
    { 
      value: 'CALLBACK', 
      label: 'Solicita Callback',
      requiresCallback: true,
      category: 'follow-up'
    },
    { 
      value: 'CALL_BACK_LATER', 
      label: 'Volver a Llamar',
      requiresCallback: true,
      category: 'follow-up'
    },
    { 
      value: 'NOT_INTERESTED', 
      label: 'No Interesado',
      requiresCallback: false,
      category: 'negative'
    },
    { 
      value: 'NO_ANSWER', 
      label: 'No Contesta',
      requiresCallback: false,
      category: 'no-contact'
    },
    { 
      value: 'BUSY', 
      label: 'Ocupado',
      requiresCallback: false,
      category: 'no-contact'
    },
    { 
      value: 'VOICEMAIL', 
      label: 'Buzón de Voz',
      requiresCallback: false,
      category: 'no-contact'
    },
    { 
      value: 'WRONG_NUMBER', 
      label: 'Número Equivocado',
      requiresCallback: false,
      category: 'invalid'
    },
    { 
      value: 'DISCONNECTED', 
      label: 'Desconectado',
      requiresCallback: false,
      category: 'invalid'
    },
    { 
      value: 'DO_NOT_CALL', 
      label: 'No Volver a Llamar',
      requiresCallback: false,
      category: 'invalid'
    }
  ];

  const selectedDisposition = dispositions.find(d => d.value === disposition);
  const requiresCallback = selectedDisposition?.requiresCallback || false;

  const handleSave = () => {
    if (!disposition) {
      toast({
        title: "Error",
        description: "Por favor selecciona una disposición",
        variant: "destructive",
      });
      return;
    }

    if (requiresCallback && (!callbackDate || !callbackTime)) {
      toast({
        title: "Error",
        description: "Por favor programa la fecha y hora del callback",
        variant: "destructive",
      });
      return;
    }

    const dispositionData: DispositionData = {
      disposition,
      comments,
      callbackDate: requiresCallback ? callbackDate : undefined,
      callbackTime: requiresCallback ? callbackTime : undefined,
      requiresCallback
    };

    onSave(dispositionData);
    
    // Limpiar formulario
    setDisposition('');
    setComments('');
    setCallbackDate('');
    setCallbackTime('');
    
    toast({
      title: "Disposición guardada",
      description: "El resultado de la llamada ha sido registrado",
    });
  };

  const getDispositionColor = (category: string) => {
    switch (category) {
      case 'success': return 'text-green-600';
      case 'follow-up': return 'text-blue-600';
      case 'negative': return 'text-red-600';
      case 'no-contact': return 'text-yellow-600';
      case 'invalid': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Resultado de Llamada</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Información de la llamada */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Contacto:</strong> {leadName || 'Manual Call'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Teléfono:</strong> {phoneNumber}
            </p>
          </div>

          {/* Selección de disposición */}
          <div>
            <Label htmlFor="disposition">Resultado de la Llamada *</Label>
            <Select value={disposition} onValueChange={setDisposition}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar resultado..." />
              </SelectTrigger>
              <SelectContent>
                {dispositions.map((disp) => (
                  <SelectItem key={disp.value} value={disp.value}>
                    <span className={getDispositionColor(disp.category)}>
                      {disp.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comentarios */}
          <div>
            <Label htmlFor="comments">Comentarios de la Llamada</Label>
            <Textarea
              id="comments"
              placeholder="Describe la conversación, intereses del cliente, observaciones importantes..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          {/* Callback scheduling (condicional) */}
          {requiresCallback && (
            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Programar Callback
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="callbackDate">Fecha *</Label>
                  <Input
                    id="callbackDate"
                    type="date"
                    value={callbackDate}
                    onChange={(e) => setCallbackDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="callbackTime">Hora *</Label>
                  <Input
                    id="callbackTime"
                    type="time"
                    value={callbackTime}
                    onChange={(e) => setCallbackTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar Resultado
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispositionModal;
