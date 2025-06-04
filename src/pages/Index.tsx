
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard,
  Users,
  Phone,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirects
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'AGENT') {
    return <Navigate to="/advisor-dashboard" replace />;
  }

  // Default dashboard for supervisors and other roles
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido, {user.name}
            </h1>
            <p className="text-gray-600">
              Panel de control principal - CCD Capacitación CRM
            </p>
          </div>
          <Badge className="bg-blue-600 text-white w-fit">
            {user.role}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Totales</p>
                <p className="text-2xl font-bold text-gray-900">248</p>
                <p className="text-xs text-green-600 mt-1">+12% este mes</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversiones</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-xs text-green-600 mt-1">+8% este mes</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Llamadas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-blue-600 mt-1">Meta: 200</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiencia</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-green-600 mt-1">+3% esta semana</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gestionar Leads
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Ir a Call Center
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="outline">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Ver Reportes
              </div>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">Lead contactado exitosamente</p>
                  <p className="text-xs text-gray-600">María González - Interesada en Excel Avanzado</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white text-xs">Exitoso</Badge>
                  <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">Callback programado</p>
                  <p className="text-xs text-gray-600">Carlos Pérez - Mañana 10:00 AM</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-yellow-500 text-white text-xs">Pendiente</Badge>
                  <p className="text-xs text-gray-500 mt-1">Hace 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">Nuevo lead asignado</p>
                  <p className="text-xs text-gray-600">Ana López - Fuente: Facebook</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500 text-white text-xs">Nuevo</Badge>
                  <p className="text-xs text-gray-500 mt-1">Hace 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
