
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export interface AgentMetrics {
  callsToday: number;
  talkTime: number;
  leadsContacted: number;
  conversions: number;
  avgCallDuration: number;
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
    status: 'idle'
  });
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics>({
    callsToday: 0,
    talkTime: 0,
    leadsContacted: 0,
    conversions: 0,
    avgCallDuration: 0
  });
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isPausingCall, setIsPausingCall] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Error al cargar los leads');
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

      if (fetchError) throw fetchError;
      
      setCallLogs(data || []);
    } catch (err) {
      console.error('Error fetching call logs:', err);
      setError('Error al cargar los registros de llamadas');
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

      if (updateError) throw updateError;
      
      await fetchLeads();
      return true;
    } catch (err) {
      console.error('Error updating lead status:', err);
      setError('Error al actualizar el estado del lead');
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

      if (insertError) throw insertError;
      
      await fetchCallLogs();
      return true;
    } catch (err) {
      console.error('Error creating call log:', err);
      setError('Error al crear el registro de llamada');
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

      if (insertError) throw insertError;
      
      await fetchLeads();
      return true;
    } catch (err) {
      console.error('Error adding lead:', err);
      setError('Error al agregar el lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const startCall = async (callData: any) => {
    try {
      setIsStartingCall(true);
      console.log('Iniciando llamada:', callData);
      
      setCallSession({
        isActive: true,
        startTime: new Date(),
        duration: 0,
        status: 'ringing'
      });
      
      // Simular conexión de llamada
      setTimeout(() => {
        setCallSession(prev => ({
          ...prev,
          status: 'connected'
        }));
        setIsStartingCall(false);
      }, 2000);
      
      return true;
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Error al iniciar la llamada');
      setIsStartingCall(false);
      return false;
    }
  };

  const endCall = async () => {
    try {
      setIsEndingCall(true);
      
      setCallSession(prev => ({
        ...prev,
        status: 'ended',
        isActive: false
      }));
      
      // Actualizar métricas
      setAgentMetrics(prev => ({
        ...prev,
        callsToday: prev.callsToday + 1
      }));
      
      setTimeout(() => {
        setCallSession({
          isActive: false,
          duration: 0,
          status: 'idle'
        });
        setIsEndingCall(false);
      }, 1000);
      
      return true;
    } catch (err) {
      console.error('Error ending call:', err);
      setError('Error al finalizar la llamada');
      setIsEndingCall(false);
      return false;
    }
  };

  const pauseCall = async () => {
    try {
      setIsPausingCall(true);
      
      setCallSession(prev => ({
        ...prev,
        status: prev.status === 'paused' ? 'connected' : 'paused'
      }));
      
      setTimeout(() => {
        setIsPausingCall(false);
      }, 500);
      
      return true;
    } catch (err) {
      console.error('Error pausing call:', err);
      setError('Error al pausar la llamada');
      setIsPausingCall(false);
      return false;
    }
  };

  const setDisposition = async (disposition: string) => {
    try {
      console.log('Setting disposition:', disposition);
      return true;
    } catch (err) {
      console.error('Error setting disposition:', err);
      return false;
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
