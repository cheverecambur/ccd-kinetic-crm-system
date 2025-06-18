
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
import { useVicidialReal } from '@/hooks/useVicidialReal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ManualDialer from '@/components/ManualDialer';
import DispositionModal from '@/components/DispositionModal';
import VicidialDataExtractor from '@/components/VicidialDataExtractor';
import NewLeadModal from '@/components/NewLeadModal';
import CallbackModal from '@/components/CallbackModal';
import SaleRegistrationModal from '@/components/SaleRegistrationModal';
import AIAssistant from '@/components/AIAssistant';

// Crear un componente CallControls específico para VicidialReal
const VicidialCallControls = ({ 
  callSession, 
  onHangup, 
  onPause, 
  onMute, 
  onHold, 
  formatCallDuration,
  isEndingCall,
  isPausingCall 
}: {
  callSession: any;
  onHangup: () => void;
  onPause: () => void;
  onMute: () => void;
  onHold: () => void;
  formatCallDuration: (seconds: number) => string;
  isEndingCall: boolean;
  isPausingCall: boolean;
}) => {
  if (!callSession.isActive) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No hay llamada activa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Llamada Activa
          </span>
          <Badge 
            className={
              callSession.status === 'CONNECTED' ? 'bg-green-500' :
              callSession.status === 'RINGING' ? 'bg-blue-500' :
              callSession.status === 'PAUSED' ? 'bg-yellow-500' :
              'bg-gray-500'
            }
          >
            {callSession.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {formatCallDuration(callSession.duration)}
          </div>
          <p className="text-gray-600">Duración de la llamada</p>
          {callSession.leadName && (
            <p className="text-lg font-medium mt-2">{callSession.leadName}</p>
          )}
          {callSession.phoneNumber && (
            <p className="text-gray-600">{callSession.phoneNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onPause}
            disabled={isPausingCall}
            variant={callSession.isPaused ? "default" : "outline"}
            className="w-full"
          >
            {isPausingCall ? 'Procesando...' : (callSession.isPaused ? 'Reanudar' : 'Pausar')}
          </Button>
          
          <Button
            onClick={onMute}
            variant="outline"
            className="w-full"
          >
            Silenciar
          </Button>
          
          <Button
            onClick={onHold}
            variant="outline"
            className="w-full"
          >
            En Espera
          </Button>
          
          <Button
            onClick={onHangup}
            disabled={isEndingCall}
            variant="destructive"
            className="w-full"
          >
            {isEndingCall ? 'Finalizando...' : 'Colgar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface DispositionData {
  disposition: string;
  comments?: string;
  callbackDate?: string;
  callbackTime?: string;
}

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
    formatCallDuration,
    checkVicidialConnection,
    startRecording,
    stopRecording,
    transferCall
  } = useVicidialReal();

  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
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

  // Verificar conexión al cargar
  useEffect(() => {
    checkVicidialConnection();
  }, [checkVicidialConnection]);

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
    console.log('Silenciar micrófono - función a implementar');
    toast({
      title: "Micrófono",
      description: "Estado del micrófono cambiado",
    });
  };

  const handleHold = () => {
    console.log('Poner en espera - función a implementar');
    toast({
      title: "Llamada en espera",
      description: "Llamada puesta en espera",
    });
  };

  // Manejar grabación
  const handleRecording = () => {
    if (callSession.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Manejar transferencia
  const handleTransfer = (phoneNumber: string) => {
    transferCall(phoneNumber);
  };

  // Guardar resultado de llamada
  const handleSaveDisposition = (dispositionData: DispositionData) => {
    console.log('Guardando disposición:', dispositionData);
    
    setDisposition({
      value: dispositionData.disposition,
      callback_datetime: dispositionData.callbackDate && dispositionData.callbackTime 
        ? `${dispositionData.callbackDate}+${dispositionData.callbackTime}:00`
        : undefined,
      callback_type: 'ANYONE',
      callback_comments: dispositionData.comments
    });
    
    setShowDispositionModal(false);
    
    toast({
      title: "Disposición guardada",
      description: `Resultado: ${dispositionData.disposition}`,
    });
  };

  // Handlers para modales
  const handleLeadCreated = () => {
    toast({
      title: "Lead creado",
      description: "El nuevo lead ha sido agregado exitosamente",
    });
  };

  const handleCallbackScheduled = () => {
    toast({
      title: "Callback programado",
      description: "El callback ha sido programado exitosamente",
    });
  };

  const handleSaleRegistered = () => {
    toast({
      title: "Venta registrada",
      description: "La venta ha sido registrada exitosamente",
    });
  };

  // Función para enviar WhatsApp
  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const userName = user?.name || user?.email?.split('@')[0] || 'un asesor';
    const message = encodeURIComponent(`Hola ${name}, soy ${userName} de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
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
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call Center - Vicidial Integrado</h1>
            <p className="text-gray-600">Centro de llamadas con integración real de Vicidial</p>
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
            <Button 
              onClick={checkVicidialConnection}
              variant="outline" 
              size="sm"
            >
              Verificar Conexión
            </Button>
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
                  Métricas de Hoy - Vicidial Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{agentMetrics.callsToday}</div>
                    <div className="text-sm text-gray-600">Llamadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{agentMetrics.conversions}</div>
                    <div className="text-sm text-gray-600">Conversiones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{agentMetrics.averageCallTime}</div>
                    <div className="text-sm text-gray-600">Tiempo Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.floor(agentMetrics.talkTime / 60)}m
                    </div>
                    <div className="text-sm text-gray-600">Tiempo de Conversación</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controles de llamada usando VicidialCallControls */}
            <VicidialCallControls
              callSession={callSession}
              onHangup={handleEndCall}
              onPause={handlePauseCall}
              onMute={handleMute}
              onHold={handleHold}
              formatCallDuration={formatCallDuration}
              isEndingCall={isEndingCall}
              isPausingCall={isPausingCall}
            />

            {/* Controles adicionales de Vicidial */}
            {callSession.isActive && (
              <Card>
                <CardHeader>
                  <CardTitle>Controles Avanzados Vicidial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={handleRecording}
                      variant={callSession.isRecording ? "destructive" : "default"}
                      size="sm"
                    >
                      {callSession.isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
                    </Button>
                    <Button 
                      onClick={() => handleTransfer('1000')}
                      variant="outline"
                      size="sm"
                    >
                      Transferir a 1000
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Conferencia (Próximamente)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                              Conectando con Vicidial...
                            </div>
                          ) : (
                            <>
                              <Phone className="h-5 w-5 mr-2" />
                              Llamar Lead Programado
                            </>
                          )}
                        </Button>
                        {!isVicidialConnected && (
                          <p className="text-red-600 text-sm">
                            ⚠️ Conecte Vicidial para realizar llamadas
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="manual" className="p-6">
                    <ManualDialer onCall={handleStartManualCall} />
                    {!isVicidialConnected && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-800 text-sm">
                          ⚠️ Vicidial no está conectado. Revise la configuración en el archivo .env
                        </p>
                      </div>
                    )}
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
                    {callSession.isActive && (
                      <div className="pt-2 border-t">
                        <label className="text-sm font-medium text-gray-600">Estado de Llamada</label>
                        <p className="font-medium text-blue-600">{callSession.status}</p>
                        {callSession.isRecording && (
                          <Badge className="bg-red-500 mt-1">GRABANDO</Badge>
                        )}
                      </div>
                    )}
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
                  onClick={() =>
                    sendWhatsApp(nextScheduledLead.phone, nextScheduledLead.name)
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowCallbackModal(true)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Programar Callback
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowSaleModal(true)}
                  disabled={!callSession.isActive}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Registrar Venta
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowNewLeadModal(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Nuevo Lead
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modales */}
        <DispositionModal
          isOpen={showDispositionModal}
          onClose={() => setShowDispositionModal(false)}
          onSave={handleSaveDisposition}
          leadName={callSession.leadName}
          phoneNumber={callSession.phoneNumber}
        />

        <NewLeadModal
          isOpen={showNewLeadModal}
          onClose={() => setShowNewLeadModal(false)}
          onLeadCreated={handleLeadCreated}
        />

        <CallbackModal
          isOpen={showCallbackModal}
          onClose={() => setShowCallbackModal(false)}
          leadId={nextScheduledLead.id}
          leadName={nextScheduledLead.name}
          phoneNumber={nextScheduledLead.phone}
          onCallbackScheduled={handleCallbackScheduled}
        />

        <SaleRegistrationModal
          isOpen={showSaleModal}
          onClose={() => setShowSaleModal(false)}
          leadId={nextScheduledLead.id}
          leadName={nextScheduledLead.name}
          phoneNumber={nextScheduledLead.phone}
          onSaleRegistered={handleSaleRegistered}
        />

        {/* IA Assistant especializada para Call Center */}
        <AIAssistant 
          context="Call Center Vicidial - Gestión de llamadas y leads con integración real"
          initialMinimized={true}
        />
      </div>
    </>
  );
};

export default CallCenter;
