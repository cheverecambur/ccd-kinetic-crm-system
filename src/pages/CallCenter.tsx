
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Pause, 
  Play, 
  Clock,
  User,
  MessageSquare,
  Calendar,
  Save,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useVicidial } from '@/hooks/useVicidial';
import { useAuth } from '@/contexts/AuthContext';
import VicidialDataExtractor from '@/components/VicidialDataExtractor';

const CallCenter = () => {
  const { user } = useAuth();
  const {
    callSession,
    agentMetrics,
    isVicidialConnected,
    startCall,
    endCall,
    pauseCall,
    setDisposition,
    isStartingCall,
    isEndingCall,
    isPausingCall,
    formatCallDuration
  } = useVicidial();

  const [disposition, setDispositionValue] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [callbackDateTime, setCallbackDateTime] = useState('');

  // Datos simulados para el próximo lead
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

  // Manejar inicio de llamada
  const handleStartCall = () => {
    startCall({
      phoneNumber: nextLead.phone.replace(/\D/g, ''), // Solo números
      phoneCode: '57',
      leadId: nextLead.id,
      leadName: nextLead.name
    });
  };

  // Manejar fin de llamada
  const handleEndCall = () => {
    endCall();
    setShowDispositionModal(true);
  };

  // Manejar pausa/reanudación
  const handlePauseCall = () => {
    pauseCall(!callSession.isPaused);
  };

  // Guardar resultado de llamada
  const handleSaveDisposition = () => {
    if (!disposition) {
      return;
    }

    if (!user?.username) {
      return;
    }

    const dispositionData = {
      agent_user: user.username,
      value: disposition,
      callback_datetime: disposition === 'CALLBACK' ? callbackDateTime : undefined,
      callback_type: 'ANYONE' as const,
      callback_comments: callNotes
    };

    setDisposition(dispositionData);
    
    setShowDispositionModal(false);
    setDispositionValue('');
    setCallNotes('');
    setCallbackDateTime('');
  };

  // Función para enviar WhatsApp
  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${name}, soy ${user?.name} de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-600">Centro de llamadas integrado con Vicidial</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={isVicidialConnected ? "bg-green-500" : "bg-red-500"}>
            {isVicidialConnected ? (
              <>
                <Wifi className="h-3 w-3 mr-1" />
                Vicidial Conectado
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 mr-1" />
                Vicidial Desconectado
              </>
            )}
          </Badge>
          <Badge variant="outline">
            Ext: {user?.extension || '101'}
          </Badge>
        </div>
      </div>

      {/* Extractor de datos de Vicidial */}
      <VicidialDataExtractor />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel principal de llamadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Control de llamadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Control de Llamadas - Vicidial
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!callSession.isActive ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="h-12 w-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Próximo Lead</h3>
                    <p className="text-gray-600">{nextLead.name}</p>
                    <p className="text-sm text-gray-500">{nextLead.phone}</p>
                    <Badge className="mt-2 bg-orange-500">{nextLead.score}% Score</Badge>
                  </div>
                  <Button 
                    onClick={handleStartCall} 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isStartingCall || !isVicidialConnected}
                  >
                    {isStartingCall ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Phone className="h-5 w-5 mr-2" />
                        Iniciar Llamada
                      </>
                    )}
                  </Button>
                  {!isVicidialConnected && (
                    <p className="text-sm text-red-600">
                      Vicidial no está conectado. Verifique la configuración.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    {callSession.isPaused ? (
                      <Pause className="h-12 w-12 text-orange-600" />
                    ) : (
                      <PhoneCall className="h-12 w-12 text-green-600 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">En llamada con</h3>
                    <p className="text-gray-600">{callSession.leadName}</p>
                    <p className="text-sm text-gray-500">{callSession.phoneNumber}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-lg">{formatCallDuration(callSession.duration)}</span>
                    </div>
                    {callSession.isPaused && (
                      <Badge className="mt-2 bg-orange-500">En Pausa</Badge>
                    )}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handlePauseCall} 
                      variant="outline"
                      className={callSession.isPaused ? 'bg-orange-100' : ''}
                      disabled={isPausingCall}
                    >
                      {callSession.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </Button>
                    <Button 
                      onClick={handleEndCall} 
                      variant="destructive"
                      disabled={isEndingCall}
                    >
                      {isEndingCall ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <PhoneOff className="h-4 w-4 mr-2" />
                      )}
                      Finalizar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métricas del agente en tiempo real */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Hoy - Vicidial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{agentMetrics?.callsToday || 0}</div>
                  <div className="text-sm text-gray-600">Llamadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{agentMetrics?.conversions || 0}</div>
                  <div className="text-sm text-gray-600">Conversiones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{agentMetrics?.averageCallTime || '0:00'}</div>
                  <div className="text-sm text-gray-600">Tiempo Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {agentMetrics ? Math.floor(agentMetrics.talkTime / 60) : 0}m
                  </div>
                  <div className="text-sm text-gray-600">Tiempo de Conversación</div>
                </div>
              </div>
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
              {callSession.isActive ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="font-medium">{nextLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ciudad</label>
                    <p>{nextLead.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Curso de Interés</label>
                    <p>{nextLead.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Score</label>
                    <Badge className="bg-orange-500">{nextLead.score}%</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fuente</label>
                    <p>{nextLead.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notas Previas</label>
                    <p className="text-sm text-gray-600">{nextLead.notes}</p>
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
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => sendWhatsApp(nextLead.phone, nextLead.name)}
              >
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
      <Dialog open={showDispositionModal} onOpenChange={setShowDispositionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Resultado de Llamada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Disposición de la Llamada</label>
              <Select value={disposition} onValueChange={setDispositionValue}>
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
                <Input 
                  type="datetime-local" 
                  value={callbackDateTime}
                  onChange={(e) => setCallbackDateTime(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveDisposition} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar en Vicidial
              </Button>
              <Button variant="outline" onClick={() => setShowDispositionModal(false)}>
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
