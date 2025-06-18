
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Target,
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Alert {
  id: string;
  name: string;
  description: string;
  alert_type: string;
  threshold_value: number;
  comparison_operator: string;
  is_active: boolean;
  created_at: string;
  last_triggered: string | null;
  trigger_count: number;
}

interface AlertTrigger {
  id: string;
  alert_id: string;
  alert_name: string;
  triggered_at: string;
  value: number;
  threshold: number;
  status: string;
}

const AdminAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentTriggers, setRecentTriggers] = useState<AlertTrigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    alert_type: 'PERFORMANCE',
    threshold_value: 0,
    comparison_operator: 'LESS_THAN',
    is_active: true
  });

  // Simulated real-time metrics
  const [metrics, setMetrics] = useState({
    activeAgents: 24,
    callsInQueue: 12,
    averageWaitTime: 45,
    conversionRate: 12.4,
    systemLoad: 68,
    dailyCalls: 340,
    responseTime: 850
  });

  useEffect(() => {
    fetchAlerts();
    fetchRecentTriggers();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeAgents: Math.floor(Math.random() * 5) + 22,
        callsInQueue: Math.floor(Math.random() * 10) + 8,
        averageWaitTime: Math.floor(Math.random() * 20) + 35,
        conversionRate: (Math.random() * 3) + 11,
        systemLoad: Math.floor(Math.random() * 20) + 60,
        responseTime: Math.floor(Math.random() * 200) + 750
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    // Simulate alerts data
    const simulatedAlerts: Alert[] = [
      {
        id: '1',
        name: 'Conversión Baja',
        description: 'Alerta cuando la tasa de conversión cae por debajo del umbral',
        alert_type: 'PERFORMANCE',
        threshold_value: 10,
        comparison_operator: 'LESS_THAN',
        is_active: true,
        created_at: new Date().toISOString(),
        last_triggered: new Date(Date.now() - 3600000).toISOString(),
        trigger_count: 5
      },
      {
        id: '2',
        name: 'Tiempo de Espera Alto',
        description: 'Alerta cuando el tiempo de espera supera el límite',
        alert_type: 'QUEUE',
        threshold_value: 60,
        comparison_operator: 'GREATER_THAN',
        is_active: true,
        created_at: new Date().toISOString(),
        last_triggered: null,
        trigger_count: 0
      },
      {
        id: '3',
        name: 'Carga del Sistema',
        description: 'Alerta cuando la carga del sistema es muy alta',
        alert_type: 'SYSTEM',
        threshold_value: 80,
        comparison_operator: 'GREATER_THAN',
        is_active: true,
        created_at: new Date().toISOString(),
        last_triggered: new Date(Date.now() - 7200000).toISOString(),
        trigger_count: 3
      }
    ];
    
    setAlerts(simulatedAlerts);
    setLoading(false);
  };

  const fetchRecentTriggers = async () => {
    // Simulate recent triggers
    const simulatedTriggers: AlertTrigger[] = [
      {
        id: '1',
        alert_id: '1',
        alert_name: 'Conversión Baja',
        triggered_at: new Date(Date.now() - 1800000).toISOString(),
        value: 8.5,
        threshold: 10,
        status: 'ACTIVE'
      },
      {
        id: '2',
        alert_id: '3',
        alert_name: 'Carga del Sistema',
        triggered_at: new Date(Date.now() - 3600000).toISOString(),
        value: 85,
        threshold: 80,
        status: 'RESOLVED'
      }
    ];
    
    setRecentTriggers(simulatedTriggers);
  };

  const createAlert = async () => {
    const newAlertWithId: Alert = {
      ...newAlert,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      last_triggered: null,
      trigger_count: 0
    };

    setAlerts(prev => [...prev, newAlertWithId]);
    
    toast({
      title: "Alerta creada",
      description: `Alerta "${newAlert.name}" creada exitosamente`,
    });

    setNewAlert({
      name: '',
      description: '',
      alert_type: 'PERFORMANCE',
      threshold_value: 0,
      comparison_operator: 'LESS_THAN',
      is_active: true
    });
    setIsCreateModalOpen(false);
  };

  const updateAlert = async () => {
    if (!selectedAlert) return;

    setAlerts(prev => prev.map(alert => 
      alert.id === selectedAlert.id ? selectedAlert : alert
    ));

    toast({
      title: "Alerta actualizada",
      description: `Alerta "${selectedAlert.name}" actualizada exitosamente`,
    });

    setIsEditModalOpen(false);
    setSelectedAlert(null);
  };

  const deleteAlert = async (alertId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta alerta?')) return;

    setAlerts(prev => prev.filter(alert => alert.id !== alertId));

    toast({
      title: "Alerta eliminada",
      description: "Alerta eliminada exitosamente",
    });
  };

  const toggleAlertStatus = async (alert: Alert) => {
    const updatedAlert = { ...alert, is_active: !alert.is_active };
    setAlerts(prev => prev.map(a => a.id === alert.id ? updatedAlert : a));

    toast({
      title: "Estado actualizado",
      description: `Alerta ${updatedAlert.is_active ? 'activada' : 'desactivada'}`,
    });
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'PERFORMANCE': return <TrendingUp className="h-5 w-5" />;
      case 'QUEUE': return <Clock className="h-5 w-5" />;
      case 'SYSTEM': return <Settings className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'PERFORMANCE': return 'bg-blue-500';
      case 'QUEUE': return 'bg-orange-500';
      case 'SYSTEM': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getMetricStatus = (current: number, threshold: number, operator: string) => {
    if (operator === 'GREATER_THAN') {
      return current > threshold ? 'ALERT' : 'OK';
    } else {
      return current < threshold ? 'ALERT' : 'OK';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Alertas del Sistema</h1>
          <p className="text-gray-600">Monitoreo y configuración de alertas de rendimiento</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Alerta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Alerta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre de la Alerta</Label>
                <Input
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  placeholder="Nombre descriptivo"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  placeholder="Descripción de la alerta"
                />
              </div>
              <div>
                <Label>Tipo de Alerta</Label>
                <Select value={newAlert.alert_type} onValueChange={(value) => setNewAlert({...newAlert, alert_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERFORMANCE">Rendimiento</SelectItem>
                    <SelectItem value="QUEUE">Cola de Llamadas</SelectItem>
                    <SelectItem value="SYSTEM">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Operador</Label>
                  <Select value={newAlert.comparison_operator} onValueChange={(value) => setNewAlert({...newAlert, comparison_operator: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GREATER_THAN">Mayor que</SelectItem>
                      <SelectItem value="LESS_THAN">Menor que</SelectItem>
                      <SelectItem value="EQUALS">Igual a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor Umbral</Label>
                  <Input
                    type="number"
                    value={newAlert.threshold_value}
                    onChange={(e) => setNewAlert({...newAlert, threshold_value: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={createAlert} className="w-full">
                Crear Alerta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Real-time metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agentes Activos</p>
                <p className="text-2xl font-bold">{metrics.activeAgents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              {getMetricStatus(metrics.activeAgents, 20, 'LESS_THAN') === 'ALERT' ? (
                <Badge variant="destructive">Por debajo del mínimo</Badge>
              ) : (
                <Badge className="bg-green-500">Normal</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Llamadas en Cola</p>
                <p className="text-2xl font-bold">{metrics.callsInQueue}</p>
              </div>
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              {getMetricStatus(metrics.callsInQueue, 15, 'GREATER_THAN') === 'ALERT' ? (
                <Badge variant="destructive">Cola saturada</Badge>
              ) : (
                <Badge className="bg-green-500">Normal</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              {getMetricStatus(metrics.conversionRate, 10, 'LESS_THAN') === 'ALERT' ? (
                <Badge variant="destructive">Bajo rendimiento</Badge>
              ) : (
                <Badge className="bg-green-500">Normal</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Carga Sistema</p>
                <p className="text-2xl font-bold">{metrics.systemLoad}%</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              {getMetricStatus(metrics.systemLoad, 80, 'GREATER_THAN') === 'ALERT' ? (
                <Badge variant="destructive">Carga alta</Badge>
              ) : (
                <Badge className="bg-green-500">Normal</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configured Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Configuradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.alert_type)}`}>
                      {getAlertTypeIcon(alert.alert_type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{alert.name}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.comparison_operator === 'GREATER_THAN' ? '>' : '<'} {alert.threshold_value}
                        </Badge>
                        {alert.last_triggered && (
                          <span className="text-xs text-gray-500">
                            Última: {new Date(alert.last_triggered).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={alert.is_active}
                      onCheckedChange={() => toggleAlertStatus(alert)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Activaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTriggers.map((trigger) => (
                <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${trigger.status === 'ACTIVE' ? 'bg-red-500' : 'bg-green-500'}`}>
                      {trigger.status === 'ACTIVE' ? 
                        <XCircle className="h-5 w-5 text-white" /> : 
                        <CheckCircle className="h-5 w-5 text-white" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium">{trigger.alert_name}</h4>
                      <p className="text-sm text-gray-600">
                        Valor: {trigger.value} | Umbral: {trigger.threshold}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(trigger.triggered_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={trigger.status === 'ACTIVE' ? 'bg-red-500' : 'bg-green-500'}>
                    {trigger.status === 'ACTIVE' ? 'Activa' : 'Resuelta'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Alert Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Alerta</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <Label>Nombre de la Alerta</Label>
                <Input
                  value={selectedAlert.name}
                  onChange={(e) => setSelectedAlert({...selectedAlert, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={selectedAlert.description}
                  onChange={(e) => setSelectedAlert({...selectedAlert, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Operador</Label>
                  <Select value={selectedAlert.comparison_operator} onValueChange={(value) => setSelectedAlert({...selectedAlert, comparison_operator: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GREATER_THAN">Mayor que</SelectItem>
                      <SelectItem value="LESS_THAN">Menor que</SelectItem>
                      <SelectItem value="EQUALS">Igual a</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor Umbral</Label>
                  <Input
                    type="number"
                    value={selectedAlert.threshold_value}
                    onChange={(e) => setSelectedAlert({...selectedAlert, threshold_value: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={updateAlert} className="w-full">
                Actualizar Alerta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAlerts;
