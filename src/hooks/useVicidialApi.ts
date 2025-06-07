
import { useState, useCallback } from 'react';
import { vicidialApiService, type VicidialApiResponse, type AgentLoginData, type CallData } from '@/services/vicidialApiService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AgentSession {
  isLoggedIn: boolean;
  sessionId?: string;
  campaign?: string;
  phone?: string;
  status: 'LOGGED_OUT' | 'READY' | 'PAUSED' | 'ON_CALL' | 'WRAP_UP';
}

export interface CallSession {
  isActive: boolean;
  leadId?: string;
  phoneNumber?: string;
  startTime?: Date;
  duration: number;
  status: 'IDLE' | 'RINGING' | 'CONNECTED' | 'PAUSED' | 'ENDED';
}

export const useVicidialApi = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [agentSession, setAgentSession] = useState<AgentSession>({
    isLoggedIn: false,
    status: 'LOGGED_OUT'
  });
  const [callSession, setCallSession] = useState<CallSession>({
    isActive: false,
    duration: 0,
    status: 'IDLE'
  });

  const handleApiResponse = useCallback((response: VicidialApiResponse, successMessage?: string) => {
    if (response.result === 'SUCCESS') {
      if (successMessage) {
        toast({
          title: "Éxito",
          description: successMessage,
        });
      }
      return true;
    } else {
      toast({
        title: "Error",
        description: response.error || 'Error en la operación',
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const login = useCallback(async (loginData: AgentLoginData): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: 'Usuario no autenticado',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.agentLogin({
        ...loginData,
        user: user.user_id || user.id || ''
      });

      if (handleApiResponse(response, 'Sesión iniciada correctamente')) {
        setAgentSession({
          isLoggedIn: true,
          sessionId: response.data?.session_id,
          campaign: loginData.campaign,
          phone: loginData.phone_login,
          status: 'READY'
        });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: 'Error al iniciar sesión en Vicidial',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, handleApiResponse, toast]);

  const logout = useCallback(async (): Promise<boolean> => {
    if (!user || !agentSession.isLoggedIn) {
      toast({
        title: "Error",
        description: 'No hay sesión activa para cerrar',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.agentLogout(user.user_id || user.id || '');
      
      if (handleApiResponse(response, 'Sesión cerrada correctamente')) {
        setAgentSession({
          isLoggedIn: false,
          status: 'LOGGED_OUT'
        });
        setCallSession({
          isActive: false,
          duration: 0,
          status: 'IDLE'
        });
        return true;
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: 'Error al cerrar sesión',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, agentSession.isLoggedIn, handleApiResponse, toast]);

  const pause = useCallback(async (pauseCode: string = 'PAUSE'): Promise<boolean> => {
    if (!user || !agentSession.isLoggedIn) {
      toast({
        title: "Error",
        description: 'No hay sesión activa',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.agentPause(user.user_id || user.id || '', pauseCode);
      
      if (handleApiResponse(response, 'Agente pausado')) {
        setAgentSession(prev => ({
          ...prev,
          status: 'PAUSED'
        }));
        return true;
      }
    } catch (error) {
      console.error('Pause error:', error);
      toast({
        title: "Error",
        description: 'Error al pausar agente',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, agentSession.isLoggedIn, handleApiResponse, toast]);

  const resume = useCallback(async (): Promise<boolean> => {
    if (!user || !agentSession.isLoggedIn) {
      toast({
        title: "Error",
        description: 'No hay sesión activa',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.agentStatus(user.user_id || user.id || '', 'READY');
      
      if (handleApiResponse(response, 'Agente activo')) {
        setAgentSession(prev => ({
          ...prev,
          status: 'READY'
        }));
        return true;
      }
    } catch (error) {
      console.error('Resume error:', error);
      toast({
        title: "Error",
        description: 'Error al reanudar agente',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, agentSession.isLoggedIn, handleApiResponse, toast]);

  const dialLead = useCallback(async (callData: CallData): Promise<boolean> => {
    if (!user || !agentSession.isLoggedIn) {
      toast({
        title: "Error",
        description: 'No hay sesión activa',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.dialLead(user.user_id || user.id || '', callData);
      
      if (handleApiResponse(response, 'Llamada iniciada')) {
        setCallSession({
          isActive: true,
          leadId: callData.lead_id,
          phoneNumber: callData.phone_number,
          startTime: new Date(),
          duration: 0,
          status: 'RINGING'
        });
        setAgentSession(prev => ({
          ...prev,
          status: 'ON_CALL'
        }));
        return true;
      }
    } catch (error) {
      console.error('Dial error:', error);
      toast({
        title: "Error",
        description: 'Error al iniciar llamada',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, agentSession.isLoggedIn, handleApiResponse, toast]);

  const hangup = useCallback(async (): Promise<boolean> => {
    if (!user || !callSession.isActive) {
      toast({
        title: "Error",
        description: 'No hay llamada activa',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.hangupCall(user.user_id || user.id || '');
      
      if (handleApiResponse(response, 'Llamada finalizada')) {
        setCallSession({
          isActive: false,
          duration: 0,
          status: 'IDLE'
        });
        setAgentSession(prev => ({
          ...prev,
          status: 'READY'
        }));
        return true;
      }
    } catch (error) {
      console.error('Hangup error:', error);
      toast({
        title: "Error",
        description: 'Error al finalizar llamada',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, callSession.isActive, handleApiResponse, toast]);

  const setDisposition = useCallback(async (disposition: string, comments?: string): Promise<boolean> => {
    if (!user || !agentSession.isLoggedIn) {
      toast({
        title: "Error",
        description: 'No hay sesión activa',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.setDisposition(user.user_id || user.id || '', disposition, comments);
      
      if (handleApiResponse(response, 'Disposición establecida')) {
        return true;
      }
    } catch (error) {
      console.error('Disposition error:', error);
      toast({
        title: "Error",
        description: 'Error al establecer disposición',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, agentSession.isLoggedIn, handleApiResponse, toast]);

  const transferCall = useCallback(async (transferTo: string, transferType: string = 'BLIND'): Promise<boolean> => {
    if (!user || !callSession.isActive) {
      toast({
        title: "Error",
        description: 'No hay llamada activa para transferir',
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    try {
      const response = await vicidialApiService.transferCall(user.user_id || user.id || '', transferTo, transferType);
      
      if (handleApiResponse(response, 'Llamada transferida')) {
        return true;
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Error",
        description: 'Error al transferir llamada',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }, [user, callSession.isActive, handleApiResponse, toast]);

  return {
    loading,
    agentSession,
    callSession,
    login,
    logout,
    pause,
    resume,
    dialLead,
    hangup,
    setDisposition,
    transferCall
  };
};
