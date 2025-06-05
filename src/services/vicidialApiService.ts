
import { supabase } from '@/integrations/supabase/client';

export interface VicidialApiResponse {
  result: string;
  data?: any;
  message?: string;
  error?: string;
}

export interface AgentLoginData {
  user: string;
  pass: string;
  campaign: string;
  phone_login: string;
  phone_pass: string;
}

export interface CallData {
  lead_id?: string;
  phone_number: string;
  search?: string;
  preview?: string;
  focus?: string;
  vendor_id?: string;
}

class VicidialApiService {
  private baseUrl: string = '';
  private apiUser: string = '';
  private apiPass: string = '';
  private source: string = 'ccd_crm';
  private version: string = '2.14';
  private format: string = 'json';

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const { data: settings } = await supabase
        .from('vicidial_settings')
        .select('setting_key, setting_value')
        .eq('is_active', true);

      if (settings) {
        const settingsMap = settings.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as Record<string, string>);

        this.baseUrl = settingsMap.vicidial_url || 'http://localhost/vicidial';
        this.apiUser = settingsMap.api_user || 'apiuser';
        this.apiPass = settingsMap.api_pass || 'apipass';
        this.source = settingsMap.source || 'ccd_crm';
        this.version = settingsMap.version || '2.14';
        this.format = settingsMap.format || 'json';
      }
    } catch (error) {
      console.error('Error loading Vicidial settings:', error);
    }
  }

  private async makeApiRequest(endpoint: string, params: Record<string, any> = {}): Promise<VicidialApiResponse> {
    const baseParams = {
      user: this.apiUser,
      pass: this.apiPass,
      source: this.source,
      version: this.version,
      format: this.format,
      ...params
    };

    const queryString = new URLSearchParams(baseParams).toString();
    const url = `${this.baseUrl}/agc/${endpoint}?${queryString}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        result: 'SUCCESS',
        data
      };
    } catch (error) {
      console.error('Vicidial API error:', error);
      return {
        result: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Agent API Functions
  async agentLogin(loginData: AgentLoginData): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_login',
      user: loginData.user,
      pass: loginData.pass,
      campaign: loginData.campaign,
      phone_login: loginData.phone_login,
      phone_pass: loginData.phone_pass
    };

    const response = await this.makeApiRequest('api.php', params);
    
    if (response.result === 'SUCCESS' && response.data) {
      // Guardar sesión en la base de datos
      await this.saveAgentSession(loginData.user, response.data);
    }

    return response;
  }

  async agentLogout(user: string): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_logout',
      user: user
    };

    const response = await this.makeApiRequest('api.php', params);
    
    if (response.result === 'SUCCESS') {
      // Actualizar sesión en la base de datos
      await this.endAgentSession(user);
    }

    return response;
  }

  async agentStatus(user: string, status?: string): Promise<VicidialApiResponse> {
    const params: Record<string, any> = {
      function: 'external_status',
      user: user
    };

    if (status) {
      params.status = status;
    }

    return await this.makeApiRequest('api.php', params);
  }

  async agentPause(user: string, pauseCode: string = 'PAUSE'): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_pause',
      user: user,
      pause_code: pauseCode
    };

    const response = await this.makeApiRequest('api.php', params);
    
    if (response.result === 'SUCCESS') {
      // Registrar pausa en la base de datos
      await this.recordAgentPause(user, pauseCode);
    }

    return response;
  }

  async dialLead(user: string, callData: CallData): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_dial',
      user: user,
      phone_number: callData.phone_number,
      ...(callData.lead_id && { lead_id: callData.lead_id }),
      ...(callData.search && { search: callData.search }),
      ...(callData.preview && { preview: callData.preview }),
      ...(callData.focus && { focus: callData.focus })
    };

    const response = await this.makeApiRequest('api.php', params);
    
    if (response.result === 'SUCCESS') {
      // Registrar llamada activa en la base de datos
      await this.recordActiveCall(user, callData);
    }

    return response;
  }

  async hangupCall(user: string): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_hangup',
      user: user
    };

    const response = await this.makeApiRequest('api.php', params);
    
    if (response.result === 'SUCCESS') {
      // Finalizar llamada activa en la base de datos
      await this.endActiveCall(user);
    }

    return response;
  }

  async setDisposition(user: string, disposition: string, comments?: string): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_disposition',
      user: user,
      disposition: disposition,
      ...(comments && { comments: comments })
    };

    return await this.makeApiRequest('api.php', params);
  }

  async transferCall(user: string, transferTo: string, transferType: string = 'BLIND'): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_transfer',
      user: user,
      transfer_to: transferTo,
      transfer_type: transferType
    };

    return await this.makeApiRequest('api.php', params);
  }

  async parkCall(user: string): Promise<VicidialApiResponse> {
    const params = {
      function: 'external_park',
      user: user
    };

    return await this.makeApiRequest('api.php', params);
  }

  // Non-Agent API Functions
  async addLead(leadData: any): Promise<VicidialApiResponse> {
    const params = {
      function: 'add_lead',
      phone_number: leadData.phone_number,
      first_name: leadData.first_name || '',
      last_name: leadData.last_name || '',
      email: leadData.email || '',
      list_id: leadData.list_id || '999',
      ...leadData
    };

    return await this.makeApiRequest('non_agent_api.php', params);
  }

  async updateLead(leadId: string, leadData: any): Promise<VicidialApiResponse> {
    const params = {
      function: 'update_lead',
      lead_id: leadId,
      ...leadData
    };

    return await this.makeApiRequest('non_agent_api.php', params);
  }

  async searchRecordings(searchData: any): Promise<VicidialApiResponse> {
    const params = {
      function: 'recording_lookup',
      ...searchData
    };

    return await this.makeApiRequest('non_agent_api.php', params);
  }

  async getAgentStats(user: string, startDate?: string, endDate?: string): Promise<VicidialApiResponse> {
    const params = {
      function: 'agent_stats_export',
      user: user,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate })
    };

    return await this.makeApiRequest('non_agent_api.php', params);
  }

  // Database Helper Functions
  private async saveAgentSession(userId: string, sessionData: any): Promise<void> {
    try {
      await supabase.from('agent_sessions').insert({
        user_id: userId,
        session_id: sessionData.session_id || `session_${Date.now()}`,
        phone: sessionData.phone || '',
        server_ip: sessionData.server_ip || '',
        campaign_id: sessionData.campaign || '',
        conf_exten: sessionData.conf_exten || '',
        extension: sessionData.extension || '',
        status: 'ACTIVE'
      });

      // Inicializar estadísticas del agente
      await supabase.from('agent_stats').upsert({
        user_id: userId,
        status: 'ACTIVE'
      });
    } catch (error) {
      console.error('Error saving agent session:', error);
    }
  }

  private async endAgentSession(userId: string): Promise<void> {
    try {
      await supabase
        .from('agent_sessions')
        .update({
          logout_time: new Date().toISOString(),
          is_active: false,
          status: 'LOGGED_OUT'
        })
        .eq('user_id', userId)
        .eq('is_active', true);

      await supabase
        .from('agent_stats')
        .update({ status: 'LOGGED_OUT' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error ending agent session:', error);
    }
  }

  private async recordAgentPause(userId: string, pauseCode: string): Promise<void> {
    try {
      await supabase.from('agent_pauses').insert({
        user_id: userId,
        pause_code: pauseCode
      });

      await supabase
        .from('agent_stats')
        .update({ status: 'PAUSED' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error recording agent pause:', error);
    }
  }

  private async recordActiveCall(userId: string, callData: CallData): Promise<void> {
    try {
      await supabase.from('active_calls').insert({
        user_id: userId,
        lead_id: callData.lead_id ? parseInt(callData.lead_id) : null,
        phone_number: callData.phone_number,
        uniqueid: `call_${Date.now()}`,
        status: 'RINGING'
      });

      await supabase
        .from('agent_stats')
        .update({ status: 'ON_CALL' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error recording active call:', error);
    }
  }

  private async endActiveCall(userId: string): Promise<void> {
    try {
      const { data: activeCall } = await supabase
        .from('active_calls')
        .select('*')
        .eq('user_id', userId)
        .is('end_time', null)
        .single();

      if (activeCall) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - new Date(activeCall.start_time).getTime()) / 1000);

        await supabase
          .from('active_calls')
          .update({
            end_time: endTime.toISOString(),
            duration_seconds: duration,
            status: 'COMPLETED'
          })
          .eq('id', activeCall.id);

        // Actualizar estadísticas del agente
        await supabase.rpc('increment_agent_stats', {
          p_user_id: userId,
          p_talk_time: duration
        });
      }

      await supabase
        .from('agent_stats')
        .update({ status: 'READY' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error ending active call:', error);
    }
  }
}

export const vicidialApiService = new VicidialApiService();
