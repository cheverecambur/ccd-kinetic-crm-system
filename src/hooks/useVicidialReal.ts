
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  vicidialRealApi, 
  VicidialApiResponse, 
  CallData, 
  DispositionData, 
  LeadData 
} from '@/services/vicidialRealApiService';

export interface AgentSession {
  isLoggedIn: boolean;
  sessionId?: string;
  campaign?: string;
  phone?: string;
  status: 'LOGGED_OUT' | 'READY' | 'PAUSED' | 'ON_CALL' | 'WRAP_UP';
  lastActivity: Date;
}

export interface CallSession {
  isActive: boolean;
  leadId?: string;
  leadName?: string;
  phoneNumber?: string;
  startTime?: Date;
  duration: number;
  status: 'IDLE' | 'RINGING' | 'CONNECTED' | 'PAUSED' | 'ENDED';
  isPaused: boolean;
  isRecording: boolean;
}

export interface AgentMetrics {
  callsToday: number;
  conversions: number;
  averageCallTime: string;
  talkTime: number;
  pauseTime: number;
  loginTime: string;
  lastCallTime: string;
}

export const useVicidialReal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados principales
  const [isVicidialConnected, setIsVicidialConnected] = useState(false);
  const [agentSession, setAgentSession] = useState<AgentSession>({
    isLoggedIn: false,
    status: 'LOGGED_OUT',
    lastActivity: new Date()
  });
  
  const [callSession, setCallSession] = useState<CallSession>({
    isActive: false,
    duration: 0,
    status: 'IDLE',
    isPaused: false,
    isRecording: false
  });

  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics>({
    callsToday: 0,
    conversions: 0,
    averageCallTime: '0:00',
    talkTime: 0,
    pauseTime: 0,
    loginTime: '',
    lastCallTime: ''
  });

  // Estados de carga
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isPausingCall, setIsPausingCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Referencias para timers
  const callTimerRef = useRef<NodeJS.Timeout>();
  const connectionCheckRef = useRef<NodeJS.Timeout>();

  // Función para manejar respuestas de la API
  const handleApiResponse = useCallback((response: VicidialApiResponse, successMessage?: string): boolean => {
    if (vicidialRealApi.isSuccess(response)) {
      if (successMessage) {
        toast({
          title: "Éxito",
          description: successMessage,
        });
      }
      return true;
    } else {
      const errorMessage = vicidialRealApi.getErrorMessage(response);
      toast({
        title: "Error de Vicidial",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Verificar conexión con Vicidial
  const checkVicidialConnection = useCallback(async () => {
    try {
      const isConnected = await vicidialRealApi.testConnection();
      setIsVicidialConnected(isConnected);
      return isConnected;
    } catch (error) {
      console.error('Error checking Vicidial connection:', error);
      setIsVicidialConnected(false);
      return false;
    }
  }, []);

  // Inicializar conexión
  useEffect(() => {
    checkVicidialConnection();
    
    // Verificar conexión cada 30 segundos
    connectionCheckRef.current = setInterval(checkVicidialConnection, 30000);
    
    return () => {
      if (connectionCheckRef.current) {
        clearInterval(connectionCheckRef.current);
      }
    };
  }, [checkVicidialConnection]);

  // Timer de duración de llamada
  useEffect(() => {
    if (callSession.isActive && callSession.status === 'CONNECTED' && !callSession.isPaused) {
      callTimerRef.current = setInterval(() => {
        setCallSession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callSession.isActive, callSession.status, callSession.isPaused]);

  // Formatear duración de llamada
  const formatCallDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Obtener nombre de usuario del agente
  const getAgentUser = useCallback((): string => {
    return user?.user_id || user?.id || user?.email?.split('@')[0] || 'agent';
  }, [user]);

  // === FUNCIONES PRINCIPALES ===

  // Iniciar llamada
  const startCall = useCallback(async (callData: {
    phoneNumber: string;
    phoneCode?: string;
    leadId?: string;
    leadName?: string;
  }) => {
    if (!isVicidialConnected) {
      toast({
        title: "Error",
        description: "No hay conexión con Vicidial",
        variant: "destructive",
      });
      return false;
    }

    setIsStartingCall(true);
    try {
      const agent_user = getAgentUser();
      const vicidialCallData: CallData = {
        phone_number: callData.phoneNumber,
        phone_code: callData.phoneCode || '57',
        lead_id: callData.leadId,
        search: 'YES',
        preview: 'NO',
        focus: 'YES'
      };

      const response = await vicidialRealApi.dialManual(agent_user, vicidialCallData);
      
      if (handleApiResponse(response, 'Llamada iniciada')) {
        setCallSession({
          isActive: true,
          leadId: callData.leadId,
          leadName: callData.leadName,
          phoneNumber: callData.phoneNumber,
          startTime: new Date(),
          duration: 0,
          status: 'RINGING',
          isPaused: false,
          isRecording: false
        });

        setAgentSession(prev => ({
          ...prev,
          status: 'ON_CALL',
          lastActivity: new Date()
        }));

        // Simular cambio a CONNECTED después de unos segundos
        setTimeout(() => {
          setCallSession(prev => ({
            ...prev,
            status: 'CONNECTED'
          }));
        }, 3000);

        return true;
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Error",
        description: "Error al iniciar la llamada",
        variant: "destructive",
      });
    } finally {
      setIsStartingCall(false);
    }
    return false;
  }, [isVicidialConnected, getAgentUser, handleApiResponse, toast]);

  // Finalizar llamada
  const endCall = useCallback(async () => {
    if (!callSession.isActive) {
      toast({
        title: "Error",
        description: "No hay llamada activa",
        variant: "destructive",
      });
      return false;
    }

    setIsEndingCall(true);
    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.hangupCall(agent_user);
      
      if (handleApiResponse(response, 'Llamada finalizada')) {
        setCallSession(prev => ({
          ...prev,
          status: 'ENDED'
        }));

        // Actualizar métricas
        setAgentMetrics(prev => ({
          ...prev,
          callsToday: prev.callsToday + 1,
          talkTime: prev.talkTime + callSession.duration,
          lastCallTime: formatCallDuration(callSession.duration)
        }));

        return true;
      }
    } catch (error) {
      console.error('Error ending call:', error);
      toast({
        title: "Error",
        description: "Error al finalizar la llamada",
        variant: "destructive",
      });
    } finally {
      setIsEndingCall(false);
    }
    return false;
  }, [callSession.isActive, callSession.duration, getAgentUser, handleApiResponse, formatCallDuration, toast]);

  // Pausar/Reanudar llamada
  const pauseCall = useCallback(async (pause: boolean) => {
    if (!callSession.isActive) {
      toast({
        title: "Error",
        description: "No hay llamada activa",
        variant: "destructive",
      });
      return false;
    }

    setIsPausingCall(true);
    try {
      const agent_user = getAgentUser();
      const action = pause ? 'PAUSE' : 'RESUME';
      const response = await vicidialRealApi.pauseAgent(agent_user, action);
      
      if (handleApiResponse(response, pause ? 'Llamada pausada' : 'Llamada reanudada')) {
        setCallSession(prev => ({
          ...prev,
          isPaused: pause,
          status: pause ? 'PAUSED' : 'CONNECTED'
        }));

        setAgentSession(prev => ({
          ...prev,
          status: pause ? 'PAUSED' : 'ON_CALL',
          lastActivity: new Date()
        }));

        return true;
      }
    } catch (error) {
      console.error('Error pausing call:', error);
      toast({
        title: "Error",
        description: "Error al pausar/reanudar la llamada",
        variant: "destructive",
      });
    } finally {
      setIsPausingCall(false);
    }
    return false;
  }, [callSession.isActive, getAgentUser, handleApiResponse, toast]);

  // Establecer disposición
  const setDisposition = useCallback(async (dispositionData: DispositionData) => {
    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.setDisposition(agent_user, dispositionData);
      
      if (handleApiResponse(response, 'Disposición establecida')) {
        // Actualizar métricas si es una venta
        if (dispositionData.value === 'SALE') {
          setAgentMetrics(prev => ({
            ...prev,
            conversions: prev.conversions + 1
          }));
        }

        // Limpiar sesión de llamada
        setCallSession({
          isActive: false,
          duration: 0,
          status: 'IDLE',
          isPaused: false,
          isRecording: false
        });

        setAgentSession(prev => ({
          ...prev,
          status: 'READY',
          lastActivity: new Date()
        }));

        return true;
      }
    } catch (error) {
      console.error('Error setting disposition:', error);
      toast({
        title: "Error",
        description: "Error al establecer la disposición",
        variant: "destructive",
      });
    }
    return false;
  }, [getAgentUser, handleApiResponse, toast]);

  // Agregar lead
  const addLead = useCallback(async (leadData: LeadData) => {
    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.addLead(agent_user, leadData);
      
      if (handleApiResponse(response, 'Lead agregado')) {
        return true;
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error",
        description: "Error al agregar el lead",
        variant: "destructive",
      });
    }
    return false;
  }, [getAgentUser, handleApiResponse, toast]);

  // Transferir llamada
  const transferCall = useCallback(async (phoneNumber: string) => {
    if (!callSession.isActive) {
      toast({
        title: "Error",
        description: "No hay llamada activa para transferir",
        variant: "destructive",
      });
      return false;
    }

    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.blindTransfer(agent_user, phoneNumber);
      
      if (handleApiResponse(response, 'Llamada transferida')) {
        setCallSession(prev => ({
          ...prev,
          status: 'ENDED'
        }));
        return true;
      }
    } catch (error) {
      console.error('Error transferring call:', error);
      toast({
        title: "Error",
        description: "Error al transferir la llamada",
        variant: "destructive",
      });
    }
    return false;
  }, [callSession.isActive, getAgentUser, handleApiResponse, toast]);

  // Iniciar grabación
  const startRecording = useCallback(async () => {
    if (!callSession.isActive) {
      toast({
        title: "Error",
        description: "No hay llamada activa para grabar",
        variant: "destructive",
      });
      return false;
    }

    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.startRecording(agent_user);
      
      if (handleApiResponse(response, 'Grabación iniciada')) {
        setCallSession(prev => ({
          ...prev,
          isRecording: true
        }));
        return true;
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Error al iniciar la grabación",
        variant: "destructive",
      });
    }
    return false;
  }, [callSession.isActive, getAgentUser, handleApiResponse, toast]);

  // Detener grabación
  const stopRecording = useCallback(async () => {
    try {
      const agent_user = getAgentUser();
      const response = await vicidialRealApi.stopRecording(agent_user);
      
      if (handleApiResponse(response, 'Grabación detenida')) {
        setCallSession(prev => ({
          ...prev,
          isRecording: false
        }));
        return true;
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast({
        title: "Error",
        description: "Error al detener la grabación",
        variant: "destructive",
      });
    }
    return false;
  }, [getAgentUser, handleApiResponse, toast]);

  return {
    // Estados
    isVicidialConnected,
    agentSession,
    callSession,
    agentMetrics,
    
    // Estados de carga
    isStartingCall,
    isEndingCall,
    isPausingCall,
    isConnecting,
    
    // Funciones principales
    startCall,
    endCall,
    pauseCall,
    setDisposition,
    addLead,
    transferCall,
    startRecording,
    stopRecording,
    
    // Utilidades
    formatCallDuration,
    checkVicidialConnection,
    
    // API directa (para funciones avanzadas)
    vicidialApi: vicidialRealApi
  };
};
