
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

export const useVicidial = () => {
  const [leads, setLeads] = useState<VicidialLead[]>([]);
  const [callLogs, setCallLogs] = useState<VicidialCallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      await fetchLeads(); // Refresh leads
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
      
      await fetchCallLogs(); // Refresh call logs
      return true;
    } catch (err) {
      console.error('Error creating call log:', err);
      setError('Error al crear el registro de llamada');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    callLogs,
    loading,
    error,
    fetchLeads,
    fetchCallLogs,
    updateLeadStatus,
    createCallLog,
    refetch: fetchLeads
  };
};
