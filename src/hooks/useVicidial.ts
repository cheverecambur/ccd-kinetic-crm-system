
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VicidialLead {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  status: string;
  lead_score: number;
  city?: string;
  comments?: string;
  created_at: string;
}

export interface VicidialCallLog {
  id: number;
  lead_id: number;
  status: string;
  length_in_sec: number;
  call_date: string;
  user_id: string;
  comments?: string;
}

export interface CallSession {
  isActive: boolean;
  currentLead?: VicidialLead;
  startTime?: Date;
  duration: number;
  status: 'idle' | 'ringing' | 'connected' | 'paused' | 'ended';
  isPaused?: boolean;
  leadName?: string;
  phoneNumber?: string;
}

export interface AgentMetrics {
  callsToday: number;
  talkTime: number;
  leadsContacted: number;
  conversions: number;
  avgCallDuration: number;
  averageCallTime?: string;
}

export const useVicidial = () => {
  const [leads, setLeads] = useState<VicidialLead[]>([]);
  const [callLogs, setCallLogs] = useState<VicidialCallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVicidialConnected, setIsVicidialConnected] = useState(true);
  const [callSession, setCallSession] = useState<CallSession>({
    isActive: false,
    duration: 0,
    status: 'idle',
    isPaused: false
  });
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics>({
    callsToday: 12,
    talkTime: 2840,
    leadsContacted: 15,
    conversions: 3,
    avgCallDuration: 236,
    averageCallTime: '3:56'
  });
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isPausingCall, setIsPausingCall] = useState(false);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching leads:', fetchError);
        throw fetchError;
      }
      
      setLeads(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError('Error al cargar los leads');
      toast({
        title: "Error",
        description: "Error al cargar los leads desde la base de datos",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCallLogs = async (leadId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('call_logs')
        .select('*')
        .order('call_date', { ascending: false });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching call logs:', fetchError);
        throw fetchError;
      }
      
      setCallLogs(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching call logs:', err);
      setError('Error al cargar los registros de llamadas');
      toast({
        title: "Error",
        description: "Error al cargar el historial de llamadas",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, status: string, comments?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          status, 
          comments: comments || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) {
        console.error('Error updating lead status:', updateError);
        throw updateError;
      }
      
      await fetchLeads();
      toast({
        title: "Lead actualizado",
        description: `Estado del lead actualizado a: ${status}`,
      });
      return true;
    } catch (err: any) {
      console.error('Error updating lead status:', err);
      setError('Error al actualizar el estado del lead');
      toast({
        title: "Error",
        description: "Error al actualizar el estado del lead",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createCallLog = async (callData: Partial<VicidialCallLog>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: insertError } = await supabase
        .from('call_logs')
        .insert([{
          ...callData,
          call_date: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error creating call log:', insertError);
        throw insertError;
      }
      
      await fetchCallLogs();
      toast({
        title: "Llamada registrada",
        description: "La llamada ha sido registrada en el historial",
      });
      return true;
    } catch (err: any) {
      console.error('Error creating call log:', err);
      setError('Error al crear el registro de llamada');
      toast({
        title: "Error",
        description: "Error al registrar la llamada",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addLead = async (leadData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          created_at: new Date().toISOString(),
          status: 'NEW',
          lead_score: 50
        }]);

      if (insertError) {
        console.error('Error adding lead:', insertError);
        throw insertError;
      }
      
      await fetchLeads();
      toast({
        title: "Lead agregado",
        description: "El nuevo lead ha sido agregado exitosamente",
      });
      return true;
    } catch (err: any) {
      console.error('Error adding lead:', err);
      setError('Error al agregar el lead');
      toast({
        title: "Error",
        description: "Error al agregar el nuevo lead",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startCall = async (callData: any) => {
    try {
      setIsStartingCall(true);
      console.log('Iniciando llamada:', callData);
      
      // Simular conexión con Vicidial
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCallSession({
        isActive: true,
        startTime: new Date(),
        duration: 0,
        status: 'ringing',
        isPaused: false,
        leadName: callData.leadName,
        phoneNumber: callData.phoneNumber
      });
      
      // Simular conexión de llamada
      setTimeout(() => {
        setCallSession(prev => ({
          ...prev,
          status: 'connected'
        }));
        toast({
          title: "Llamada conectada",
          description: `Conectado con ${callData.leadName}`,
        });
      }, 3000);
      
      toast({
        title: "Llamada iniciada",
        description: `Marcando a ${callData.phoneNumber}`,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error starting call:', err);
      setError('Error al iniciar la llamada');
      toast({
        title: "Error",
        description: "Error al iniciar la llamada",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsStartingCall(false);
    }
  };

  const endCall = async () => {
    try {
      setIsEndingCall(true);
      
      const callDuration = callSession.duration;
      const leadName = callSession.leadName;
      
      setCallSession(prev => ({
        ...prev,
        status: 'ended'
      }));
      
      // Actualizar métricas
      setAgentMetrics(prev => ({
        ...prev,
        callsToday: prev.callsToday + 1,
        talkTime: prev.talkTime + callDuration
      }));
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeout(() => {
        setCallSession({
          isActive: false,
          duration: 0,
          status: 'idle',
          isPaused: false
        });
        setIsEndingCall(false);
      }, 500);
      
      toast({
        title: "Llamada finalizada",
        description: `Llamada con ${leadName} finalizada. Duración: ${formatCallDuration(callDuration)}`,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error ending call:', err);
      setError('Error al finalizar la llamada');
      toast({
        title: "Error",
        description: "Error al finalizar la llamada",
        variant: "destructive",
      });
      setIsEndingCall(false);
      return false;
    }
  };

  const pauseCall = async (shouldPause?: boolean) => {
    try {
      setIsPausingCall(true);
      
      const newStatus = callSession.isPaused ? 'connected' : 'paused';
      const newPauseState = !callSession.isPaused;
      
      setCallSession(prev => ({
        ...prev,
        status: newStatus as any,
        isPaused: newPauseState
      }));
      
      toast({
        title: newPauseState ? "Llamada pausada" : "Llamada reanudada",
        description: newPauseState ? "La llamada ha sido pausada" : "La llamada ha sido reanudada",
      });
      
      setTimeout(() => {
        setIsPausingCall(false);
      }, 500);
      
      return true;
    } catch (err: any) {
      console.error('Error pausing call:', err);
      setError('Error al pausar la llamada');
      toast({
        title: "Error",
        description: "Error al pausar/reanudar la llamada",
        variant: "destructive",
      });
      setIsPausingCall(false);
      return false;
    }
  };

  const setDisposition = async (disposition: string | object) => {
    try {
      console.log('Setting disposition:', disposition);
      
      // Crear registro en call_logs
      const callLog = {
        lead_id: callSession.currentLead?.id || null,
        status: typeof disposition === 'string' ? disposition : (disposition as any).disposition,
        length_in_sec: callSession.duration,
        user_id: 'current_user',
        comments: typeof disposition === 'object' ? (disposition as any).comments : ''
      };
      
      await createCallLog(callLog);
      
      toast({
        title: "Disposición guardada",
        description: "El resultado de la llamada ha sido registrado",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error setting disposition:', err);
      toast({
        title: "Error",
        description: "Error al guardar la disposición",
        variant: "destructive",
      });
      return false;
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Effect para cargar datos iniciales
  useEffect(() => {
    fetchLeads();
  }, []);

  // Effect para el timer de la llamada
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callSession.isActive && callSession.status === 'connected' && !callSession.isPaused) {
      interval = setInterval(() => {
        setCallSession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callSession.isActive, callSession.status, callSession.isPaused]);

  return {
    leads,
    callLogs,
    loading,
    error,
    isVicidialConnected,
    callSession,
    agentMetrics,
    isStartingCall,
    isEndingCall,
    isPausingCall,
    fetchLeads,
    fetchCallLogs,
    updateLeadStatus,
    createCallLog,
    addLead,
    startCall,
    endCall,
    pauseCall,
    setDisposition,
    formatCallDuration,
    refetch: fetchLeads
  };
};
