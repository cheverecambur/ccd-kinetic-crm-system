
// Servicio completo para integración real con Vicidial API
// Basado en la documentación oficial de Vicidial Agent API

export interface VicidialConfig {
  baseUrl: string;
  user: string;
  pass: string;
  source: string;
}

export interface VicidialApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  rawResponse: string;
}

export interface AgentLoginData {
  agent_user: string;
  agent_pass: string;
  phone_login: string;
  phone_pass: string;
  campaign: string;
}

export interface CallData {
  phone_number: string;
  phone_code?: string;
  lead_id?: string;
  search?: 'YES' | 'NO';
  preview?: 'YES' | 'NO';
  focus?: 'YES' | 'NO';
  vendor_id?: string;
  dial_prefix?: string;
  group_alias?: string;
  alt_dial?: 'ALT' | 'ADDR3' | 'SEARCH';
  dial_ingroup?: string;
  outbound_cid?: string;
}

export interface DispositionData {
  value: string;
  callback_datetime?: string;
  callback_type?: 'USERONLY' | 'ANYONE';
  callback_comments?: string;
  qm_dispo_code?: string;
}

export interface LeadData {
  phone_number?: string;
  phone_code?: string;
  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code?: string;
  gender?: string;
  date_of_birth?: string;
  alt_phone?: string;
  email?: string;
  security_phrase?: string;
  comments?: string;
  rank?: string;
  owner?: string;
  source_id?: string;
  vendor_lead_code?: string;
  gmt_offset_now?: string;
  title?: string;
  middle_initial?: string;
  province?: string;
  dnc_check?: 'YES' | 'NO';
  campaign_dnc_check?: 'YES' | 'NO';
}

class VicidialRealApiService {
  private config: VicidialConfig;

  constructor(config: VicidialConfig) {
    this.config = config;
  }

  // Construir URL para llamadas a la API
  private buildApiUrl(params: Record<string, any>): string {
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

  // Realizar llamada HTTP a la API
  private async makeApiCall(params: Record<string, any>): Promise<VicidialApiResponse> {
    try {
      const url = this.buildApiUrl(params);
      console.log('Vicidial API Call:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: AbortSignal.timeout(30000) // 30 segundos timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawResponse = await response.text();
      console.log('Vicidial API Response:', rawResponse);

      return {
        success: rawResponse.startsWith('SUCCESS:') || rawResponse.startsWith('NOTICE:'),
        rawResponse,
        data: this.parseApiResponse(rawResponse),
        error: rawResponse.startsWith('ERROR:') ? rawResponse : undefined
      };
    } catch (error: any) {
      console.error('Vicidial API Error:', error);
      return {
        success: false,
        rawResponse: '',
        error: error.message || 'Unknown error'
      };
    }
  }

  // Parsear respuesta de la API
  private parseApiResponse(response: string): any {
    if (response.includes('|')) {
      const parts = response.split('|');
      return {
        parts,
        message: parts[0],
        details: parts.slice(1)
      };
    }
    return { message: response };
  }

  // === FUNCIONES BÁSICAS DE LA API ===

  // Obtener versión de Vicidial
  async getVersion(): Promise<VicidialApiResponse> {
    return this.makeApiCall({ function: 'version' });
  }

  // Obtener información del servidor web
  async getWebserverInfo(): Promise<VicidialApiResponse> {
    return this.makeApiCall({ function: 'webserver' });
  }

  // === FUNCIONES DE CONTROL DE AGENTE ===

  // Colgar llamada actual
  async hangupCall(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_hangup',
      agent_user
    });
  }

  // Establecer disposición de llamada
  async setDisposition(agent_user: string, disposition: DispositionData): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_status',
      agent_user,
      ...disposition
    });
  }

  // Pausar/Reanudar agente
  async pauseAgent(agent_user: string, action: 'PAUSE' | 'RESUME'): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_pause',
      agent_user,
      value: action
    });
  }

  // Cerrar sesión del agente
  async logoutAgent(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'logout',
      agent_user,
      value: 'LOGOUT'
    });
  }

  // === FUNCIONES DE MARCADO ===

  // Marcado manual
  async dialManual(agent_user: string, callData: CallData): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_dial',
      agent_user,
      value: callData.phone_number,
      phone_code: callData.phone_code || '1',
      search: callData.search || 'YES',
      preview: callData.preview || 'NO', 
      focus: callData.focus || 'YES',
      lead_id: callData.lead_id,
      vendor_id: callData.vendor_id,
      dial_prefix: callData.dial_prefix,
      group_alias: callData.group_alias,
      alt_dial: callData.alt_dial,
      dial_ingroup: callData.dial_ingroup,
      outbound_cid: callData.outbound_cid
    });
  }

  // Marcar siguiente número en cola
  async dialNext(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_dial',
      agent_user,
      value: 'MANUALNEXT'
    });
  }

  // Acciones de preview dial
  async previewDialAction(agent_user: string, action: 'SKIP' | 'DIALONLY' | 'ALTDIAL' | 'ADR3DIAL' | 'FINISH'): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'preview_dial_action',
      agent_user,
      value: action
    });
  }

  // === FUNCIONES DE GESTIÓN DE LEADS ===

  // Agregar lead manual
  async addLead(agent_user: string, leadData: LeadData): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'external_add_lead',
      agent_user,
      ...leadData
    });
  }

  // Actualizar campos del lead actual
  async updateLeadFields(agent_user: string, leadData: LeadData): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'update_fields',
      agent_user,
      ...leadData
    });
  }

  // Cambiar lead activo (para llamadas entrantes)
  async switchLead(agent_user: string, lead_id?: string, vendor_lead_code?: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'switch_lead',
      agent_user,
      lead_id,
      vendor_lead_code
    });
  }

  // === FUNCIONES DE TRANSFERENCIA Y CONFERENCIA ===

  // Transferencia ciega
  async blindTransfer(agent_user: string, phone_number: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'transfer_conference',
      agent_user,
      value: 'BLIND_TRANSFER',
      phone_number
    });
  }

  // Transferencia local a otro agente
  async localTransfer(agent_user: string, ingroup: string, consultative: boolean = false): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'transfer_conference',
      agent_user,
      value: 'LOCAL_CLOSER',
      ingroup_choices: ingroup,
      consultative: consultative ? 'YES' : 'NO'
    });
  }

  // Llamada en conferencia
  async dialWithCustomer(agent_user: string, phone_number: string, consultative: boolean = false): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'transfer_conference',
      agent_user,
      value: 'DIAL_WITH_CUSTOMER',
      phone_number,
      consultative: consultative ? 'YES' : 'NO'
    });
  }

  // Colgar tercera parte en conferencia
  async hangupTransfer(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'transfer_conference',
      agent_user,
      value: 'HANGUP_XFER'
    });
  }

  // Salir de llamada en 3 vías
  async leave3WayCall(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'transfer_conference',
      agent_user,
      value: 'LEAVE_3WAY_CALL'
    });
  }

  // === FUNCIONES DE ESTACIONAMIENTO ===

  // Estacionar cliente
  async parkCustomer(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'park_call',
      agent_user,
      value: 'PARK_CUSTOMER'
    });
  }

  // Recuperar cliente estacionado
  async grabCustomer(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'park_call',
      agent_user,
      value: 'GRAB_CUSTOMER'
    });
  }

  // === FUNCIONES DE GRABACIÓN ===

  // Iniciar grabación
  async startRecording(agent_user: string, stage?: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'recording',
      agent_user,
      value: 'START',
      stage
    });
  }

  // Detener grabación
  async stopRecording(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'recording',
      agent_user,
      value: 'STOP'
    });
  }

  // Estado de grabación
  async recordingStatus(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'recording',
      agent_user,
      value: 'STATUS'
    });
  }

  // === FUNCIONES DE AUDIO ===

  // Reproducir audio
  async playAudio(agent_user: string, audioFile: string, dialOverride: boolean = false): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'audio_playback',
      agent_user,
      stage: 'PLAY',
      value: audioFile,
      dial_override: dialOverride ? 'Y' : 'N'
    });
  }

  // Detener audio
  async stopAudio(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'audio_playback',
      agent_user,
      stage: 'STOP'
    });
  }

  // Pausar audio
  async pauseAudio(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'audio_playback',
      agent_user,
      stage: 'PAUSE'
    });
  }

  // Reanudar audio
  async resumeAudio(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'audio_playback',
      agent_user,
      stage: 'RESUME'
    });
  }

  // === FUNCIONES AVANZADAS ===

  // Enviar tonos DTMF
  async sendDTMF(agent_user: string, dtmfString: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'send_dtmf',
      agent_user,
      value: dtmfString
    });
  }

  // Establecer código de pausa
  async setPauseCode(agent_user: string, pauseCode: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'pause_code',
      agent_user,
      value: pauseCode
    });
  }

  // Contar llamadas en cola
  async getCallsInQueue(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'calls_in_queue_count',
      agent_user,
      value: 'DISPLAY'
    });
  }

  // Llamar al agente
  async callAgent(agent_user: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'call_agent',
      agent_user,
      value: 'CALL'
    });
  }

  // Cambiar grupos entrantes
  async changeIngroups(agent_user: string, value: 'CHANGE' | 'ADD' | 'REMOVE', ingroups: string[], blended: boolean = true, setAsDefault: boolean = false): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'change_ingroups',
      agent_user,
      value,
      blended: blended ? 'YES' : 'NO',
      ingroup_choices: ingroups.join(' '),
      set_as_default: setAsDefault ? 'YES' : 'NO'
    });
  }

  // Establecer mensaje de buzón de voz
  async setVoicemailMessage(agent_user: string, audioFiles: string[], lead_id?: string): Promise<VicidialApiResponse> {
    return this.makeApiCall({
      function: 'vm_message',
      agent_user,
      value: audioFiles.join('|'),
      lead_id
    });
  }

  // === FUNCIONES DE UTILIDAD ===

  // Verificar si la respuesta fue exitosa
  isSuccess(response: VicidialApiResponse): boolean {
    return response.success;
  }

  // Obtener mensaje de error
  getErrorMessage(response: VicidialApiResponse): string {
    return response.error || 'Error desconocido';
  }

  // Obtener datos de la respuesta
  getResponseData(response: VicidialApiResponse): any {
    return response.data;
  }

  // Verificar conexión
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.getVersion();
      return this.isSuccess(response);
    } catch (error) {
      console.error('Error testing Vicidial connection:', error);
      return false;
    }
  }
}

// Función para obtener configuración desde variables de entorno
export function getVicidialConfig(): VicidialConfig {
  return {
    baseUrl: import.meta.env.VITE_VICIDIAL_URL || 'http://localhost',
    user: import.meta.env.VITE_VICIDIAL_USER || 'api_user',
    pass: import.meta.env.VITE_VICIDIAL_PASS || 'api_pass',
    source: 'CCD_FRONTEND'
  };
}

// Instancia del servicio
export const vicidialRealApi = new VicidialRealApiService(getVicidialConfig());

export default VicidialRealApiService;
