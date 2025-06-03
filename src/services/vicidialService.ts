
// Servicio para integración con Vicidial API
export interface VicidialConfig {
  baseUrl: string;
  user: string;
  pass: string;
  source: string;
}

export interface VicidialLead {
  lead_id?: string;
  phone_number: string;
  phone_code?: string;
  list_id?: string;
  first_name?: string;
  last_name?: string;
  vendor_lead_code?: string;
  email?: string;
  address1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  comments?: string;
  status?: string;
  callback?: 'Y' | 'N';
  callback_datetime?: string;
  callback_status?: string;
  callback_type?: 'USERONLY' | 'ANYONE';
  callback_user?: string;
  callback_comments?: string;
}

export interface VicidialCallControl {
  agent_user: string;
  function: string;
  value?: string;
  stage?: string;
  phone_number?: string;
  phone_code?: string;
  search?: 'YES' | 'NO';
  preview?: 'YES' | 'NO';
  focus?: 'YES' | 'NO';
}

export interface VicidialCallDisposition {
  agent_user: string;
  value: string;
  callback_datetime?: string;
  callback_type?: 'USERONLY' | 'ANYONE';
  callback_comments?: string;
}

export interface VicidialAgentStatus {
  agent_user: string;
  session_id: string;
  status: string;
  campaign: string;
  calls_today: number;
  pause_time: number;
  talk_time: number;
  wait_time: number;
}

export interface VicidialRecording {
  recording_id: string;
  start_time: string;
  user: string;
  lead_id: string;
  duration?: number;
  location: string;
}

class VicidialService {
  private config: VicidialConfig;

  constructor(config: VicidialConfig) {
    this.config = config;
  }

  // Construir URL base para API de agente
  private buildAgentUrl(params: Record<string, any>): string {
    const baseParams = {
      source: this.config.source,
      user: this.config.user,
      pass: this.config.pass,
      ...params
    };

    const urlParams = new URLSearchParams();
    Object.entries(baseParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    return `${this.config.baseUrl}/agc/api.php?${urlParams.toString()}`;
  }

  // Construir URL base para API administrativa
  private buildAdminUrl(params: Record<string, any>): string {
    const baseParams = {
      source: this.config.source,
      user: this.config.user,
      pass: this.config.pass,
      ...params
    };

    const urlParams = new URLSearchParams();
    Object.entries(baseParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    return `${this.config.baseUrl}/vicidial/non_agent_api.php?${urlParams.toString()}`;
  }

  // Realizar llamada HTTP
  private async makeRequest(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Vicidial API Error:', error);
      throw error;
    }
  }

  // === API DE AGENTE ===

  // Obtener versión de la API
  async getVersion(): Promise<string> {
    const url = this.buildAgentUrl({ function: 'version' });
    return this.makeRequest(url);
  }

  // Cerrar sesión del agente
  async logoutAgent(agent_user: string): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'logout',
      agent_user,
      value: 'LOGOUT'
    });
    return this.makeRequest(url);
  }

  // Pausar/Reanudar agente
  async pauseAgent(agent_user: string, pause: boolean): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'external_pause',
      agent_user,
      value: pause ? 'PAUSE' : 'RESUME'
    });
    return this.makeRequest(url);
  }

  // Colgar llamada
  async hangupCall(agent_user: string): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'external_hangup',
      agent_user,
      value: '1'
    });
    return this.makeRequest(url);
  }

  // Establecer disposición de llamada
  async setCallDisposition(params: VicidialCallDisposition): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'external_status',
      ...params
    });
    return this.makeRequest(url);
  }

  // Marcado manual
  async dialManual(params: VicidialCallControl): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'external_dial',
      ...params
    });
    return this.makeRequest(url);
  }

  // Estacionar llamada
  async parkCall(agent_user: string, action: 'PARK_CUSTOMER' | 'GRAB_CUSTOMER'): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'park_call',
      agent_user,
      value: action
    });
    return this.makeRequest(url);
  }

  // Control de grabación
  async controlRecording(agent_user: string, action: 'START' | 'STOP' | 'STATUS', stage?: string): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'recording',
      agent_user,
      value: action,
      stage
    });
    return this.makeRequest(url);
  }

  // Transferencia ciega
  async blindTransfer(agent_user: string, phone_number: string): Promise<string> {
    const url = this.buildAgentUrl({
      function: 'transfer_conference',
      agent_user,
      value: 'BLIND_TRANSFER',
      phone_number
    });
    return this.makeRequest(url);
  }

  // === API ADMINISTRATIVA ===

  // Añadir lead
  async addLead(lead: VicidialLead): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'add_lead',
      ...lead
    });
    return this.makeRequest(url);
  }

  // Actualizar lead
  async updateLead(lead: VicidialLead & { lead_id?: string }): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'update_lead',
      ...lead
    });
    return this.makeRequest(url);
  }

  // Buscar grabaciones
  async searchRecordings(params: {
    agent_user?: string;
    lead_id?: string;
    date?: string;
    uniqueid?: string;
    extension?: string;
    stage?: 'csv' | 'tab' | 'pipe';
    header?: 'YES' | 'NO';
    duration?: 'Y' | 'N';
  }): Promise<VicidialRecording[]> {
    const url = this.buildAdminUrl({
      function: 'recording_lookup',
      ...params
    });
    
    const response = await this.makeRequest(url);
    
    // Parsear respuesta para convertir a objetos
    const recordings: VicidialRecording[] = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('SUCCESS:') || line.startsWith('ERROR:')) continue;
      
      const parts = line.split('|');
      if (parts.length >= 5) {
        recordings.push({
          start_time: parts[0],
          user: parts[1],
          recording_id: parts[2],
          lead_id: parts[3],
          duration: parts.length > 5 ? parseInt(parts[4]) : undefined,
          location: parts[parts.length - 1]
        });
      }
    }
    
    return recordings;
  }

  // Exportar estadísticas de agente
  async exportAgentStats(params: {
    datetime_start: string;
    datetime_end: string;
    agent_user?: string;
    campaign_id?: string;
    stage?: 'csv' | 'tab' | 'pipe';
    header?: 'YES' | 'NO';
    time_format?: 'H' | 'HF' | 'M' | 'S';
    group_by_campaign?: 'YES' | 'NO';
  }): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'agent_stats_export',
      ...params
    });
    return this.makeRequest(url);
  }

  // Añadir usuario
  async addUser(params: {
    agent_user: string;
    agent_pass: string;
    agent_user_level: number;
    agent_full_name: string;
    agent_user_group: string;
    phone_login?: string;
    phone_pass?: string;
    email?: string;
    voicemail_id?: string;
  }): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'add_user',
      ...params
    });
    return this.makeRequest(url);
  }

  // Actualizar usuario
  async updateUser(params: {
    agent_user: string;
    delete_user?: 'Y' | 'N';
    agent_pass?: string;
    agent_user_level?: number;
    agent_full_name?: string;
    agent_user_group?: string;
    phone_login?: string;
    phone_pass?: string;
    email?: string;
    active?: 'Y' | 'N';
  }): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'update_user',
      ...params
    });
    return this.makeRequest(url);
  }

  // Monitor silencioso
  async blindMonitor(params: {
    phone_login: string;
    session_id: string;
    server_ip: string;
    stage?: 'MONITOR' | 'BARGE' | 'HIJACK';
  }): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'blind_monitor',
      ...params
    });
    return this.makeRequest(url);
  }

  // Obtener información de in-groups del agente
  async getAgentInGroupInfo(agent_user: string, stage?: 'info' | 'change' | 'text'): Promise<string> {
    const url = this.buildAdminUrl({
      function: 'agent_ingroup_info',
      agent_user,
      stage
    });
    return this.makeRequest(url);
  }

  // === MÉTODOS DE UTILIDAD ===

  // Verificar si la respuesta es exitosa
  isSuccessResponse(response: string): boolean {
    return response.startsWith('SUCCESS:') || response.startsWith('NOTICE:');
  }

  // Extraer mensaje de error
  getErrorMessage(response: string): string {
    if (response.startsWith('ERROR:')) {
      return response.replace('ERROR:', '').trim();
    }
    return response;
  }

  // Parsear respuesta de estado del agente (simulado basado en respuestas reales)
  parseAgentStatus(response: string): VicidialAgentStatus | null {
    // En una implementación real, esto parsearia la respuesta de la API
    // Por ahora devolvemos datos simulados basados en el formato esperado
    return {
      agent_user: 'test_agent',
      session_id: '1234567',
      status: 'READY',
      campaign: 'TEST_CAMPAIGN',
      calls_today: 15,
      pause_time: 300,
      talk_time: 1800,
      wait_time: 600
    };
  }
}

// Instancia por defecto del servicio (configurar con variables de entorno reales)
export const vicidialService = new VicidialService({
  baseUrl: process.env.REACT_APP_VICIDIAL_URL || 'http://localhost',
  user: process.env.REACT_APP_VICIDIAL_USER || 'api_user',
  pass: process.env.REACT_APP_VICIDIAL_PASS || 'api_pass',
  source: 'CCD_FRONTEND'
});

export default VicidialService;
