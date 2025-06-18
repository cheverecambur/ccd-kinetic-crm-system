import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Target,
  Headphones,
  TrendingUp,
  AlertTriangle,
  Database,
  FileText
} from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

const AdminPanel = () => {
  const { user } = useAuth();

  const adminModules = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar asesores, supervisores y permisos',
      icon: Users,
      path: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics Avanzado',
      description: 'KPIs y métricas detalladas con visualizaciones',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Análisis de Rendimiento',
      description: 'Reportes y métricas del equipo',
      icon: TrendingUp,
      path: '/reports',
      color: 'bg-indigo-500'
    },
    {
      title: 'Monitoreo de Calidad',
      description: 'Revisión de llamadas y evaluaciones',
      icon: Headphones,
      path: '/quality',
      color: 'bg-purple-500'
    },
    {
      title: 'Gestión de Campañas',
      description: 'Crear y administrar campañas de marketing',
      icon: Target,
      path: '/campaigns',
      color: 'bg-orange-500'
    },
    {
      title: 'Alertas del Sistema',
      description: 'Monitoreo de alertas de rendimiento',
      icon: AlertTriangle,
      path: '/admin/alerts',
      color: 'bg-red-500'
    },
    {
      title: 'Extracción Vicidial',
      description: 'Sincronizar datos de Vicidial',
      icon: Database,
      path: '/admin/vicidial',
      color: 'bg-cyan-500'
    },
    {
      title: 'Configuración Sistema',
      description: 'Configuraciones generales del CRM',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const quickStats = [
    { label: 'Asesores Activos', value: '24', change: '+2' },
    { label: 'Leads Totales', value: '1,247', change: '+156' },
    { label: 'Llamadas Hoy', value: '340', change: '+45' },
    { label: 'Conversión', value: '12.4%', change: '+1.2%' }
  ];

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Bienvenido, {user?.name}</p>
          </div>
          <Badge className="bg-red-500 text-white">
            <Shield className="h-4 w-4 mr-1" />
            Administrador
          </Badge>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Módulos de administración */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Módulos de Administración</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {adminModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.path}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${module.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Actividad Reciente del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Nuevo asesor registrado</p>
                  <p className="text-sm text-gray-600">Ana Martínez se unió al equipo</p>
                </div>
                <span className="text-sm text-gray-500">Hace 2 horas</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Campaña actualizada</p>
                  <p className="text-sm text-gray-600">Campaña "Promoción Verano" modificada</p>
                </div>
                <span className="text-sm text-gray-500">Hace 4 horas</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Sincronización Vicidial</p>
                  <p className="text-sm text-gray-600">Datos actualizados exitosamente</p>
                </div>
                <span className="text-sm text-gray-500">Hace 6 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IA Assistant especializada para Administración */}
      <AIAssistant 
        context="Panel de Administración - Configuración del sistema y análisis avanzado"
        initialMinimized={true}
      />
    </>
  );
};

export default AdminPanel;
