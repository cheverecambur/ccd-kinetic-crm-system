
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface VicidialConnection {
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  recordsProcessed: number;
  errors: number;
}

interface RealTimeMetrics {
  activeAgents: number;
  callsInProgress: number;
  queuedCalls: number;
  totalCallsToday: number;
  averageWaitTime: number;
  lastUpdate: Date;
}

const VicidialDataExtractor = () => {
  const [connection, setConnection] = useState<VicidialConnection>({
    status: 'connected',
    lastSync: new Date(),
    recordsProcessed: 0,
    errors: 0
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    activeAgents: 12,
    callsInProgress: 8,
    queuedCalls: 3,
    totalCallsToday: 247,
    averageWaitTime: 45,
    lastUpdate: new Date()
  });

  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    // Simular conexión en tiempo real con Vicidial
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        callsInProgress: Math.max(0, prev.callsInProgress + Math.floor(Math.random() * 3) - 1),
        queuedCalls: Math.max(0, prev.queuedCalls + Math.floor(Math.random() * 2) - 1),
        totalCallsToday: prev.totalCallsToday + Math.floor(Math.random() * 2),
        averageWaitTime: Math.max(15, prev.averageWaitTime + Math.floor(Math.random() * 10) - 5),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const extractVicidialData = async () => {
    setIsExtracting(true);
    try {
      // Simular extracción de datos de Vicidial
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de extracción de Vicidial
      // const { data, error } = await supabase.from('call_logs').insert([...]);
      
      setConnection(prev => ({
        ...prev,
        lastSync: new Date(),
        recordsProcessed: prev.recordsProcessed + Math.floor(Math.random() * 50) + 10,
        status: 'connected'
      }));
    } catch (error) {
      setConnection(prev => ({
        ...prev,
        status: 'error',
        errors: prev.errors + 1
      }));
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado de conexión Vicidial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Conexión Vicidial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {connection.status === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge className={connection.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}>
                {connection.status === 'connected' ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600">Última Sincronización</div>
              <div className="font-medium">{connection.lastSync.toLocaleTimeString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Registros Procesados</div>
              <div className="font-medium">{connection.recordsProcessed.toLocaleString()}</div>
            </div>
            <div>
              <Button 
                onClick={extractVicidialData} 
                disabled={isExtracting}
                className="w-full"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Extrayendo...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Extraer Datos
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas en tiempo real */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas en Tiempo Real</CardTitle>
          <p className="text-sm text-gray-600">
            Última actualización: {realTimeMetrics.lastUpdate.toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{realTimeMetrics.activeAgents}</div>
              <div className="text-sm text-gray-600">Asesores Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{realTimeMetrics.callsInProgress}</div>
              <div className="text-sm text-gray-600">Llamadas en Curso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{realTimeMetrics.queuedCalls}</div>
              <div className="text-sm text-gray-600">En Cola</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{realTimeMetrics.totalCallsToday}</div>
              <div className="text-sm text-gray-600">Total Hoy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{realTimeMetrics.averageWaitTime}s</div>
              <div className="text-sm text-gray-600">Tiempo Espera Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VicidialDataExtractor;
