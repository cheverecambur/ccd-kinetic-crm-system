
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff,
  Play,
  Pause,
  Square,
  Timer,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Target,
  TrendingUp,
  Activity,
  HeadphonesIcon,
  User,
  Calendar,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  extension: string;
  status: 'available' | 'incall' | 'paused' | 'offline';
  currentCallDuration: number;
  dailyCalls: number;
  dailyConversions: number;
  pauseReason?: string;
  avatar: string;
}

interface CallSession {
  id: string;
  leadId: number;
  leadName: string;
  phoneNumber: string;
  status: 'dialing' | 'connected' | 'onhold' | 'completed';
  duration: number;
  startTime: Date;
  script?: string;
  notes: string;
}

interface Disposition {
  code: string;
  name: string;
  category: string;
  requiresCallback: boolean;
  requiresComment: boolean;
}

const CallCenter = () => {
  const [currentAgent, setCurrentAgent] = useState<Agent>({
    id: 'agent1',
    name: 'Carlos Rodríguez',
    extension: '1001',
    status: 'available',
    currentCallDuration: 0,
    dailyCalls: 12,
    dailyConversions: 3,
    avatar: 'CR'
  });

  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [nextLead, setNextLead] = useState(null);
  const [pauseReason, setPauseReason] = useState('');
  const { toast } = useToast();

  const dispositions: Disposition[] = [
    { code: 'CONTACT', name: 'Contactado', category: 'SUCCESS', requiresCallback: false, requiresComment: true },
    { code: 'NA', name: 'No Contesta', category: 'NO_CONTACT', requiresCallback: true, requiresComment: false },
    { code: 'BUSY', name: 'Ocupado', category: 'NO_CONTACT', requiresCallback: true, requiresComment: false },
    { code: 'ANSWM', name: 'Contestadora', category: 'NO_CONTACT', requiresCallback: true, requiresComment: false },
    { code: 'CALLBACK', name: 'Callback', category: 'CALLBACK', requiresCallback: true, requiresComment: true },
    { code: 'NI', name: 'No Interesado', category: 'NO_SALE', requiresCallback: false, requiresComment: true },
    { code: 'SALE', name: 'Venta', category: 'SALE', requiresCallback: false, requiresComment: true },
    { code: 'DNC', name: 'No Molestar', category: 'DNC', requiresCallback: false, requiresComment: true },
    { code: 'WRONG', name: 'Número Equivocado', category: 'INVALID', requiresCallback: false, requiresComment: false },
    { code: 'DC', name: 'Desconectado', category: 'INVALID', requiresCallback: false, requiresComment: false }
  ];

  const pauseReasons = [
    'Descanso',
    'Almuerzo',
    'Capacitación',
    'Reunión',
    'Problema Técnico',
    'Personal'
  ];

  // Timer para llamada actual
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCall && currentCall.status === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (lead?: any) => {
    const mockLead = lead || {
      id: 1,
      name: 'María González',
      phone: '3001234567',
      course: 'Contabilidad Básica',
      score: 85,
      source: 'Facebook Ads'
    };

    const newCall: CallSession = {
      id: `call_${Date.now()}`,
      leadId: mockLead.id,
      leadName: mockLead.name,
      phoneNumber: mockLead.phone,
      status: 'dialing',
      duration: 0,
      startTime: new Date(),
      notes: '',
      script: `Hola ${mockLead.name}, soy ${currentAgent.name} de CCD Capacitación. Te contacto por tu interés en nuestro curso de ${mockLead.course}.`
    };

    setCurrentCall(newCall);
    setCallTimer(0);
    setCallNotes('');
    setSelectedDisposition('');
    
    // Simular conexión después de 3 segundos
    setTimeout(() => {
      if (newCall.status === 'dialing') {
        setCurrentCall(prev => prev ? { ...prev, status: 'connected' } : null);
        setIsRecording(true);
        toast({
          title: "Llamada conectada",
          description: `Conectado con ${mockLead.name}`,
        });
      }
    }, 3000);

    setCurrentAgent(prev => ({ ...prev, status: 'incall' }));
  };

  const endCall = () => {
    if (currentCall) {
      setCurrentCall(prev => prev ? { ...prev, status: 'completed' } : null);
      setIsRecording(false);
      setCurrentAgent(prev => ({ 
        ...prev, 
        status: 'available',
        dailyCalls: prev.dailyCalls + 1
      }));
      
      toast({
        title: "Llamada finalizada",
        description: `Duración: ${formatTime(callTimer)}`,
      });
    }
  };

  const submitDisposition = () => {
    if (!selectedDisposition) {
      toast({
        title: "Error",
        description: "Debes seleccionar una tipificación",
        variant: "destructive",
      });
      return;
    }

    const disposition = dispositions.find(d => d.code === selectedDisposition);
    if (disposition?.requiresComment && !callNotes.trim()) {
      toast({
        title: "Error",
        description: "Esta tipificación requiere comentarios",
        variant: "destructive",
      });
      return;
    }

    // Aquí se guardaría la tipificación en la base de datos
    console.log('Submitting disposition:', {
      callId: currentCall?.id,
      disposition: selectedDisposition,
      notes: callNotes,
      duration: callTimer
    });

    if (selectedDisposition === 'SALE') {
      setCurrentAgent(prev => ({ 
        ...prev, 
        dailyConversions: prev.dailyConversions + 1
      }));
    }

    setCurrentCall(null);
    setCallTimer(0);
    
    toast({
      title: "Tipificación guardada",
      description: `Llamada tipificada como: ${disposition?.name}`,
    });
  };

  const togglePause = () => {
    if (currentAgent.status === 'paused') {
      setCurrentAgent(prev => ({ ...prev, status: 'available', pauseReason: undefined }));
    } else {
      setCurrentAgent(prev => ({ ...prev, status: 'paused', pauseReason: pauseReason || 'Descanso' }));
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      incall: 'bg-blue-500',
      paused: 'bg-yellow-500',
      offline: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts = {
      available: 'Disponible',
      incall: 'En Llamada',
      paused: 'En Pausa',
      offline: 'Desconectado'
    };
    return texts[status as keyof typeof texts] || 'Desconocido';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contact Center - Vicidial</h1>
          <p className="text-gray-600">Panel de Asesor</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={`${getStatusColor(currentAgent.status)} text-white`}>
            {getStatusText(currentAgent.status)}
          </Badge>
          {currentAgent.status === 'paused' && currentAgent.pauseReason && (
            <span className="text-sm text-gray-600">({currentAgent.pauseReason})</span>
          )}
        </div>
      </div>

      {/* Panel principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de llamada */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {currentCall ? 'Llamada en Curso' : 'Esperando Llamada'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentCall ? (
                <>
                  {/* Información del lead */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{currentCall.leadName}</h3>
                        <p className="text-gray-600">{currentCall.phoneNumber}</p>
                      </div>
                      <Badge variant={currentCall.status === 'connected' ? 'default' : 'secondary'}>
                        {currentCall.status === 'dialing' ? 'Marcando...' : 
                         currentCall.status === 'connected' ? 'Conectado' : 'Completado'}
                      </Badge>
                    </div>
                    
                    {/* Timer de llamada */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-3xl font-mono font-bold">
                        {formatTime(callTimer)}
                      </div>
                    </div>

                    {/* Controles de llamada */}
                    <div className="flex justify-center gap-3">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        disabled={currentCall.status !== 'connected'}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={endCall}
                        disabled={currentCall.status === 'dialing'}
                      >
                        <PhoneOff className="h-4 w-4 mr-2" />
                        Colgar
                      </Button>
                      
                      <Button
                        variant={isRecording ? "default" : "outline"}
                        size="sm"
                        disabled={currentCall.status !== 'connected'}
                      >
                        {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Script sugerido */}
                  {currentCall.script && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Script Sugerido:</h4>
                      <p className="text-sm text-gray-700">{currentCall.script}</p>
                    </div>
                  )}

                  {/* Tipificación */}
                  {currentCall.status === 'completed' && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Tipificación de Llamada</h4>
                      
                      <Select value={selectedDisposition} onValueChange={setSelectedDisposition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipificación" />
                        </SelectTrigger>
                        <SelectContent>
                          {dispositions.map((disp) => (
                            <SelectItem key={disp.code} value={disp.code}>
                              {disp.name} {disp.requiresCallback && '(Callback)'} {disp.requiresComment && '(Comentario)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Textarea
                        placeholder="Comentarios de la llamada..."
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                        rows={3}
                      />

                      <Button onClick={submitDisposition} className="w-full">
                        Guardar Tipificación
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* Estado sin llamada */
                <div className="text-center py-12">
                  <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Listo para recibir llamadas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Haz clic en "Iniciar Llamada" para marcar al siguiente lead
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => startCall()} 
                      size="lg"
                      disabled={currentAgent.status !== 'available'}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Iniciar Llamada
                    </Button>
                    
                    {currentAgent.status === 'available' ? (
                      <div>
                        <Select value={pauseReason} onValueChange={setPauseReason}>
                          <SelectTrigger className="w-full mb-2">
                            <SelectValue placeholder="Motivo de pausa" />
                          </SelectTrigger>
                          <SelectContent>
                            {pauseReasons.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          onClick={togglePause}
                          className="w-full"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Entrar en Pausa
                        </Button>
                      </div>
                    ) : currentAgent.status === 'paused' ? (
                      <Button 
                        variant="outline" 
                        onClick={togglePause}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Salir de Pausa
                      </Button>
                    ) : null}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Información del asesor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mi Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{currentAgent.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{currentAgent.name}</h4>
                  <p className="text-sm text-gray-600">Ext. {currentAgent.extension}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentAgent.dailyCalls}
                  </div>
                  <div className="text-sm text-gray-600">Llamadas Hoy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentAgent.dailyConversions}
                  </div>
                  <div className="text-sm text-gray-600">Conversiones</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Meta Diaria</span>
                  <span>{currentAgent.dailyCalls}/25</span>
                </div>
                <Progress value={(currentAgent.dailyCalls / 25) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Meta Conversiones</span>
                  <span>{currentAgent.dailyConversions}/5</span>
                </div>
                <Progress value={(currentAgent.dailyConversions / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Próximo lead */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Próximo Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Ana López</h4>
                  <p className="text-sm text-gray-600">3152468135</p>
                </div>
                <div className="text-sm">
                  <p><strong>Curso:</strong> Marketing Digital</p>
                  <p><strong>Score:</strong> <span className="text-green-600">90</span></p>
                  <p><strong>Fuente:</strong> Google Ads</p>
                </div>
                <Button size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Callbacks programados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Callbacks Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-2 border-blue-500 pl-3">
                  <h5 className="font-medium">Carlos Rodríguez</h5>
                  <p className="text-sm text-gray-600">15:30 - Excel Avanzado</p>
                </div>
                <div className="border-l-2 border-yellow-500 pl-3">
                  <h5 className="font-medium">María Gómez</h5>
                  <p className="text-sm text-gray-600">16:00 - Contabilidad</p>
                </div>
                <div className="border-l-2 border-green-500 pl-3">
                  <h5 className="font-medium">Luis Martínez</h5>
                  <p className="text-sm text-gray-600">17:15 - Nómina</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Conectado</p>
                <p className="text-xl font-bold">7h 45m</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className="text-xl font-bold">8:30</p>
              </div>
              <Timer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa Contacto</p>
                <p className="text-xl font-bold">68%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa Conversión</p>
                <p className="text-xl font-bold">25%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CallCenter;
