
import React, { useState, useEffect } from 'react';
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
  List,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LeadsListView from '@/components/LeadsListView';
import NewLeadModal from '@/components/NewLeadModal';
import CallbackModal from '@/components/CallbackModal';

interface Lead {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  phone_number?: string;
  email?: string;
  city?: string;
  status: string;
  score: number;
  lead_score?: number;
  source: string;
  source_id?: string;
  course: string;
  interest_course?: string;
  lastContact?: string;
  last_local_call_time?: string;
  nextAction?: string;
  attemptCount: number;
  called_count?: number;
  disposition?: string;
  callbackDate?: string;
  callbackTime?: string;
}

const LeadsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Cargar leads desde la base de datos
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar datos para el componente
      const transformedLeads: Lead[] = data.map(lead => ({
        id: lead.id.toString(),
        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Sin nombre',
        first_name: lead.first_name,
        last_name: lead.last_name,
        phone: lead.phone_number || '',
        phone_number: lead.phone_number,
        email: lead.email,
        city: lead.city || undefined,
        status: lead.status?.toLowerCase() || 'new',
        score: lead.lead_score || 0,
        lead_score: lead.lead_score,
        source: lead.source_id || 'Desconocido',
        source_id: lead.source_id,
        course: lead.interest_course || 'No especificado',
        interest_course: lead.interest_course,
        lastContact: lead.last_local_call_time,
        last_local_call_time: lead.last_local_call_time,
        nextAction: 'Contactar lead',
        attemptCount: lead.called_count || 0,
        called_count: lead.called_count,
        disposition: 'PENDIENTE'
      }));

      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error al cargar leads",
        description: "No se pudieron cargar los leads. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
    navigate('/call-center');
  };

  const handleScheduleCallback = (lead: Lead) => {
    setSelectedLead(lead);
    setShowCallbackModal(true);
  };

  const handleExportLeads = () => {
    try {
      // Preparar datos para exportar
      const exportData = filteredLeads.map(lead => ({
        'ID': lead.id,
        'Nombre': lead.name,
        'Teléfono': lead.phone,
        'Email': lead.email || '',
        'Ciudad': lead.city || '',
        'Estado': lead.status,
        'Score': lead.score,
        'Fuente': lead.source,
        'Curso de Interés': lead.course,
        'Intentos de Llamada': lead.attemptCount,
        'Último Contacto': lead.lastContact || 'Nunca'
      }));

      // Convertir a CSV
      const headers = Object.keys(exportData[0]).join(',');
      const csvContent = exportData.map(row => 
        Object.values(row).map(field => 
          typeof field === 'string' && field.includes(',') ? `"${field}"` : field
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${csvContent}`;
      
      // Descargar archivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${filteredLeads.length} leads a CSV`,
      });
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar el archivo. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const leadStats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-600' },
    { label: 'Nuevos', value: leads.filter(l => l.status === 'new').length, icon: Plus, color: 'text-purple-600' },
    { label: 'Contactados', value: leads.filter(l => l.status === 'contacted').length, icon: Phone, color: 'text-yellow-600' },
    { label: 'Calificados', value: leads.filter(l => l.status === 'qualified').length, icon: TrendingUp, color: 'text-green-600' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'closed': 'bg-gray-100 text-gray-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" onClick={handleExportLeads}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowNewLeadModal(true)}>
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
                <SelectItem value="closed_won">Cerrado - Ganado</SelectItem>
                <SelectItem value="closed_lost">Cerrado - Perdido</SelectItem>
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
                    <p><strong>Ciudad:</strong> {lead.city || 'No especificada'}</p>
                    <p><strong>Curso:</strong> {lead.course}</p>
                    <p><strong>Intentos:</strong> {lead.attemptCount}</p>
                    {lead.nextAction && (
                      <p className="text-blue-600 mt-1">
                        <strong>Próxima acción:</strong> {lead.nextAction}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => handleViewLead(lead.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCall(lead.phone, lead.name, lead.id)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleScheduleCallback(lead)}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredLeads.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron leads</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterSource !== 'all' 
                ? 'Intenta ajustar los filtros para ver más leads.'
                : 'Comienza creando tu primer lead.'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterSource === 'all' && (
              <Button onClick={() => setShowNewLeadModal(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Lead
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onLeadCreated={fetchLeads}
      />

      <CallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
        leadId={selectedLead?.id}
        leadName={selectedLead?.name}
        phoneNumber={selectedLead?.phone}
        onCallbackScheduled={() => {
          fetchLeads();
          setSelectedLead(null);
        }}
      />
    </div>
  );
};

export default LeadsManagement;
