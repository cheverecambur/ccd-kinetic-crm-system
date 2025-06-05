import { supabase } from '@/lib/supabaseClient';

const VICIDIAL_URL = process.env.NEXT_PUBLIC_VICIDIAL_URL;

export interface AgentLoginData {
  user: string;
  pass: string;
  campaign: string;
  phone_login: string;
  phone_pass: string;
}

export interface CallData {
  phone_number: string;
  lead_id?: string;
}

export interface VicidialApiResponse {
  result: 'SUCCESS' | 'ERROR';
  data?: any;
  error?: string;
  session_id?: string;
  uniqueid?: string;
}

export const vicidialApiService = {
  // Agent Login
  agentLogin: async (data: AgentLoginData): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_login',
      user: data.user,
      pass: data.pass,
      campaign: data.campaign,
      phone_login: data.phone_login,
      phone_pass: data.phone_pass,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      // Store session data
      if (result.result === 'SUCCESS') {
        await supabase.from('agent_sessions').insert({
          user_id: data.user,
          session_id: result.session_id || `session_${Date.now()}`,
          phone: data.phone_login,
          campaign_id: data.campaign,
          status: 'READY'
        });
        
        // Initialize agent stats if not exists
        await supabase.from('agent_stats').upsert({
          user_id: data.user,
          status: 'READY',
          updated_at: new Date().toISOString()
        });
      }
      
      return result;
    } catch (error) {
      console.error('Agent login error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Agent Logout
  agentLogout: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_logout',
      user: user,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      // Update session data
      await supabase
        .from('agent_sessions')
        .update({ 
          logout_time: new Date().toISOString(),
          is_active: false,
          status: 'LOGGED_OUT'
        })
        .eq('user_id', user)
        .eq('is_active', true);
      
      return result;
    } catch (error) {
      console.error('Agent logout error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Agent Pause
  agentPause: async (user: string, pauseCode: string = 'PAUSE'): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_pause',
      user: user,
      pause_code: pauseCode,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      // Record pause in database
      await supabase.from('agent_pauses').insert({
        user_id: user,
        pause_code: pauseCode,
        start_time: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      console.error('Agent pause error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Agent Status
  agentStatus: async (user: string, status: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_status',
      user: user,
      status: status,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Agent status error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Dial Lead
  dialLead: async (user: string, callData: CallData): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_dial',
      user: user,
      phone_number: callData.phone_number,
      search: 'YES',
      preview: 'NO',
      focus: 'YES',
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    if (callData.lead_id) {
      params.append('lead_id', callData.lead_id);
    }

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      // Record call in database
      if (result.result === 'SUCCESS') {
        await supabase.from('active_calls').insert({
          user_id: user,
          lead_id: callData.lead_id ? parseInt(callData.lead_id) : null,
          phone_number: callData.phone_number,
          uniqueid: result.uniqueid || `call_${Date.now()}`,
          status: 'RINGING'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Dial lead error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Hangup Call
  hangupCall: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_hangup',
      user: user,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      // Update call in database
      await supabase
        .from('active_calls')
        .update({ 
          end_time: new Date().toISOString(),
          status: 'ENDED'
        })
        .eq('user_id', user)
        .eq('status', 'CONNECTED');
      
      return result;
    } catch (error) {
      console.error('Hangup call error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Set Disposition
  setDisposition: async (user: string, disposition: string, comments?: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_status',
      user: user,
      status: disposition,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    if (comments) {
      params.append('comments', comments);
    }

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Set disposition error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Transfer Call
  transferCall: async (user: string, transferTo: string, transferType: string = 'BLIND'): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_transfer',
      user: user,
      transfer_to: transferTo,
      transfer_type: transferType,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Transfer call error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  },

  // Get Agent Info
  getAgentInfo: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_get_agent_info',
      user: user,
      source: 'ccd_crm',
      version: '2.14',
      format: 'json'
    });

    try {
      const response = await fetch(`${VICIDIAL_URL}/agc/api.php?${params}`);
      const result = await response.json();
      
      return result;
    } catch (error) {
      console.error('Get agent info error:', error);
      return { result: 'ERROR', error: 'Connection failed' };
    }
  }
};
