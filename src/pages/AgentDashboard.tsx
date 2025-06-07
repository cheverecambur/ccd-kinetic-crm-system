
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
  Calendar,
  MessageSquare
} from 'lucide-react';
import QuickActions from '@/components/QuickActions';
import AIAssistant from '@/components/AIAssistant';

const AgentDashboard = () => {
  const { user } = useAuth();

  const agentStats = [
    { label: 'Llamadas Hoy', value: '23', icon: Phone, color: 'text-blue-600' },
    { label: 'Leads Asignados', value: '47', icon: Users, color: 'text-green-600' },
    { label: 'Conversiones', value: '4', icon: Target, color: 'text-orange-600' },
    { label: 'Tiempo Promedio', value: '3:45', icon: Clock, color: 'text-purple-600' }
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
    <>
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
      </div>

      {/* Componente de acciones rápidas flotantes */}
      <QuickActions />

      {/* IA Assistant especializada para Asesores */}
      <AIAssistant 
        context="Dashboard del Asesor - Ventas y gestión de leads"
        initialMinimized={true}
      />
    </>
  );
};

export default AgentDashboard;
