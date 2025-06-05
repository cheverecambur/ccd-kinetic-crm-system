
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Phone, 
  Clock, 
  Users, 
  TrendingUp, 
  Target, 
  RefreshCw,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface AgentStats {
  calls_today: number;
  talk_time_seconds: number;
  wait_time_seconds: number;
  pause_time_seconds: number;
  leads_contacted: number;
  conversions: number;
  status: string;
  last_call_time?: string;
}

interface SystemStats {
  active_agents: number;
  calls_in_progress: number;
  total_calls_today: number;
  average_call_duration: number;
}

const VicidialStats = () => {
  const { user } = useAuth();
  const [agentStats, setAgentStats] = useState<AgentStats>({
    calls_today: 0,
    talk_time_seconds: 0,
    wait_time_seconds: 0,
    pause_time_seconds: 0,
    leads_contacted: 0,
    conversions: 0,
    status: 'LOGGED_OUT'
  });
  const [systemStats, setSystemStats] = useState<SystemStats>({
    active_agents: 0,
    calls_in_progress: 0,
    total_calls_today: 0,
    average_call_duration: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchAgentStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_stats')
        .select('*')
        .eq('user_id', user.user_id || user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching agent stats:', error);
        return;
      }

      if (data) {
        setAgentStats(data);
      }
    } catch (error) {
      console.error('Error fetching agent stats:', error);
    }
  };

  const fetchSystemStats = async () => {
    try {
      // Obtener estadísticas del sistema
      const { data: sessions, error: sessionsError } = await supabase
        .from('agent_sessions')
        .select('*')
        .eq('is_active', true);

      const { data: activeCalls, error: callsError } = await supabase
        .from('active_calls')
        .select('*')
        .is('end_time', null);

      const { data: todayCalls, error: todayError } = await supabase
        .from('call_logs')
        .select('length_in_sec')
        .gte('call_date', new Date().toISOString().split('T')[0]);

      if (sessionsError || callsError || todayError) {
        console.error('Error fetching system stats');
        return;
      }

      const totalCallsToday = todayCalls?.length || 0;
      const totalDuration = todayCalls?.reduce((sum, call) => sum + (call.length_in_sec || 0), 0) || 0;
      const averageDuration = totalCallsToday > 0 ? Math.floor(totalDuration / totalCallsToday) : 0;

      setSystemStats({
        active_agents: sessions?.length || 0,
        calls_in_progress: activeCalls?.length || 0,
        total_calls_today: totalCallsToday,
        average_call_duration: averageDuration
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const refreshStats = async () => {
    setLoading(true);
    await Promise.all([fetchAgentStats(), fetchSystemStats()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [user]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'ON_CALL': return 'bg-blue-500';
      case 'LOGGED_OUT': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estadísticas de Vicidial</h2>
        <Button onClick={refreshStats} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas del Agente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Mi Rendimiento Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Phone className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">{agentStats.calls_today}</span>
              </div>
              <p className="text-sm text-gray-600">Llamadas Realizadas</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">
                  {formatTime(agentStats.talk_time_seconds)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Tiempo en Llamadas</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-600">{agentStats.leads_contacted}</span>
              </div>
              <p className="text-sm text-gray-600">Leads Contactados</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-2xl font-bold text-orange-600">{agentStats.conversions}</span>
              </div>
              <p className="text-sm text-gray-600">Conversiones</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado Actual:</span>
              <Badge className={getStatusColor(agentStats.status)}>
                {agentStats.status}
              </Badge>
            </div>
            
            {agentStats.calls_today > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tiempo en Pausa:</span>
                  <span>{formatTime(agentStats.pause_time_seconds)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Tiempo de Espera:</span>
                  <span>{formatTime(agentStats.wait_time_seconds)}</span>
                </div>
                {agentStats.last_call_time && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Última Llamada:</span>
                    <span>{new Date(agentStats.last_call_time).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estadísticas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">{systemStats.active_agents}</span>
              </div>
              <p className="text-sm text-gray-600">Agentes Activos</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <PhoneCall className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-blue-600">{systemStats.calls_in_progress}</span>
              </div>
              <p className="text-sm text-gray-600">Llamadas en Curso</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Phone className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-purple-600">{systemStats.total_calls_today}</span>
              </div>
              <p className="text-sm text-gray-600">Total Llamadas Hoy</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-2xl font-bold text-orange-600">
                  {formatTime(systemStats.average_call_duration)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Duración Promedio</p>
            </div>
          </div>

          {/* Progress bars para métricas adicionales */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Eficiencia de Agentes</span>
                <span>{systemStats.active_agents > 0 ? Math.round((systemStats.calls_in_progress / systemStats.active_agents) * 100) : 0}%</span>
              </div>
              <Progress 
                value={systemStats.active_agents > 0 ? (systemStats.calls_in_progress / systemStats.active_agents) * 100 : 0} 
                className="h-2" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Actividad del Día</span>
                <span>{Math.min(100, Math.round((systemStats.total_calls_today / 100) * 100))}%</span>
              </div>
              <Progress 
                value={Math.min(100, (systemStats.total_calls_today / 100) * 100)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VicidialStats;
