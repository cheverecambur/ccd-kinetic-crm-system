
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Users,
  TrendingUp,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LeadCard from '@/components/LeadCard';

const LeadsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  // Datos de ejemplo para leads
  const leads = [
    {
      id: '1',
      name: 'María González',
      phone: '+57 301 234 5678',
      email: 'maria.gonzalez@email.com',
      city: 'Bogotá',
      status: 'qualified',
      score: 85,
      source: 'Facebook',
      lastContact: '2024-01-26T14:20:00Z',
      nextAction: 'Enviar propuesta de Excel Avanzado'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+57 300 876 5432',
      email: 'carlos.rodriguez@email.com',
      city: 'Medellín',
      status: 'new',
      score: 92,
      source: 'Google',
      lastContact: '2024-01-25T10:15:00Z',
      nextAction: 'Primera llamada de contacto'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      phone: '+57 301 567 8901',
      email: 'ana.martinez@email.com',
      city: 'Cali',
      status: 'contacted',
      score: 78,
      source: 'TikTok',
      lastContact: '2024-01-24T16:30:00Z',
      nextAction: 'Follow-up llamada'
    },
    {
      id: '4',
      name: 'Luis Pérez',
      phone: '+57 315 246 8135',
      email: 'luis.perez@email.com',
      city: 'Barranquilla',
      status: 'proposal',
      score: 95,
      source: 'Referido',
      lastContact: '2024-01-23T09:45:00Z',
      nextAction: 'Seguimiento propuesta enviada'
    },
    {
      id: '5',
      name: 'Sandra López',
      phone: '+57 312 345 6789',
      email: 'sandra.lopez@email.com',
      city: 'Cartagena',
      status: 'qualified',
      score: 88,
      source: 'Instagram',
      lastContact: '2024-01-22T11:20:00Z',
      nextAction: 'Agendar demo personalizada'
    },
    {
      id: '6',
      name: 'Andrés Gómez',
      phone: '+57 318 654 3210',
      city: 'Bucaramanga',
      status: 'new',
      score: 72,
      source: 'Facebook',
      nextAction: 'Primera llamada de contacto'
    }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleViewLead = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const leadStats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-600' },
    { label: 'Calificados', value: leads.filter(l => l.status === 'qualified').length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Nuevos', value: leads.filter(l => l.status === 'new').length, icon: Plus, color: 'text-purple-600' },
    { label: 'En Propuesta', value: leads.filter(l => l.status === 'proposal').length, icon: MessageSquare, color: 'text-orange-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'AGENT' ? 'Mis Leads' : 'Gestión de Leads'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'AGENT' 
              ? 'Gestiona tus leads asignados' 
              : 'Administra y supervisa todos los leads'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {leadStats.map((stat, index) => {
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

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, teléfono o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="contacted">Contactado</SelectItem>
                <SelectItem value="qualified">Calificado</SelectItem>
                <SelectItem value="proposal">Propuesta</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Referido">Referido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onView={handleViewLead}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron leads</h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o crear un nuevo lead.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadsManagement;
