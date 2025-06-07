
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  PhoneCall, 
  Clock,
  User,
  MessageSquare,
  Wifi,
  WifiOff,
  Settings,
  BarChart3
} from 'lucide-react';
import { useVicidial } from '@/hooks/useVicidial';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ManualDialer from '@/components/ManualDialer';
import CallControls from '@/components/CallControls';
import DispositionModal, { DispositionData } from '@/components/DispositionModal';
import VicidialDataExtractor from '@/components/VicidialDataExtractor';

const CallCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('calls');

  // Datos para el próximo lead programado
  const nextScheduledLead = {
    id: '1',
    name: 'María González',
    phone: '+57 301 234 5678',
    email: 'maria.gonzalez@email.com',
    city: 'Bogotá',
    course: 'Contabilidad Básica',
    source: 'Facebook',
    score: 85,
    lastContact: '2024-01-20',
    callbackTime: '14:30',
    notes: 'Interesada en horarios flexibles, trabaja tiempo completo'
  };

  const callHistory = [
    {
      id: 1,
      name: 'Carlos Pérez',
      phone: '+57 300 876 5432',
      time: '14:30',
      duration: '8:45',
      disposition: 'SALE',
      notes: 'Venta realizada - Excel Avanzado'
    },
    {
      id: 2,
      name: 'Ana López',
      phone: '+57 315 246 8135',
      time: '13:15',
      duration: '3:20',
      disposition: 'CALLBACK',
      notes: 'Llamar después de las 6pm'
    },
    {
      id: 3,
      name: 'Luis Martínez',
      phone: '+57 312 987 6543',
      time: '12:45',
      duration: '2:15',
      disposition: 'NOT_INTERESTED',
      notes: 'No está interesado en este momento'
    }
  ];

  // Manejar inicio de llamada manual
  const handleStartManualCall = (phoneNumber: string, leadName?: string, leadId?: string) => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    startCall({
      phoneNumber: cleanPhoneNumber,
      phoneCode: '57',
      leadId: leadId || `manual_${Date.now()}`,
      leadName: leadName || 'Llamada Manual'
    });
  };

  // Manejar inicio de llamada programada
  const handleStartScheduledCall = () => {
    startCall({
      phoneNumber: nextScheduledLead.phone.replace(/\D/g, ''),
      phoneCode: '57',
      leadId: nextScheduledLead.id,
      leadName: nextScheduledLead.name
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

  // Handlers para controles adicionales
  const handleMute = () => {
    console.log('Muting call');
    toast({
      title: "Micrófono",
      description: "Estado del micrófono cambiado",
    });
  };

  const handleHold = () => {
    console.log('Putting call on hold');
    toast({
      title: "Llamada en espera",
      description: "Llamada puesta en espera",
    });
  };

  // Guardar resultado de llamada
  const handleSaveDisposition = (dispositionData: DispositionData) => {
    console.log('Saving disposition:', dispositionData);
    
    setDisposition(dispositionData);
    setShowDispositionModal(false);
    
    toast({
      title: "Disposición guardada",
      description: `Resultado: ${dispositionData.disposition}`,
    });
  };

  // Función para enviar WhatsApp
  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${name}, soy ${user?.first_name || 'un asesor'} de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case 'SALE': return 'bg-green-500';
      case 'INTERESTED': return 'bg-green-400';
      case 'CALLBACK': return 'bg-blue-500';
      case 'CALL_BACK_LATER': return 'bg-blue-400';
      case 'NOT_INTERESTED': return 'bg-red-500';
      case 'NO_ANSWER': return 'bg-yellow-500';
      case 'BUSY': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
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
          {/* Métricas del agente en tiempo real */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Métricas de Hoy - Vicidial
              </CardTitle>
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

          {/* Controles de llamada */}
          <CallControls
            callSession={callSession}
            onHangup={handleEndCall}
            onPause={handlePauseCall}
            onMute={handleMute}
            onHold={handleHold}
            formatCallDuration={formatCallDuration}
            isEndingCall={isEndingCall}
            isPausingCall={isPausingCall}
          />

          {/* Tabs para diferentes funcionalidades */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="calls">Llamadas</TabsTrigger>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calls" className="p-6">
                  {/* Próxima llamada programada */}
                  {!callSession.isActive && (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Phone className="h-12 w-12 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Próximo Lead Programado</h3>
                        <p className="text-gray-600">{nextScheduledLead.name}</p>
                        <p className="text-sm text-gray-500">{nextScheduledLead.phone}</p>
                        <p className="text-xs text-blue-600">Callback: Hoy {nextScheduledLead.callbackTime}</p>
                        <Badge className="mt-2 bg-orange-500">{nextScheduledLead.score}% Score</Badge>
                      </div>
                      <Button 
                        onClick={handleStartScheduledCall} 
                        size="lg" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isStartingCall || !isVicidialConnected}
                      >
                        {isStartingCall ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Conectando...
                          </div>
                        ) : (
                          <>
                            <Phone className="h-5 w-5 mr-2" />
                            Llamar Lead Programado
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="manual" className="p-6">
                  <ManualDialer onCall={handleStartManualCall} />
                </TabsContent>
                
                <TabsContent value="history" className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Llamadas de Hoy</h3>
                    {callHistory.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{call.name}</p>
                            <p className="text-sm text-gray-600">{call.phone}</p>
                            <p className="text-xs text-gray-500">{call.notes}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{call.time}</p>
                          <p className="text-xs text-gray-500">{call.duration}</p>
                          <Badge className={getDispositionColor(call.disposition)} variant="secondary">
                            {call.disposition}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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
              {callSession.isActive || activeTab === 'calls' ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="font-medium">{callSession.leadName || nextScheduledLead.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <p>{callSession.phoneNumber || nextScheduledLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ciudad</label>
                    <p>{nextScheduledLead.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Curso de Interés</label>
                    <p>{nextScheduledLead.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Score</label>
                    <Badge className="bg-orange-500">{nextScheduledLead.score}%</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fuente</label>
                    <p>{nextScheduledLead.source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notas Previas</label>
                    <p className="text-sm text-gray-600">{nextScheduledLead.notes}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Selecciona la pestaña "Llamadas" o inicia una llamada para ver la información del lead
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
                onClick={() => sendWhatsApp(nextScheduledLead.phone, nextScheduledLead.name)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Programar Callback
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para registrar resultado de llamada */}
      <DispositionModal
        isOpen={showDispositionModal}
        onClose={() => setShowDispositionModal(false)}
        onSave={handleSaveDisposition}
        leadName={callSession.leadName}
        phoneNumber={callSession.phoneNumber}
      />
    </div>
  );
};

export default CallCenter;
