
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Users, 
  TrendingUp, 
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();

  const agentStats = [
    { label: 'Llamadas Hoy', value: '23', icon: Phone, color: 'text-blue-600' },
    { label: 'Leads Asignados', value: '47', icon: Users, color: 'text-green-600' },
    { label: 'Conversiones', value: '4', icon: Target, color: 'text-orange-600' },
    { label: 'Tiempo Promedio', value: '3:45', icon: Clock, color: 'text-purple-600' }
  ];

  const todayTasks = [
    { 
      id: 1, 
      lead: 'María García', 
      phone: '+57 301 234 5678', 
      type: 'Callback', 
      time: '10:30 AM',
      priority: 'high' 
    },
    { 
      id: 2, 
      lead: 'Carlos López', 
      phone: '+57 300 876 5432', 
      type: 'Follow-up', 
      time: '11:15 AM',
      priority: 'medium' 
    },
    { 
      id: 3, 
      lead: 'Ana Martínez', 
      phone: '+57 301 567 8901', 
      type: 'New Lead', 
      time: '2:00 PM',
      priority: 'low' 
    }
  ];

  const quickActions = [
    {
      title: 'Hacer Llamada',
      description: 'Iniciar nueva llamada',
      icon: Phone,
      path: '/callcenter',
      color: 'bg-green-500'
    },
    {
      title: 'Mis Leads',
      description: 'Ver leads asignados',
      icon: Users,
      path: '/leads',
      color: 'bg-blue-500'
    },
    {
      title: 'Mi Rendimiento',
      description: 'Ver estadísticas personales',
      icon: TrendingUp,
      path: '/advisor-performance',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard del Asesor</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500 text-white">
            Extensión: {user?.extension}
          </Badge>
          <Badge variant="outline">
            {user?.user_group}
          </Badge>
        </div>
      </div>

      {/* Estadísticas del asesor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {agentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} to={action.path}>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tareas del día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tareas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{task.lead}</p>
                      <p className="text-sm text-gray-600">{task.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{task.type}</Badge>
                    <p className="text-sm text-gray-600 mt-1">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mi Rendimiento Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">89%</div>
              <p className="text-sm text-gray-600">Tasa de Contacto</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <p className="text-sm text-gray-600">Llamadas Realizadas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">14</div>
              <p className="text-sm text-gray-600">Conversiones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;
