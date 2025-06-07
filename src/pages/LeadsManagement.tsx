
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Users,
  TrendingUp,
  Phone,
  MessageSquare,
  LayoutGrid,
  List
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LeadsListView from '@/components/LeadsListView';

const LeadsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Datos de ejemplo para leads con todos los campos requeridos
  const leads = [
    {
      id: '1',
      name: 'María González',
      phone: '+51 301 234 5678',
      email: 'maria.gonzalez@email.com',
      city: 'Lima',
      status: 'qualified',
      score: 85,
      source: 'Facebook',
      course: 'Excel Avanzado',
      lastContact: '2024-01-26T14:20:00Z',
      nextAction: 'Enviar propuesta de Excel Avanzado',
      attemptCount: 3,
      disposition: 'MUY_INTERESADO',
      callbackDate: '2024-01-27',
      callbackTime: '14:00'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+51 300 876 5432',
      email: 'carlos.rodriguez@email.com',
      city: 'Arequipa',
      status: 'new',
      score: 92,
      source: 'Google',
      course: 'Contabilidad Básica',
      lastContact: '2024-01-25T10:15:00Z',
      nextAction: 'Primera llamada de contacto',
      attemptCount: 1,
      disposition: 'NO_CONTESTA'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      phone: '+51 301 567 8901',
      email: 'ana.martinez@email.com',
      city: 'Trujillo',
      status: 'contacted',
      score: 78,
      source: 'TikTok',
      course: 'Marketing Digital',
      lastContact: '2024-01-24T16:30:00Z',
      nextAction: 'Follow-up llamada',
      attemptCount: 2,
      disposition: 'CLTE_POTENCIAL'
    },
    {
      id: '4',
      name: 'Luis Pérez',
      phone: '+51 315 246 8135',
      email: 'luis.perez@email.com',
      city: 'Cusco',
      status: 'proposal',
      score: 95,
      source: 'Referido',
      course: 'Administración',
      lastContact: '2024-01-23T09:45:00Z',
      nextAction: 'Seguimiento propuesta enviada',
      attemptCount: 4,
      disposition: 'VOLVER_LLAMAR',
      callbackDate: '2024-01-28',
      callbackTime: '10:00'
    },
    {
      id: '5',
      name: 'Sandra López',
      phone: '+51 312 345 6789',
      email: 'sandra.lopez@email.com',
      city: 'Piura',
      status: 'qualified',
      score: 88,
      source: 'Instagram',
      course: 'Recursos Humanos',
      lastContact: '2024-01-22T11:20:00Z',
      nextAction: 'Agendar demo personalizada',
      attemptCount: 2,
      disposition: 'MUY_INTERESADO'
    },
    {
      id: '6',
      name: 'Andrés Gómez',
      phone: '+51 318 654 3210',
      city: 'Chiclayo',
      status: 'new',
      score: 72,
      source: 'Facebook',
      course: 'Office Básico',
      nextAction: 'Primera llamada de contacto',
      attemptCount: 0,
      disposition: 'NO_CONTESTA'
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

  const handleCall = (phone: string, name: string, id: string) => {
    console.log('Iniciando llamada:', { phone, name, id });
    // Aquí iría la integración con Vicidial
    navigate('/call-center');
  };

  const leadStats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-600' },
    { label: 'Calificados', value: leads.filter(l => l.status === 'qualified').length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Nuevos', value: leads.filter(l => l.status === 'new').length, icon: Plus, color: 'text-purple-600' },
    { label: 'En Propuesta', value: leads.filter(l => l.status === 'proposal').length, icon: MessageSquare, color: 'text-orange-600' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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

      {/* Lista de leads - Vista condicional */}
      {viewMode === 'list' ? (
        <LeadsListView 
          leads={filteredLeads}
          onCall={handleCall}
          onView={handleViewLead}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                      {lead.email && <p className="text-sm text-gray-500">{lead.email}</p>}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{lead.score}</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Ciudad:</strong> {lead.city}</p>
                    <p><strong>Curso:</strong> {lead.course}</p>
                    {lead.nextAction && (
                      <p className="text-blue-600 mt-1">
                        <strong>Próxima acción:</strong> {lead.nextAction}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => handleViewLead(lead.id)}>
                      Ver Perfil
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCall(lead.phone, lead.name, lead.id)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
