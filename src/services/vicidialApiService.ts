
import { supabase } from '@/integrations/supabase/client';

// Configuración de Vicidial desde variables de entorno o configuración predeterminada
const VICIDIAL_CONFIG = {
  url: process.env.NEXT_PUBLIC_VICIDIAL_URL || 'http://localhost/vicidial',
  version: '2.14',
  source: 'ccd_crm',
  format: 'json'
};

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

// Función helper para verificar la conectividad de Vicidial
const checkVicidialConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${VICIDIAL_CONFIG.url}/agc/api.php?function=external_get_agent_info&user=test&format=json`, {
      method: 'GET',
      timeout: 5000
    } as any);
    return response.ok;
  } catch (error) {
    console.warn('Vicidial connection check failed:', error);
    return false;
  }
};

// Función helper para manejar errores de API
const handleApiError = (error: any, operation: string): VicidialApiResponse => {
  console.error(`${operation} error:`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return { 
      result: 'ERROR', 
      error: 'No se puede conectar con Vicidial. Verifique la configuración de red.' 
    };
  }
  
  if (error.name === 'AbortError') {
    return { 
      result: 'ERROR', 
      error: 'Tiempo de espera agotado. El servidor Vicidial no responde.' 
    };
  }
  
  return { 
    result: 'ERROR', 
    error: `Error en ${operation}: ${error.message || 'Error desconocido'}` 
  };
};

// Función helper para realizar llamadas a la API con timeout
const makeApiCall = async (params: URLSearchParams, operation: string): Promise<VicidialApiResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
    
    const response = await fetch(`${VICIDIAL_CONFIG.url}/agc/api.php?${params}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    return handleApiError(error, operation);
  }
};

export const vicidialApiService = {
  // Verificar conectividad
  checkConnection: checkVicidialConnection,

  // Agent Login
  agentLogin: async (data: AgentLoginData): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_login',
      user: data.user,
      pass: data.pass,
      campaign: data.campaign,
      phone_login: data.phone_login,
      phone_pass: data.phone_pass,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      const result = await makeApiCall(params, 'Agent Login');
      
      // Store session data on success
      if (result.result === 'SUCCESS') {
        try {
          await supabase.from('agent_sessions').insert({
            user_id: data.user,
            session_id: result.session_id || `session_${Date.now()}`,
            phone: data.phone_login,
            campaign_id: data.campaign,
            status: 'READY',
            login_time: new Date().toISOString()
          });
          
          // Initialize or update agent stats
          await supabase.from('agent_stats').upsert({
            user_id: data.user,
            status: 'READY',
            updated_at: new Date().toISOString()
          });
        } catch (dbError) {
          console.warn('Error storing session data:', dbError);
          // No fallar el login por error de BD local
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error, 'Agent Login');
    }
  },

  // Agent Logout
  agentLogout: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_logout',
      user: user,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      const result = await makeApiCall(params, 'Agent Logout');
      
      // Update session data on success
      if (result.result === 'SUCCESS') {
        try {
          await supabase
            .from('agent_sessions')
            .update({ 
              logout_time: new Date().toISOString(),
              is_active: false,
              status: 'LOGGED_OUT'
            })
            .eq('user_id', user)
            .eq('is_active', true);
        } catch (dbError) {
          console.warn('Error updating session data:', dbError);
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error, 'Agent Logout');
    }
  },

  // Agent Pause
  agentPause: async (user: string, pauseCode: string = 'PAUSE'): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_pause',
      user: user,
      pause_code: pauseCode,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      const result = await makeApiCall(params, 'Agent Pause');
      
      // Record pause in database on success
      if (result.result === 'SUCCESS') {
        try {
          await supabase.from('agent_pauses').insert({
            user_id: user,
            pause_code: pauseCode,
            start_time: new Date().toISOString()
          });
        } catch (dbError) {
          console.warn('Error recording pause:', dbError);
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error, 'Agent Pause');
    }
  },

  // Agent Status
  agentStatus: async (user: string, status: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_status',
      user: user,
      status: status,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      return await makeApiCall(params, 'Agent Status');
    } catch (error) {
      return handleApiError(error, 'Agent Status');
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
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    if (callData.lead_id) {
      params.append('lead_id', callData.lead_id);
    }

    try {
      const result = await makeApiCall(params, 'Dial Lead');
      
      // Record call in database on success
      if (result.result === 'SUCCESS') {
        try {
          await supabase.from('active_calls').insert({
            user_id: user,
            lead_id: callData.lead_id ? parseInt(callData.lead_id) : null,
            phone_number: callData.phone_number,
            uniqueid: result.uniqueid || `call_${Date.now()}`,
            status: 'RINGING',
            start_time: new Date().toISOString()
          });
        } catch (dbError) {
          console.warn('Error recording call:', dbError);
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error, 'Dial Lead');
    }
  },

  // Hangup Call
  hangupCall: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_hangup',
      user: user,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      const result = await makeApiCall(params, 'Hangup Call');
      
      // Update call in database on success
      if (result.result === 'SUCCESS') {
        try {
          await supabase
            .from('active_calls')
            .update({ 
              end_time: new Date().toISOString(),
              status: 'ENDED'
            })
            .eq('user_id', user)
            .in('status', ['RINGING', 'CONNECTED']);
        } catch (dbError) {
          console.warn('Error updating call record:', dbError);
        }
      }
      
      return result;
    } catch (error) {
      return handleApiError(error, 'Hangup Call');
    }
  },

  // Set Disposition
  setDisposition: async (user: string, disposition: string, comments?: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_status',
      user: user,
      status: disposition,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    if (comments) {
      params.append('comments', comments);
    }

    try {
      return await makeApiCall(params, 'Set Disposition');
    } catch (error) {
      return handleApiError(error, 'Set Disposition');
    }
  },

  // Transfer Call
  transferCall: async (user: string, transferTo: string, transferType: string = 'BLIND'): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_transfer',
      user: user,
      transfer_to: transferTo,
      transfer_type: transferType,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      return await makeApiCall(params, 'Transfer Call');
    } catch (error) {
      return handleApiError(error, 'Transfer Call');
    }
  },

  // Get Agent Info
  getAgentInfo: async (user: string): Promise<VicidialApiResponse> => {
    const params = new URLSearchParams({
      function: 'external_get_agent_info',
      user: user,
      source: VICIDIAL_CONFIG.source,
      version: VICIDIAL_CONFIG.version,
      format: VICIDIAL_CONFIG.format
    });

    try {
      return await makeApiCall(params, 'Get Agent Info');
    } catch (error) {
      return handleApiError(error, 'Get Agent Info');
    }
  },

  // Get Configuration
  getConfig: () => VICIDIAL_CONFIG
};
