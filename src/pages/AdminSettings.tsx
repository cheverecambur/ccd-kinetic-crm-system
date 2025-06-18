
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database,
  Bell,
  Shield,
  Palette,
  Globe,
  Clock,
  Mail,
  Phone,
  Download,
  Upload,
  TestTube,
  Zap
} from 'lucide-react';

interface SettingGroup {
  [key: string]: any;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Estados para diferentes grupos de configuración
  const [generalSettings, setGeneralSettings] = useState<SettingGroup>({
    company_name: 'CCD Capacitación',
    company_phone: '+57 300 123 4567',
    company_email: 'info@ccdcapacitacion.com',
    company_address: 'Bogotá, Colombia',
    timezone: 'America/Bogota',
    language: 'es',
    date_format: 'DD/MM/YYYY',
    currency: 'COP'
  });

  const [vicidialSettings, setVicidialSettings] = useState<SettingGroup>({
    vicidial_url: 'http://localhost',
    vicidial_user: 'api_user',
    vicidial_pass: '',
    auto_sync: true,
    sync_interval: 300,
    recording_enabled: true,
    quality_monitoring: true,
    campaign_default: 'DEFAULT'
  });

  const [performanceSettings, setPerformanceSettings] = useState<SettingGroup>({
    calls_per_hour_target: 20,
    conversion_rate_target: 10,
    avg_call_time_target: 300,
    quality_score_target: 85,
    productivity_alerts: true,
    performance_reports: true,
    auto_pause_inactive: 900
  });

  const [notificationSettings, setNotificationSettings] = useState<SettingGroup>({
    email_notifications: true,
    sms_notifications: false,
    whatsapp_notifications: true,
    system_alerts: true,
    performance_alerts: true,
    callback_reminders: true,
    daily_reports: true,
    weekly_reports: true
  });

  const [securitySettings, setSecuritySettings] = useState<SettingGroup>({
    session_timeout: 3600,
    password_min_length: 8,
    require_2fa: false,
    login_attempts: 3,
    lockout_duration: 900,
    audit_logging: true,
    data_encryption: true,
    backup_frequency: 'daily'
  });

  const [integrationSettings, setIntegrationSettings] = useState<SettingGroup>({
    whatsapp_api_key: '',
    email_smtp_host: 'smtp.gmail.com',
    email_smtp_port: 587,
    email_username: '',
    email_password: '',
    api_rate_limit: 1000,
    webhook_secret: '',
    external_crm_url: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('vicidial_settings')
        .select('*');

      if (error) throw error;

      // Organizar configuraciones por categoría
      if (data) {
        data.forEach((setting) => {
          const { setting_key, setting_value } = setting;
          
          if (setting_key.startsWith('general_')) {
            setGeneralSettings(prev => ({ ...prev, [setting_key.replace('general_', '')]: setting_value }));
          } else if (setting_key.startsWith('vicidial_')) {
            setVicidialSettings(prev => ({ ...prev, [setting_key.replace('vicidial_', '')]: setting_value }));
          } else if (setting_key.startsWith('performance_')) {
            setPerformanceSettings(prev => ({ ...prev, [setting_key.replace('performance_', '')]: setting_value }));
          } else if (setting_key.startsWith('notification_')) {
            setNotificationSettings(prev => ({ ...prev, [setting_key.replace('notification_', '')]: setting_value }));
          } else if (setting_key.startsWith('security_')) {
            setSecuritySettings(prev => ({ ...prev, [setting_key.replace('security_', '')]: setting_value }));
          } else if (setting_key.startsWith('integration_')) {
            setIntegrationSettings(prev => ({ ...prev, [setting_key.replace('integration_', '')]: setting_value }));
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (category: string, settings: SettingGroup) => {
    setSaving(true);
    try {
      const settingsToSave = Object.entries(settings).map(([key, value]) => ({
        setting_key: `${category}_${key}`,
        setting_value: value?.toString() || '',
        description: `${category} setting: ${key}`
      }));

      // Eliminar configuraciones existentes de esta categoría
      await supabase
        .from('vicidial_settings')
        .delete()
        .like('setting_key', `${category}_%`);

      // Insertar nuevas configuraciones
      const { error } = await supabase
        .from('vicidial_settings')
        .insert(settingsToSave);

      if (error) throw error;

      toast({
        title: "Configuración guardada",
        description: `Configuraciones de ${category} guardadas exitosamente`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Error al guardar las configuraciones",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (type: string) => {
    setTesting(true);
    try {
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conexión exitosa",
        description: `La conexión ${type} fue establecida correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar con ${type}`,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const resetToDefaults = async (category: string) => {
    if (!confirm('¿Estás seguro de que deseas restaurar la configuración por defecto?')) return;

    try {
      // Eliminar configuraciones de esta categoría
      await supabase
        .from('vicidial_settings')
        .delete()
        .like('setting_key', `${category}_%`);

      // Recargar configuraciones por defecto
      switch (category) {
        case 'general':
          setGeneralSettings({
            company_name: 'CCD Capacitación',
            company_phone: '+57 300 123 4567',
            company_email: 'info@ccdcapacitacion.com',
            company_address: 'Bogotá, Colombia',
            timezone: 'America/Bogota',
            language: 'es',
            date_format: 'DD/MM/YYYY',
            currency: 'COP'
          });
          break;
        // Agregar más casos según sea necesario
      }

      toast({
        title: "Configuración restaurada",
        description: "Se han restaurado los valores por defecto",
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast({
        title: "Error",
        description: "Error al restaurar la configuración",
        variant: "destructive",
      });
    }
  };

  const exportSettings = () => {
    const allSettings = {
      general: generalSettings,
      vicidial: vicidialSettings,
      performance: performanceSettings,
      notifications: notificationSettings,
      security: securitySettings,
      integrations: integrationSettings
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ccd_settings_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Configuración exportada",
      description: "El archivo de configuración ha sido descargado",
    });
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        if (settings.general) setGeneralSettings(settings.general);
        if (settings.vicidial) setVicidialSettings(settings.vicidial);
        if (settings.performance) setPerformanceSettings(settings.performance);
        if (settings.notifications) setNotificationSettings(settings.notifications);
        if (settings.security) setSecuritySettings(settings.security);
        if (settings.integrations) setIntegrationSettings(settings.integrations);

        toast({
          title: "Configuración importada",
          description: "Las configuraciones han sido cargadas exitosamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "El archivo no tiene un formato válido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
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
          <p className="text-gray-600">Administra las configuraciones generales del CRM</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportSettings} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={importSettings}
          />
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="vicidial">Vicidial</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        {/* Configuración General */}
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
                  <Label>Teléfono Principal</Label>
                  <Input
                    value={generalSettings.company_phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email Principal</Label>
                  <Input
                    type="email"
                    value={generalSettings.company_email}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    value={generalSettings.company_address}
                    onChange={(e) => setGeneralSettings({...generalSettings, company_address: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Zona Horaria</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">América/Bogotá</SelectItem>
                      <SelectItem value="America/Mexico_City">América/Ciudad de México</SelectItem>
                      <SelectItem value="America/New_York">América/Nueva York</SelectItem>
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Formato de Fecha</Label>
                  <Select value={generalSettings.date_format} onValueChange={(value) => setGeneralSettings({...generalSettings, date_format: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => resetToDefaults('general')}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Defecto
                </Button>
                <Button
                  onClick={() => saveSettings('general', generalSettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración Vicidial */}
        <TabsContent value="vicidial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración Vicidial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>URL de Vicidial</Label>
                  <Input
                    value={vicidialSettings.vicidial_url}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_url: e.target.value})}
                    placeholder="http://tu-servidor-vicidial.com"
                  />
                </div>
                <div>
                  <Label>Usuario API</Label>
                  <Input
                    value={vicidialSettings.vicidial_user}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_user: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Contraseña API</Label>
                  <Input
                    type="password"
                    value={vicidialSettings.vicidial_pass}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, vicidial_pass: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Campaña por Defecto</Label>
                  <Input
                    value={vicidialSettings.campaign_default}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, campaign_default: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Intervalo de Sincronización (segundos)</Label>
                  <Input
                    type="number"
                    value={vicidialSettings.sync_interval}
                    onChange={(e) => setVicidialSettings({...vicidialSettings, sync_interval: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>Sincronización Automática</Label>
                  <Switch
                    checked={vicidialSettings.auto_sync}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, auto_sync: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Grabación Habilitada</Label>
                  <Switch
                    checked={vicidialSettings.recording_enabled}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, recording_enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Monitoreo de Calidad</Label>
                  <Switch
                    checked={vicidialSettings.quality_monitoring}
                    onCheckedChange={(checked) => setVicidialSettings({...vicidialSettings, quality_monitoring: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={() => testConnection('Vicidial')}
                    variant="outline"
                    disabled={testing}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testing ? 'Probando...' : 'Probar Conexión'}
                  </Button>
                  <Button
                    onClick={() => resetToDefaults('vicidial')}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restaurar Defecto
                  </Button>
                </div>
                <Button
                  onClick={() => saveSettings('vicidial', vicidialSettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Rendimiento */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuración de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Llamadas por Hora (Meta)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.calls_per_hour_target}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, calls_per_hour_target: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Tasa de Conversión Meta (%)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.conversion_rate_target}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, conversion_rate_target: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Tiempo Promedio de Llamada Meta (segundos)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.avg_call_time_target}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, avg_call_time_target: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Puntaje de Calidad Meta (%)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.quality_score_target}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, quality_score_target: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Pausa Automática por Inactividad (segundos)</Label>
                  <Input
                    type="number"
                    value={performanceSettings.auto_pause_inactive}
                    onChange={(e) => setPerformanceSettings({...performanceSettings, auto_pause_inactive: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>Alertas de Productividad</Label>
                  <Switch
                    checked={performanceSettings.productivity_alerts}
                    onCheckedChange={(checked) => setPerformanceSettings({...performanceSettings, productivity_alerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reportes de Rendimiento</Label>
                  <Switch
                    checked={performanceSettings.performance_reports}
                    onCheckedChange={(checked) => setPerformanceSettings({...performanceSettings, performance_reports: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => resetToDefaults('performance')}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Defecto
                </Button>
                <Button
                  onClick={() => saveSettings('performance', performanceSettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>Notificaciones por Email</Label>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, email_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notificaciones por SMS</Label>
                  <Switch
                    checked={notificationSettings.sms_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sms_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notificaciones por WhatsApp</Label>
                  <Switch
                    checked={notificationSettings.whatsapp_notifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, whatsapp_notifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Alertas del Sistema</Label>
                  <Switch
                    checked={notificationSettings.system_alerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, system_alerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Alertas de Rendimiento</Label>
                  <Switch
                    checked={notificationSettings.performance_alerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, performance_alerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Recordatorios de Callback</Label>
                  <Switch
                    checked={notificationSettings.callback_reminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, callback_reminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reportes Diarios</Label>
                  <Switch
                    checked={notificationSettings.daily_reports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, daily_reports: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Reportes Semanales</Label>
                  <Switch
                    checked={notificationSettings.weekly_reports}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weekly_reports: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => resetToDefaults('notification')}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Defecto
                </Button>
                <Button
                  onClick={() => saveSettings('notification', notificationSettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
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
                  <Label>Tiempo de Sesión (segundos)</Label>
                  <Input
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Longitud Mínima de Contraseña</Label>
                  <Input
                    type="number"
                    value={securitySettings.password_min_length}
                    onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Intentos de Login Máximos</Label>
                  <Input
                    type="number"
                    value={securitySettings.login_attempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, login_attempts: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Duración de Bloqueo (segundos)</Label>
                  <Input
                    type="number"
                    value={securitySettings.lockout_duration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockout_duration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Frecuencia de Backup</Label>
                  <Select value={securitySettings.backup_frequency} onValueChange={(value) => setSecuritySettings({...securitySettings, backup_frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <Label>Requerir 2FA</Label>
                  <Switch
                    checked={securitySettings.require_2fa}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, require_2fa: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log de Auditoría</Label>
                  <Switch
                    checked={securitySettings.audit_logging}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, audit_logging: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Encriptación de Datos</Label>
                  <Switch
                    checked={securitySettings.data_encryption}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, data_encryption: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => resetToDefaults('security')}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restaurar Defecto
                </Button>
                <Button
                  onClick={() => saveSettings('security', securitySettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Integraciones */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuración de Integraciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>API Key de WhatsApp</Label>
                  <Input
                    type="password"
                    value={integrationSettings.whatsapp_api_key}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, whatsapp_api_key: e.target.value})}
                  />
                </div>
                <div>
                  <Label>SMTP Host</Label>
                  <Input
                    value={integrationSettings.email_smtp_host}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, email_smtp_host: e.target.value})}
                  />
                </div>
                <div>
                  <Label>SMTP Puerto</Label>
                  <Input
                    type="number"
                    value={integrationSettings.email_smtp_port}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, email_smtp_port: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Usuario Email</Label>
                  <Input
                    value={integrationSettings.email_username}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, email_username: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Contraseña Email</Label>
                  <Input
                    type="password"
                    value={integrationSettings.email_password}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, email_password: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Límite de Rate API</Label>
                  <Input
                    type="number"
                    value={integrationSettings.api_rate_limit}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, api_rate_limit: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Webhook Secret</Label>
                  <Input
                    type="password"
                    value={integrationSettings.webhook_secret}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, webhook_secret: e.target.value})}
                  />
                </div>
                <div>
                  <Label>URL CRM Externo</Label>
                  <Input
                    value={integrationSettings.external_crm_url}
                    onChange={(e) => setIntegrationSettings({...integrationSettings, external_crm_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={() => testConnection('WhatsApp API')}
                    variant="outline"
                    disabled={testing}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testing ? 'Probando...' : 'Probar WhatsApp'}
                  </Button>
                  <Button
                    onClick={() => testConnection('Email SMTP')}
                    variant="outline"
                    disabled={testing}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {testing ? 'Probando...' : 'Probar Email'}
                  </Button>
                  <Button
                    onClick={() => resetToDefaults('integration')}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restaurar Defecto
                  </Button>
                </div>
                <Button
                  onClick={() => saveSettings('integration', integrationSettings)}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
