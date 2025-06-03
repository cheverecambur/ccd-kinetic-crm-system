
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Pause, 
  Play, 
  Volume2,
  Clock,
  User,
  MessageSquare,
  Calendar,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const CallCenter = () => {
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callPaused, setCallPaused] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [currentLead, setCurrentLead] = useState(null);
  const [disposition, setDisposition] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [showLeadInfo, setShowLeadInfo] = useState(false);

  // Datos simulados
  const nextLead = {
    id: '1',
    name: 'María González',
    phone: '+57 301 234 5678',
    email: 'maria.gonzalez@email.com',
    city: 'Bogotá',
    course: 'Contabilidad Básica',
    source: 'Facebook',
    score: 85,
    lastContact: '2024-01-20',
    notes: 'Interesada en horarios flexibles, trabaja tiempo completo'
  };

  const dispositions = [
    { value: 'ANSWERED', label: 'Contestó - Interesado' },
    { value: 'ANSWERED_NOT_INTERESTED', label: 'Contestó - No Interesado' },
    { value: 'CALLBACK', label: 'Solicita Callback' },
    { value: 'NO_ANSWER', label: 'No Contesta' },
    { value: 'BUSY', label: 'Ocupado' },
    { value: 'VOICEMAIL', label: 'Buzón de Voz' },
    { value: 'WRONG_NUMBER', label: 'Número Equivocado' },
    { value: 'DO_NOT_CALL', label: 'No Volver a Llamar' }
  ];

  const callHistory = [
    {
      id: 1,
      name: 'Carlos Pérez',
      phone: '+57 300 876 5432',
      time: '14:30',
      duration: '8:45',
      disposition: 'ANSWERED',
      notes: 'Muy interesado en curso de Excel'
    },
    {
      id: 2,
      name: 'Ana López',
      phone: '+57 315 246 8135',
      time: '13:15',
      duration: '3:20',
      disposition: 'CALLBACK',
      notes: 'Llamar después de las 6pm'
    }
  ];

  const startCall = () => {
    setIsCallActive(true);
    setCurrentLead(nextLead);
    setCallDuration(0);
    toast({
      title: "Llamada iniciada",
      description: `Conectando con ${nextLead.name}`,
    });
    
    // Simular contador de duración
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallPaused(false);
    setShowLeadInfo(true);
    toast({
      title: "Llamada finalizada",
      description: `Duración: ${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`,
    });
  };

  const pauseCall = () => {
    setCallPaused(!callPaused);
    toast({
      title: callPaused ? "Llamada reanudada" : "Llamada pausada",
      description: callPaused ? "Audio reactivado" : "Audio silenciado",
    });
  };

  const saveCallResult = () => {
    if (!disposition) {
      toast({
        title: "Error",
        description: "Debes seleccionar una disposición para la llamada",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Resultado guardado",
      description: "La información de la llamada ha sido registrada",
    });
    
    setShowLeadInfo(false);
    setCurrentLead(null);
    setDisposition('');
    setCallNotes('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-600">Centro de llamadas y gestión de contactos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500">
            En Línea
          </Badge>
          <Badge variant="outline">
            Ext: 101
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel principal de llamadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Control de llamadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Control de Llamadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isCallActive ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-12 w-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Próximo Lead</h3>
                    <p className="text-gray-600">{nextLead.name}</p>
                    <p className="text-sm text-gray-500">{nextLead.phone}</p>
                  </div>
                  <Button onClick={startCall} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-5 w-5 mr-2" />
                    Iniciar Llamada
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    {callPaused ? (
                      <Pause className="h-12 w-12 text-orange-600" />
                    ) : (
                      <PhoneCall className="h-12 w-12 text-green-600 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">En llamada con</h3>
                    <p className="text-gray-600">{currentLead?.name}</p>
                    <p className="text-sm text-gray-500">{currentLead?.phone}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-lg">{formatTime(callDuration)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={pauseCall} 
                      variant="outline"
                      className={callPaused ? 'bg-orange-100' : ''}
                    >
                      {callPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                    <Button onClick={endCall} variant="destructive">
                      <PhoneOff className="h-4 w-4 mr-2" />
                      Finalizar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial de llamadas del día */}
          <Card>
            <CardHeader>
              <CardTitle>Llamadas de Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callHistory.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{call.name}</p>
                        <p className="text-sm text-gray-600">{call.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{call.time}</p>
                      <p className="text-xs text-gray-500">{call.duration}</p>
                    </div>
                    <Badge className={
                      call.disposition === 'ANSWERED' ? 'bg-green-500' :
                      call.disposition === 'CALLBACK' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }>
                      {call.disposition}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral - Información del lead */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentLead ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="font-medium">{currentLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ciudad</label>
                    <p>{currentLead.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Curso de Interés</label>
                    <p>{currentLead.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Score</label>
                    <Badge className="bg-orange-500">{currentLead.score}%</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fuente</label>
                    <p>{currentLead.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notas Previas</label>
                    <p className="text-sm text-gray-600">{currentLead.notes}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Inicia una llamada para ver la información del lead
                </p>
              )}
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Programar Callback
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Marcar para Re-llamar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para registrar resultado de llamada */}
      <Dialog open={showLeadInfo} onOpenChange={setShowLeadInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Resultado de Llamada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Disposición de la Llamada</label>
              <Select value={disposition} onValueChange={setDisposition}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar resultado" />
                </SelectTrigger>
                <SelectContent>
                  {dispositions.map((disp) => (
                    <SelectItem key={disp.value} value={disp.value}>
                      {disp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notas de la Llamada</label>
              <Textarea
                placeholder="Escribe notas importantes de la conversación..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={4}
              />
            </div>

            {disposition === 'CALLBACK' && (
              <div>
                <label className="block text-sm font-medium mb-2">Fecha y Hora del Callback</label>
                <Input type="datetime-local" />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={saveCallResult} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setShowLeadInfo(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallCenter;
