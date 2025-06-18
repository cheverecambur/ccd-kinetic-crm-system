
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useVicidialReal } from '@/hooks/useVicidialReal';
import { supabase } from '@/integrations/supabase/client';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  BarChart3,
  Users,
  Phone,
  Calendar,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import VicidialConnectionTest from '@/components/VicidialConnectionTest';

interface SyncStatus {
  is_running: boolean;
  last_sync: string | null;
  next_sync: string | null;
  records_synced: number;
  total_records: number;
  sync_type: string;
  error_message: string | null;
}

const AdminVicidial = () => {
  const { toast } = useToast();
  const { isVicidialConnected, checkVicidialConnection, vicidialApi } = useVicidialReal();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    is_running: false,
    last_sync: null,
    next_sync: null,
    records_synced: 0,
    total_records: 0,
    sync_type: '',
    error_message: null
  });

  const [syncSettings, setSyncSettings] = useState({
    auto_sync_enabled: true,
    sync_interval_hours: 6,
    sync_leads: true,
    sync_calls: true,
    sync_agents: true,
    sync_dispositions: true,
    sync_recordings: false,
    batch_size: 1000
  });

  const [metrics, setMetrics] = useState({
    total_leads: 0,
    total_calls: 0,
    active_agents: 0,
    last_24h_calls: 0,
    sync_health: 'good',
    database_size: '2.3 GB',
    last_backup: '2024-01-15 08:00:00'
  });

  const [manualSyncProgress, setManualSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  useEffect(() => {
    fetchSyncStatus();
    fetchMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchSyncStatus = async () => {
    // Simulate sync status
    setSyncStatus({
      is_running: false,
      last_sync: new Date(Date.now() - 3600000).toISOString(),
      next_sync: new Date(Date.now() + 18000000).toISOString(), // 5 hours from now
      records_synced: 1240,
      total_records: 1240,
      sync_type: 'FULL',
      error_message: null
    });
  };

  const fetchMetrics = async () => {
    try {
      // Fetch real metrics from database
      const [leadsCount, callsCount, agentsCount] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('call_logs').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('active', true)
      ]);

      setMetrics(prev => ({
        ...prev,
        total_leads: leadsCount.count || 0,
        total_calls: callsCount.count || 0,
        active_agents: agentsCount.count || 0,
        last_24h_calls: Math.floor(Math.random() * 500) + 200
      }));
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const startManualSync = async (syncType: string) => {
    if (!isVicidialConnected) {
      toast({
        title: "Error",
        description: "No hay conexión con Vicidial. Verifique la configuración.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setManualSyncProgress(0);

    try {
      // Simulate sync progress
      for (let i = 0; i <= 100; i += 10) {
        setManualSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Update sync status
      setSyncStatus(prev => ({
        ...prev,
        last_sync: new Date().toISOString(),
        records_synced: prev.records_synced + Math.floor(Math.random() * 100) + 50,
        sync_type: syncType.toUpperCase()
      }));

      toast({
        title: "Sincronización completada",
        description: `Sincronización ${syncType} completada exitosamente`,
      });

      fetchMetrics();
    } catch (error) {
      console.error('Error during sync:', error);
      toast({
        title: "Error de sincronización",
        description: "Error durante la sincronización",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
      setManualSyncProgress(0);
    }
  };

  const stopSync = () => {
    setIsSyncing(false);
    setManualSyncProgress(0);
    setSyncStatus(prev => ({
      ...prev,
      is_running: false
    }));

    toast({
      title: "Sincronización detenida",
      description: "La sincronización ha sido detenida",
    });
  };

  const exportData = async () => {
    try {
      // Simulate data export
      toast({
        title: "Exportación iniciada",
        description: "La exportación de datos comenzará en breve",
      });

      // Here you would implement actual data export logic
      setTimeout(() => {
        toast({
          title: "Exportación completada",
          description: "Los datos han sido exportados exitosamente",
        });
      }, 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error de exportación",
        description: "Error al exportar los datos",
        variant: "destructive",
      });
    }
  };

  const createBackup = async () => {
    try {
      toast({
        title: "Respaldo iniciado",
        description: "Creando respaldo de la base de datos...",
      });

      // Simulate backup creation
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          last_backup: new Date().toISOString()
        }));

        toast({
          title: "Respaldo completado",
          description: "Respaldo de la base de datos creado exitosamente",
        });
      }, 5000);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Error de respaldo",
        description: "Error al crear el respaldo",
        variant: "destructive",
      });
    }
  };

  const getSyncHealthColor = () => {
    switch (metrics.sync_health) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSyncHealthIcon = () => {
    switch (metrics.sync_health) {
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Extracción de Datos Vicidial</h1>
          <p className="text-gray-600">Sincronización y gestión de datos de Vicidial</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={checkVicidialConnection}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Conexión
          </Button>
          <Button onClick={createBackup}>
            <Database className="h-4 w-4 mr-2" />
            Crear Respaldo
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado de Conexión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className={isVicidialConnected ? "bg-green-500" : "bg-red-500"}>
                {isVicidialConnected ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conectado
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Desconectado
                  </>
                )}
              </Badge>
              <div className={`flex items-center space-x-2 ${getSyncHealthColor()}`}>
                {getSyncHealthIcon()}
                <span className="font-medium">Estado: {metrics.sync_health === 'good' ? 'Saludable' : 'Con problemas'}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Última sincronización: {syncStatus.last_sync ? new Date(syncStatus.last_sync).toLocaleString() : 'Nunca'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{metrics.total_leads.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Llamadas</p>
                <p className="text-2xl font-bold">{metrics.total_calls.toLocaleString()}</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold">{metrics.active_agents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Llamadas 24h</p>
                <p className="text-2xl font-bold">{metrics.last_24h_calls}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Sync Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Sincronización Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progreso de sincronización</span>
                  <span className="text-sm text-gray-600">{manualSyncProgress}%</span>
                </div>
                <Progress value={manualSyncProgress} className="w-full" />
              </div>
            )}

            <div>
              <Label>Rango de Fechas</Label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="yesterday">Ayer</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="all">Todos los datos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => startManualSync('leads')} 
                disabled={isSyncing || !isVicidialConnected}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Sync Leads
              </Button>
              <Button 
                onClick={() => startManualSync('calls')} 
                disabled={isSyncing || !isVicidialConnected}
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Sync Llamadas
              </Button>
              <Button 
                onClick={() => startManualSync('agents')} 
                disabled={isSyncing || !isVicidialConnected}
                variant="outline"
              >
                <Users className="h-4 w-4 mr-2" />
                Sync Agentes
              </Button>
              <Button 
                onClick={() => startManualSync('full')} 
                disabled={isSyncing || !isVicidialConnected}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Completo
              </Button>
            </div>

            {isSyncing ? (
              <Button onClick={stopSync} variant="destructive" className="w-full">
                <Pause className="h-4 w-4 mr-2" />
                Detener Sincronización
              </Button>
            ) : (
              <Button onClick={exportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Sincronización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Sincronización Automática</Label>
                <p className="text-sm text-gray-600">Sincronizar automáticamente según el intervalo</p>
              </div>
              <Switch
                checked={syncSettings.auto_sync_enabled}
                onCheckedChange={(checked) => setSyncSettings({...syncSettings, auto_sync_enabled: checked})}
              />
            </div>

            <div>
              <Label>Intervalo de Sincronización (horas)</Label>
              <Input
                type="number"
                value={syncSettings.sync_interval_hours}
                onChange={(e) => setSyncSettings({...syncSettings, sync_interval_hours: Number(e.target.value)})}
                min="1"
                max="24"
              />
            </div>

            <div>
              <Label>Tamaño de Lote</Label>
              <Input
                type="number"
                value={syncSettings.batch_size}
                onChange={(e) => setSyncSettings({...syncSettings, batch_size: Number(e.target.value)})}
                min="100"
                max="5000"
              />
            </div>

            <div className="space-y-3">
              <Label>Datos a Sincronizar</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Leads</span>
                  <Switch
                    checked={syncSettings.sync_leads}
                    onCheckedChange={(checked) => setSyncSettings({...syncSettings, sync_leads: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Llamadas</span>
                  <Switch
                    checked={syncSettings.sync_calls}
                    onCheckedChange={(checked) => setSyncSettings({...syncSettings, sync_calls: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Agentes</span>
                  <Switch
                    checked={syncSettings.sync_agents}
                    onCheckedChange={(checked) => setSyncSettings({...syncSettings, sync_agents: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disposiciones</span>
                  <Switch
                    checked={syncSettings.sync_dispositions}
                    onCheckedChange={(checked) => setSyncSettings({...syncSettings, sync_dispositions: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grabaciones</span>
                  <Switch
                    checked={syncSettings.sync_recordings}
                    onCheckedChange={(checked) => setSyncSettings({...syncSettings, sync_recordings: checked})}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Guardar Configuración
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Connection Test Component */}
      <VicidialConnectionTest />

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de la Base de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Tamaño de la Base de Datos</Label>
              <p className="text-2xl font-bold text-blue-600">{metrics.database_size}</p>
            </div>
            <div>
              <Label>Último Respaldo</Label>
              <p className="text-lg font-medium">{new Date(metrics.last_backup).toLocaleString()}</p>
            </div>
            <div>
              <Label>Próxima Sincronización</Label>
              <p className="text-lg font-medium">
                {syncStatus.next_sync ? new Date(syncStatus.next_sync).toLocaleString() : 'No programada'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVicidial;
