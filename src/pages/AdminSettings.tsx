
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database,
  Shield,
  Mail,
  Phone,
  Globe,
  Clock,
  Users,
  Target,
  BarChart3,
  Headphones
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Categories of settings
  const [generalSettings, setGeneralSettings] = useState({
    company_name: 'Call Center Dynamics',
    company_phone: '+57 300 123 4567',
    company_email: 'info@callcenterdynamics.com',
    company_address: 'Bogotá, Colombia',
    timezone: 'America/Bogota',
    business_hours_start: '08:00',
    business_hours_end: '18:00',
    currency: 'COP',
    language: 'es'
  });

  const [vicidialSettings, setVicidialSettings] = useState({
    vicidial_url: import.meta.env.VITE_VICIDIAL_URL || '',
    vicidial_user: import.meta.env.VITE_VICIDIAL_USER || '',
    vicidial_pass: '****',
    auto_sync_enabled: true,
    sync_interval_minutes: 15,
    default_campaign: 'GENERAL',
    recording_enabled: true,
    disposition_required: true
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    target_conversion_rate: 15,
    max_call_duration: 1800,
    max_queue_time: 120,
    agent_break_duration: 15,
    max_daily_calls: 200,
    quality_score_threshold: 80,
    callback_reminder_hours: 24
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    browser_notifications: true,
    alert_threshold_breach: true,
    daily_reports: true,
    weekly_reports: true,
    escalation_enabled: true,
    escalation_minutes: 30
  });

  const [securitySettings, setSecuritySettings] = useState({
    session_timeout_minutes: 60,
    password_min_length: 8,
    require_2fa: false,
    login_attempts_limit: 5,
    ip_whitelist_enabled: false,
    audit_log_retention_days: 90,
    data_encryption: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('vicidial_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;

      // Process settings and apply to state
      if (data) {
        data.forEach((setting: SystemSetting) => {
          updateSettingsByKey(setting.setting_key, setting.setting_value);
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingsByKey = (key: string, value: string) => {
    // Update the appropriate settings object based on the key
    if (key.startsWith('general_')) {
      const settingKey = key.replace('general_', '');
      setGeneralSettings(prev => ({...prev, [settingKey]: value}));
    } else if (key.startsWith('vicidial_')) {
      const settingKey = key.replace('vicidial_', '');
      setVicidialSettings(prev => ({...prev, [settingKey]: value === 'true' ? true : value === 'false' ? false : value}));
    } else if (key.startsWith('performance_')) {
      const settingKey = key.replace('performance_', '');
      setPerformanceSettings(prev => ({...prev, [settingKey]: isNaN(Number(value)) ? value : Number(value)}));
    } else if (key.startsWith('notification_')) {
      const settingKey = key.replace('notification_', '');
      setNotificationSettings(prev => ({...prev, [settingKey]: value === 'true'}));
    } else if (key.startsWith('security_')) {
      const settingKey = key.replace('security_', '');
      setSecuritySettings(prev => ({...prev, [settingKey]: value === 'true' ? true : value === 'false' ? false : isNaN(Number(value)) ? value : Number(value)}));
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Prepare all settings for database
      const allSettings = [
        ...Object.entries(generalSettings).map(([key, value]) => ({
          setting_key: `general_${key}`,
          setting_value: String(value),
          description: `General setting: ${key}`,
          is_active: true
        })),
        ...Object.entries(vicidialSettings).map(([key, value]) => ({
          setting_key: `vicidial_${key}`,
          setting_value: String(value),
          description: `Vicidial setting: ${key}`,
          is_active: true
        })),
        ...Object.entries(performanceSettings).map(([key, value]) => ({
          setting_key: `performance_${key}`,
          setting_value: String(value),
          description: `Performance setting: ${key}`,
          is_active: true
        })),
        ...Object.entries(notificationSettings).map(([key, value]) => ({
          setting_key: `notification_${key}`,
          setting_value: String(value),
          description: `Notification setting: ${key}`,
          is_active: true
        })),
        ...Object.entries(securitySettings).map(([key, value]) => ({
          setting_key: `security_${key}`,
          setting_value: String(value),
          description: `Security setting: ${key}`,
          is_active: true
        }))
      ];

      // Delete existing settings and insert new ones
      await supabase.from('vicidial_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const { error } = await supabase
        .from('vicidial_settings')
        .insert(allSettings);

      if (error) throw error;

      toast({
        title: "Configuración guardada",
        description: "Todas las configuraciones se guardaron exitosamente",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (!confirm('¿Estás seguro de que deseas restablecer todas las configuraciones a sus valores por defecto?')) return;

    setGeneralSettings({
      company_name: 'Call Center Dynamics',
      company_phone: '+57 300 123 4567',
      company_email: 'info@callcenterdynamics.com',
      company_address: 'Bogotá, Colombia',
      timezone: 'America/Bogota',
      business_hours_start: '08:00',
      business_hours_end: '18:00',
      currency: 'COP',
      language: 'es'
    });

    setVicidialSettings({
      vicidial_url: '',
      vicidial_user: '',
      vicidial_pass: '',
      auto_sync_enabled: true,
      sync_interval_minutes: 15,
      default_campaign: 'GENERAL',
      recording_enabled: true,
      disposition_required: true
    });

    setPerformanceSettings({
      target_conversion_rate: 15,
      max_call_duration: 1800,
      max_queue_time: 120,
      agent_break_duration: 15,
      max_daily_calls: 200,
      quality_score_threshold: 80,
      callback_reminder_hours: 24
    });

    setNotificationSettings({
      email_notifications: true,
      sms_notifications: false,
      browser_notifications: true,
      alert_threshold_breach: true,
      daily_reports: true,
      weekly_reports: true,
      escalation_enabled: true,
      escalation_minutes: 30
    });

    setSecuritySettings({
      session_timeout_minutes: 60,
      password_min_length: 8,
      require_2fa: false,
      login_attempts_limit: 5,
      ip_whitelist_enabled: false,
      audit_log_retention_days: 90,
      data_encryption: true
    });

    toast({
      title: "Configuración restablecida",
      description: "Todas las configuraciones han sido restablecidas a sus valores por defecto",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600">Configuraciones generales del CRM y integraciones</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="vicidial" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Vicidial
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Nombre de la Empresa</Label>
                  <Input
                    value={generalSettings.company_name}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Teléfono de la Empresa</Label>
                  <Input
                    value={generalSettings.company_phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email de la Empresa</Label>
                  <Input
                    type="email"
                    value={generalSettings.company_email}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Zona Horaria</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">Colombia (UTC-5)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Mexico City (UTC-6)</SelectItem>
                      <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Hora de Inicio</Label>
                  <Input
                    type="time"
                    value={generalSettings.business_hours_start}
                    onChange={(e) => setGeneralSettings({...generalSettings, business_hours_start: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Hora de Fin</Label>
                  <Input
                    type="time"
                    value={generalSettings.business_hours_end}
                    onChange={(e) => setGeneralSettings({...generalSettings, business_hours_end: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Idioma</Label>
                  <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Dirección de la Empresa</Label>
                <Textarea
                  value={generalSettings.company_address}
                  onChange={(e) => setGeneralSettings({...generalSettings, company_address: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vicidial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Configuración de Vicidial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>URL del Servidor Vicidial</Label>
                  <Input
                    value={vicidialSettings.vicidial_url}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_url: e.target.value})}
                    placeholder="http://tu-servidor-vicidial.com"
                  />
                </div>
                <div>
                  <Label>Usuario de API Vicidial</Label>
                  <Input
                    value={vicidialSettings.vicidial_user}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_user: e.target.value})}
                    placeholder="api_user"
                  />
                </div>
                <div>
                  <Label>Contraseña de API</Label>
                  <Input
                    type="password"
                    value={vicidialSettings.vicidial_pass}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_pass: e.target.value})}
                    placeholder="Contraseña"
                  />
                </div>
                <div>
                  <Label>Campaña por Defecto</Label>
                  <Input
                    value={vicidialSettings.default_campaign}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, default_campaign: e.target.value})}
                    placeholder="GENERAL"
                  />
                </div>
                <div>
                  <Label>Intervalo de Sincronización (minutos)</Label>
                  <Input
                    type="number"
                    value={vicidialSettings.sync_interval_minutes}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, sync_interval_minutes: Number(e.target.value)})}
                    min="1"
                    max="60"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sincronización Automática</Label>
                    <p className="text-sm text-gray-600">Sincronizar datos automáticamente con Vicidial</p>
                  </div>
                  <Switch
                    checked={vicidialSettings.auto_sync_enabled}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, auto_sync_enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Grabación Habilitada</Label>
                    <p className="text-sm text-gray-600">Habilitar grabación de llamadas por defecto</p>
                  </div>
                  <Switch
                    checked={vicidialSettings.recording_enabled}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, recording_enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Disposición Requerida</Label>
                    <p className="text-sm text-gray-600">Requerir disposición para finalizar llamadas</p>
                  </div>
                  <Switch
                    checked={vicidialSettings.disposition_required}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, disposition_required: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Configuración de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Tasa de Conversión Objetivo (%)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.target_conversion_rate}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, target_conversion_rate: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Duración Máxima de Llamada (segundos)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.max_call_duration}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, max_call_duration: Number(e.target.value)})}
                    min="60"
                  />
                </div>
                <div>
                  <Label>Tiempo Máximo en Cola (segundos)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.max_queue_time}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, max_queue_time: Number(e.target.value)})}
                    min="30"
                  />
                </div>
                <div>
                  <Label>Duración de Descanso (minutos)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.agent_break_duration}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, agent_break_duration: Number(e.target.value)})}
                    min="5"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Máximo de Llamadas Diarias</Label>
                  <Input
                    type="number"
                    value={performanceSettings.max_daily_calls}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, max_daily_calls: Number(e.target.value)})}
                    min="50"
                  />
                </div>
                <div>
                  <Label>Umbral de Puntaje de Calidad (%)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.quality_score_threshold}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, quality_score_threshold: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Recordatorio de Callback (horas)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.callback_reminder_hours}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, callback_reminder_hours: Number(e.target.value)})}
                    min="1"
                    max="168"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-600">Recibir notificaciones importantes por email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones SMS</Label>
                    <p className="text-sm text-gray-600">Recibir alertas críticas por SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.sms_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificaciones del Navegador</Label>
                    <p className="text-sm text-gray-600">Mostrar notificaciones en el navegador</p>
                  </div>
                  <Switch
                    checked={notificationSettings.browser_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, browser_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas de Umbral</Label>
                    <p className="text-sm text-gray-600">Notificar cuando se superen umbrales configurados</p>
                  </div>
                  <Switch
                    checked={notificationSettings.alert_threshold_breach}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, alert_threshold_breach: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reportes Diarios</Label>
                    <p className="text-sm text-gray-600">Enviar resumen diario de actividad</p>
                  </div>
                  <Switch
                    checked={notificationSettings.daily_reports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, daily_reports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reportes Semanales</Label>
                    <p className="text-sm text-gray-600">Enviar resumen semanal de rendimiento</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weekly_reports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weekly_reports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalamiento Automático</Label>
                    <p className="text-sm text-gray-600">Escalar problemas automáticamente a supervisores</p>
                  </div>
                  <Switch
                    checked={notificationSettings.escalation_enabled}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, escalation_enabled: checked})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Label>Tiempo de Escalamiento (minutos)</Label>
                <Input
                  type="number"
                  value={notificationSettings.escalation_minutes}
                  onChange={(e) => setNotificationSettings({...notificationSettings, escalation_minutes: Number(e.target.value)})}
                  min="5"
                  max="120"
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Tiempo de Sesión (minutos)</Label>
                  <Input
                    type="number"
                    value={securitySettings.session_timeout_minutes}
                    onChange={(e) => setSecuritySettings({...securitySettings, session_timeout_minutes: Number(e.target.value)})}
                    min="15"
                    max="480"
                  />
                </div>
                <div>
                  <Label>Longitud Mínima de Contraseña</Label>
                  <Input
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: Number(e.target.value)})}
                    min="6"
                    max="20"
                  />
                </div>
                <div>
                  <Label>Límite de Intentos de Login</Label>
                  <Input
                    type="number"
                    value={securitySettings.login_attempts_limit}
                    onChange={(e) => setSecuritySettings({...securitySettings, login_attempts_limit: Number(e.target.value)})}
                    min="3"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Retención de Logs (días)</Label>
                  <Input
                    type="number"
                    value={securitySettings.audit_log_retention_days}
                    onChange={(e) => setSecuritySettings({...securitySettings, audit_log_retention_days: Number(e.target.value)})}
                    min="30"
                    max="365"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-gray-600">Requerir 2FA para todos los usuarios</p>
                  </div>
                  <Switch
                    checked={securitySettings.require_2fa}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, require_2fa: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lista Blanca de IPs</Label>
                    <p className="text-sm text-gray-600">Restringir acceso a IPs específicas</p>
                  </div>
                  <Switch
                    checked={securitySettings.ip_whitelist_enabled}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ip_whitelist_enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Encriptación de Datos</Label>
                    <p className="text-sm text-gray-600">Encriptar datos sensibles en la base de datos</p>
                  </div>
                  <Switch
                    checked={securitySettings.data_encryption}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, data_encryption: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
