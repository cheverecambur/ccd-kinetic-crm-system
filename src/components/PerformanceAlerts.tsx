
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Phone, 
  Target,
  CheckCircle,
  XCircle,
  Bell,
  BellRing
} from 'lucide-react';

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'conversion' | 'time' | 'calls' | 'quality';
  message: string;
  advisor: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

const PerformanceAlerts = () => {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([
    {
      id: '1',
      type: 'critical',
      category: 'conversion',
      message: 'Tasa de conversión por debajo del 15%',
      advisor: 'Carlos Rodríguez',
      value: 12,
      threshold: 15,
      timestamp: new Date(Date.now() - 5 * 60000),
      acknowledged: false
    },
    {
      id: '2',
      type: 'warning',
      category: 'time',
      message: 'Tiempo promedio de llamada excede los 8 minutos',
      advisor: 'María González',
      value: 520,
      threshold: 480,
      timestamp: new Date(Date.now() - 10 * 60000),
      acknowledged: false
    },
    {
      id: '3',
      type: 'warning',
      category: 'calls',
      message: 'Número de llamadas por debajo de la meta diaria',
      advisor: 'Ana Martínez',
      value: 32,
      threshold: 45,
      timestamp: new Date(Date.now() - 15 * 60000),
      acknowledged: true
    }
  ]);

  const [kpis] = useState<KPI[]>([
    {
      name: 'Tasa de Conversión',
      value: 18.5,
      target: 20,
      unit: '%',
      status: 'warning',
      trend: 'down',
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'Tiempo Promedio de Llamada',
      value: 456,
      target: 480,
      unit: 'seg',
      status: 'good',
      trend: 'stable',
      icon: <Clock className="h-4 w-4" />
    },
    {
      name: 'Llamadas por Hora',
      value: 7.2,
      target: 8,
      unit: 'llamadas',
      status: 'warning',
      trend: 'up',
      icon: <Phone className="h-4 w-4" />
    },
    {
      name: 'Calidad de Llamadas',
      value: 92,
      target: 90,
      unit: '%',
      status: 'good',
      trend: 'up',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Resumen de KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            KPIs de Rendimiento en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {kpi.icon}
                    <span className="text-sm font-medium">{kpi.name}</span>
                  </div>
                  <Badge className={`${getKPIStatusColor(kpi.status)} bg-transparent border-current`}>
                    {kpi.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${getKPIStatusColor(kpi.status)}`}>
                    {kpi.value}{kpi.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    Meta: {kpi.target}{kpi.unit}
                  </div>
                  <div className="flex items-center gap-1">
                    {kpi.trend === 'up' && <TrendingDown className="h-3 w-3 text-green-500 rotate-180" />}
                    {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    <span className="text-xs text-gray-500">
                      {kpi.trend === 'up' ? 'Mejorando' : kpi.trend === 'down' ? 'Empeorando' : 'Estable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Alertas Activas ({unacknowledgedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                className={`${alert.acknowledged ? 'opacity-60' : ''} ${
                  alert.type === 'critical' ? 'border-red-500' : 
                  alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <AlertDescription className="font-medium">
                        {alert.advisor} - {alert.message}
                      </AlertDescription>
                      <div className="text-sm text-gray-600 mt-1">
                        Valor actual: {alert.value}{alert.category === 'time' ? 's' : alert.category === 'conversion' ? '%' : ''} 
                        | Umbral: {alert.threshold}{alert.category === 'time' ? 's' : alert.category === 'conversion' ? '%' : ''}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      alert.type === 'critical' ? 'bg-red-500' : 
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }>
                      {alert.type === 'critical' ? 'Crítica' : 
                       alert.type === 'warning' ? 'Advertencia' : 'Info'}
                    </Badge>
                    {!alert.acknowledged && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Reconocer
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de umbrales */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Umbrales de Alerta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Umbrales Críticos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tasa de conversión mínima:</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Llamadas mínimas por día:</span>
                  <span className="font-medium">40</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo máximo de llamada:</span>
                  <span className="font-medium">600s</span>
                </div>
                <div className="flex justify-between">
                  <span>Calidad mínima de llamadas:</span>
                  <span className="font-medium">85%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Umbrales de Advertencia</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tasa de conversión:</span>
                  <span className="font-medium">18%</span>
                </div>
                <div className="flex justify-between">
                  <span>Llamadas por día:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo promedio de llamada:</span>
                  <span className="font-medium">480s</span>
                </div>
                <div className="flex justify-between">
                  <span>Calidad de llamadas:</span>
                  <span className="font-medium">90%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAlerts;
