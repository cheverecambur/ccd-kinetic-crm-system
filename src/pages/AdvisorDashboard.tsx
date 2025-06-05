import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Users,
  Star,
  TrendingUp,
  BarChart4,
  ListFilter,
  ChevronDown,
  XCircle,
  Bookmark,
  MessageSquare,
  LayoutGrid,
  List
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LeadCard from '@/components/LeadCard';
import LeadsListView from '@/components/LeadsListView';
import { useVicidial } from '@/hooks/useVicidial';

// Tipos de datos
interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  status: string;
  score: number;
  source: string;
  course: string;
  lastContact?: string;
  nextAction?: string;
  callbackTime?: string;
  callbackDate?: string;
  callbackPriority?: string;
  disposition?: string;
  attemptCount: number;
}

const AdvisorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDisposition, setFilterDisposition] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [displayMode, setDisplayMode] = useState('assigned');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { isVicidialConnected, startCall } = useVicidial();

  // Datos simulados de leads (en producción, esto vendría de la API de Vicidial o de una base de datos)
  const leads: Lead[] = [
    {
      id: '1',
      name: 'María González',
      phone: '+51 301 234 5678',
      email: 'maria.gonzalez@email.com',
      city: 'Lima',
      status: 'new',
      score: 85,
      source: 'Facebook',
      course: 'Excel Avanzado',
      lastContact: '2024-05-30',
      nextAction: 'Llamar para explicar promoción',
      disposition: 'NO_CONTESTA',
      attemptCount: 3
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      phone: '+51 300 876 5432',
      email: 'carlos.rodriguez@email.com',
      city: 'Arequipa',
      status: 'contacted',
      score: 92,
      source: 'Google',
      course: 'Marketing Digital',
      lastContact: '2024-06-01',
      nextAction: 'Enviar propuesta comercial',
      callbackDate: '2024-06-05',
      callbackTime: '15:30',
      callbackPriority: 'high',
      disposition: 'MUY_INTERESADO',
      attemptCount: 2
    },
    {
      id: '3',
      name: 'Ana Martínez',
      phone: '+51 301 567 8901',
      email: 'ana.martinez@email.com',
      city: 'Trujillo',
      status: 'qualified',
      score: 78,
      source: 'TikTok',
      course: 'Office 365',
      lastContact: '2024-05-28',
      nextAction: 'Confirmar asistencia a webinar',
      disposition: 'VOLVER_LLAMAR',
      attemptCount: 4
    },
    {
      id: '4',
      name: 'Luis Pérez',
      phone: '+51 315 246 8135',
      city: 'Cusco',
      status: 'proposal',
      score: 95,
      source: 'Referido',
      course: 'Power BI',
      lastContact: '2024-06-02',
      nextAction: 'Confirmar pago',
      disposition: 'SER_VACANTE',
      attemptCount: 3
    },
    {
      id: '5',
      name: 'Sandra López',
      phone: '+51 312 345 6789',
      email: 'sandra.lopez@email.com',
      city: 'Piura',
      status: 'closed',
      score: 88,
      source: 'Instagram',
      course: 'Desarrollo Web',
      lastContact: '2024-05-27',
      nextAction: 'Seguimiento post-venta',
      disposition: 'TRIBULADO',
      attemptCount: 5
    },
    {
      id: '6',
      name: 'Andrés Gómez',
      phone: '+51 318 654 3210',
      city: 'Chiclayo',
      status: 'new',
      score: 72,
      source: 'Facebook',
      course: 'Photoshop Básico',
      disposition: 'EFICAZ',
      attemptCount: 3
    },
    {
      id: '7',
      name: 'Juan Mendoza',
      phone: '+51 991 837 462',
      city: 'Lima',
      status: 'new',
      score: 65,
      source: 'YouTube',
      course: 'SQL Server',
      disposition: 'NO_DESEA',
      attemptCount: 2
    },
    {
      id: '8',
      name: 'Carla Torres',
      phone: '+51 982 736 123',
      email: 'carla.torres@email.com',
      city: 'Huancayo',
      status: 'contacted',
      score: 90,
      source: 'WhatsApp',
      course: 'AutoCAD',
      lastContact: '2024-06-01',
      nextAction: 'Seguimiento a propuesta',
      disposition: 'CLTE_POTENCIAL',
      attemptCount: 1
    }
  ];

  // Datos simulados para citas/callbacks
  const callbacks = [
    {
      id: '1',
      leadName: 'Carlos Rodríguez',
      date: '2024-06-05',
      time: '15:30',
      phone: '+51 300 876 5432',
      priority: 'high',
      notes: 'Cliente solicitó más información sobre planes de pago',
      course: 'Marketing Digital',
      disposition: 'MUY_INTERESADO'
    },
    {
      id: '2',
      leadName: 'Mónica Vargas',
      date: '2024-06-04',
      time: '10:15',
      phone: '+51 945 123 456',
      priority: 'medium',
      notes: 'Debe consultar con su jefe sobre el presupuesto',
      course: 'Excel Macros',
      disposition: 'VOLVER_LLAMAR'
    },
    {
      id: '3',
      leadName: 'Roberto Diaz',
      date: '2024-06-04',
      time: '16:00',
      phone: '+51 987 654 321',
      priority: 'low',
      notes: 'Interesado en promoción de 3 cursos',
      course: 'Paquete Office',
      disposition: 'CLTE_POTENCIAL'
    }
  ];

  // Estadísticas del asesor
  const advisorStats = {
    leadsAssigned: 43,
    leadsContacted: 31,
    conversions: 12,
    conversionRate: '27.9%',
    callsMade: 86,
    callsToday: 15,
    averageScore: 76,
    pendingCallbacks: 5
  };

  // Estado para leads filtrados
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);

  // Tipificaciones para filtro
  const dispositionOptions = [
    { value: 'all', label: 'Todas las tipificaciones' },
    { value: 'NO_CONTESTA', label: 'No Contesta' },
    { value: 'NO_DESEA', label: 'No Desea' },
    { value: 'CLTE_POTENCIAL', label: 'Cliente Potencial' },
    { value: 'VOLVER_LLAMAR', label: 'Volver a Llamar' },
    { value: 'MUY_INTERESADO', label: 'Muy Interesado' },
    { value: 'SER_VACANTE', label: 'Ser Vacante' },
    { value: 'PAGO_INCOMPLETO', label: 'Pago Incompleto' },
    { value: 'TRIBULADO', label: 'Tribulado' },
    { value: 'EFICAZ', label: 'Eficaz' }
  ];

  // Aplicar filtros
  useEffect(() => {
    let result = leads;
    
    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.phone.includes(term) || 
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.course && lead.course.toLowerCase().includes(term))
      );
    }
    
    // Filtro por estado
    if (filterStatus !== 'all') {
      result = result.filter(lead => lead.status === filterStatus);
    }
    
    // Filtro por disposición (tipificación)
    if (filterDisposition !== 'all') {
      result = result.filter(lead => lead.disposition === filterDisposition);
    }
    
    // Filtro por fuente
    if (filterSource !== 'all') {
      result = result.filter(lead => lead.source === filterSource);
    }
    
    // Filtro por modo de visualización
    if (displayMode === 'callbacks') {
      result = result.filter(lead => lead.callbackDate !== undefined);
    } else if (displayMode === 'highpriority') {
      result = result.filter(lead => lead.score >= 85);
    } else if (displayMode === 'pending') {
      result = result.filter(lead => !lead.lastContact);
    } else if (displayMode === 'recent') {
      result = result.filter(lead => {
        if (!lead.lastContact) return false;
        const contactDate = new Date(lead.lastContact);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - contactDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      });
    }
    
    // Ordenamiento
    result = [...result].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'lastContact':
          aValue = a.lastContact ? new Date(a.lastContact).getTime() : 0;
          bValue = b.lastContact ? new Date(b.lastContact).getTime() : 0;
          break;
        case 'attempts':
          aValue = a.attemptCount;
          bValue = b.attemptCount;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredLeads(result);
  }, [searchTerm, filterStatus, filterDisposition, filterSource, displayMode, sortBy, sortOrder]);

  // Manejar ver perfil del lead
  const handleViewLead = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  // Manejar llamada
  const handleCall = (phone: string, leadName: string, leadId: string) => {
    if (isVicidialConnected) {
      startCall({
        phoneNumber: phone.replace(/\D/g, ''),
        phoneCode: '51',
        leadId: leadId,
        leadName: leadName
      });
      
      toast({
        title: "Llamada iniciada",
        description: `Conectando con ${leadName}`
      });
    } else {
      toast({
        title: "Error al iniciar llamada",
        description: "Sistema Vicidial no está conectado",
        variant: "destructive"
      });
    }
  };

  // Manejar callback
  const handleCallback = (callback: any) => {
    handleCall(callback.phone, callback.leadName, callback.id);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard del Asesor</h1>
          <p className="text-gray-600">
            Bienvenido, {user?.name} | {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/call-center')} className="bg-green-600 hover:bg-green-700">
            <Phone className="h-4 w-4 mr-2" />
            Centro de Llamadas
          </Button>
        </div>
      </div>

      {/* Métricas del asesor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Asignados</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{advisorStats.leadsAssigned}</p>
                  <p className="text-sm text-green-600">+3 hoy</p>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 h-1.5 w-full bg-blue-200 rounded-full">
              <div 
                className="h-1.5 bg-blue-500 rounded-full" 
                style={{ width: `${(advisorStats.leadsContacted / advisorStats.leadsAssigned) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {advisorStats.leadsContacted} contactados ({Math.round((advisorStats.leadsContacted / advisorStats.leadsAssigned) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversiones</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{advisorStats.conversions}</p>
                  <p className="text-sm text-green-600">{advisorStats.conversionRate}</p>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({length: 12}).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-8 w-full rounded-sm ${i < advisorStats.conversions ? 'bg-green-500' : 'bg-green-200'}`}
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">Meta mensual: 20 matrículas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Llamadas</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{advisorStats.callsToday}</p>
                  <p className="text-sm text-gray-600">hoy / {advisorStats.callsMade} total</p>
                </div>
              </div>
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {Array.from({length: 7}).map((_, i) => {
                const height = 20 + Math.random() * 30;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500 rounded-t-sm" 
                      style={{ height: `${height}px` }}
                    ></div>
                    <span className="text-xs text-gray-500">{['L','M','X','J','V','S','D'][i]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Callbacks Pendientes</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">{advisorStats.pendingCallbacks}</p>
                  <p className="text-sm text-orange-600">3 para hoy</p>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4 space-y-2">
              {callbacks.slice(0, 2).map((callback, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="truncate">{callback.leadName}</span>
                  <span className="text-gray-600">{callback.time}</span>
                </div>
              ))}
              {advisorStats.pendingCallbacks > 2 && (
                <div className="text-xs text-center text-gray-600">+{advisorStats.pendingCallbacks - 2} más...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Citas para hoy */}
      {callbacks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Callbacks Programados para Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {callbacks.map((callback, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-full rounded-full ${
                      callback.priority === 'high' ? 'bg-red-500' :
                      callback.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{callback.leadName}</p>
                      <p className="text-sm text-gray-600">{callback.phone}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {callback.time}
                        {callback.course && (
                          <span className="ml-2 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                            {callback.course}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {callback.notes && (
                    <div className="mt-2 md:mt-0 text-sm text-gray-600 max-w-md">
                      {callback.notes}
                    </div>
                  )}
                  <div className="mt-2 md:mt-0 flex gap-2 self-end md:self-center">
                    <Button size="sm" onClick={() => handleCallback(callback)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Mis Leads</CardTitle>
          <div className="flex items-center gap-2">
            {/* Selector de vista */}
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
            
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Modos de visualización */}
            <Tabs defaultValue="assigned" value={displayMode} onValueChange={setDisplayMode}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="assigned">Asignados</TabsTrigger>
                <TabsTrigger value="callbacks">Callbacks</TabsTrigger>
                <TabsTrigger value="highpriority">Alta Prioridad</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="recent">Recientes</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros avanzados - condicionales */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
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
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipificación</label>
                  <Select value={filterDisposition} onValueChange={setFilterDisposition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipificación" />
                    </SelectTrigger>
                    <SelectContent>
                      {dispositionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fuente</label>
                  <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fuentes</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Referido">Referido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Ordenamiento */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-500">
                {filteredLeads.length} leads encontrados
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ordenar:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="lastContact">Último contacto</SelectItem>
                    <SelectItem value="attempts">Intentos</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down">
                      <path d="M12 5v14"></path>
                      <path d="m19 12-7 7-7-7"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up">
                      <path d="M12 19V5"></path>
                      <path d="m5 12 7-7 7 7"></path>
                    </svg>
                  )}
                </Button>
              </div>
            </div>
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
            <LeadCardAdvanced 
              key={lead.id} 
              lead={lead} 
              onView={handleViewLead}
              onCall={handleCall}
            />
          ))}
        </div>
      )}

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron leads</h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o contacta a tu supervisor para más asignaciones.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente extendido de LeadCard con información de tipificación
const LeadCardAdvanced = ({ lead, onView, onCall }: { 
  lead: Lead, 
  onView: (id: string) => void,
  onCall: (phone: string, name: string, id: string) => void
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${lead.name}, soy de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp abierto",
      description: `Mensaje enviado a ${lead.name}`,
    });
  };

  const handleEmail = () => {
    if (lead.email) {
      const subject = encodeURIComponent('Información sobre nuestros cursos - CCD Capacitación');
      const body = encodeURIComponent(`Hola ${lead.name},\n\nGracias por tu interés en nuestros cursos.\n\nSaludos,\nEquipo CCD Capacitación`);
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    }
  };

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

  const getDispositionColor = (disposition?: string) => {
    if (!disposition) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      'NO_CONTESTA': 'bg-gray-100 text-gray-800',
      'NO_DESEA': 'bg-red-100 text-red-800',
      'CLTE_POTENCIAL': 'bg-yellow-100 text-yellow-800',
      'VOLVER_LLAMAR': 'bg-blue-100 text-blue-800',
      'MUY_INTERESADO': 'bg-green-100 text-green-800',
      'SER_VACANTE': 'bg-purple-100 text-purple-800',
      'PAGO_INCOMPLETO': 'bg-orange-100 text-orange-800',
      'TRIBULADO': 'bg-green-200 text-green-900',
      'EFICAZ': 'bg-gray-200 text-gray-800'
    };
    
    return colors[disposition] || 'bg-gray-100 text-gray-800';
  };

  const getDispositionName = (code?: string) => {
    if (!code) return '';
    
    const names: Record<string, string> = {
      'NO_CONTESTA': 'No Contesta',
      'NO_DESEA': 'No Desea',
      'CLTE_POTENCIAL': 'Cliente Potencial',
      'VOLVER_LLAMAR': 'Volver a Llamar',
      'MUY_INTERESADO': 'Muy Interesado',
      'SER_VACANTE': 'Ser Vacante',
      'PAGO_INCOMPLETO': 'Pago Incompleto',
      'TRIBULADO': 'Tribulado',
      'EFICAZ': 'Eficaz'
    };
    
    return names[code] || code;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header con nombre y score */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-500" />
                {lead.phone}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-500">Score</span>
              </div>
            </div>
          </div>

          {/* Información del curso e intentos */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
              {lead.course || 'Sin curso específico'}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {lead.attemptCount} intentos
            </div>
          </div>

          {/* Status, source y tipificación */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            {lead.disposition && (
              <Badge variant="outline" className={getDispositionColor(lead.disposition)}>
                {getDispositionName(lead.disposition)}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {lead.source}
            </Badge>
          </div>

          {/* Callback programado */}
          {lead.callbackDate && lead.callbackTime && (
            <div className="flex items-center gap-1 text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">
              <Calendar className="h-4 w-4" />
              <span>Callback: {lead.callbackDate} {lead.callbackTime}</span>
            </div>
          )}

          {/* Información adicional */}
          {lead.lastContact && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Último contacto: {lead.lastContact}
            </div>
          )}

          {lead.nextAction && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              Próxima acción: {lead.nextAction}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onCall(lead.phone, lead.name, lead.id)}
            >
              <Phone className="h-4 w-4 mr-1" />
              Llamar
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            {lead.email && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEmail}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView(lead.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvisorDashboard;
