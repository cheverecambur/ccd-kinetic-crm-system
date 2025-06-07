
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LeadsListView from '@/components/LeadsListView';
import NewLeadModal from '@/components/NewLeadModal';
import AIAssistant from '@/components/AIAssistant';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Plus,
  BarChart3,
  UserPlus,
  TrendingUp,
  Calendar
} from 'lucide-react';

// Interface for the component's Lead type (matching LeadsListView expectations)
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  assigned_to: string;
  created_at: string;
  city: string;
  score: number;
  course: string;
  attemptCount: number;
}

// Database Lead type (from Supabase)
interface DatabaseLead {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone_number: string;
  email: string | null;
  status: string | null;
  source_id: string | null;
  user_id: string | null;
  created_at: string;
  city: string | null;
  interest_course: string | null;
  lead_score: number | null;
  called_count: number | null;
  [key: string]: any;
}

const LeadsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // Function to map database lead to component lead interface
  const mapDatabaseLeadToComponentLead = (dbLead: DatabaseLead): Lead => {
    const fullName = [dbLead.first_name, dbLead.last_name].filter(Boolean).join(' ') || 'Sin nombre';
    return {
      id: dbLead.id.toString(),
      name: fullName,
      phone: dbLead.phone_number || '',
      email: dbLead.email || '',
      status: dbLead.status || 'NEW',
      source: dbLead.source_id || 'Desconocido',
      assigned_to: dbLead.user_id || '',
      created_at: dbLead.created_at,
      city: dbLead.city || 'No especificada',
      score: dbLead.lead_score || 0,
      course: dbLead.interest_course || 'No especificado',
      attemptCount: dbLead.called_count || 0
    };
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map database leads to component interface
        const mappedLeads = data.map(mapDatabaseLeadToComponentLead);
        setLeads(mappedLeads);
      }
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const searchMatch = searchTerm
      ? lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const statusMatch = statusFilter ? lead.status === statusFilter : true;
    const sourceMatch = sourceFilter ? lead.source === sourceFilter : true;

    return searchMatch && statusMatch && sourceMatch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
  };

  const handleCreateLead = () => {
    setShowNewLeadModal(true);
  };

  const handleLeadCreated = () => {
    fetchLeads(); // Refresh the leads list
    toast({
      title: "Lead creado",
      description: "El nuevo lead ha sido agregado exitosamente",
    });
  };

  const handleCall = (phone: string, name: string, id: string) => {
    console.log('Iniciando llamada:', { phone, name, id });
    toast({
      title: "Iniciando llamada",
      description: `Llamando a ${name} - ${phone}`,
    });
  };

  const handleView = (id: string) => {
    console.log('Viendo lead:', id);
    toast({
      title: "Ver lead",
      description: `Mostrando detalles del lead ${id}`,
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Leads</h1>
            <p className="text-gray-600">Administra y califica tus prospectos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateLead}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Lead
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="search"
                placeholder="Buscar lead..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="md:col-span-1"
              />
              <Select onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="CONTACTED">Contactado</SelectItem>
                  <SelectItem value="INTERESTED">Interesado</SelectItem>
                  <SelectItem value="QUALIFIED">Calificado</SelectItem>
                  <SelectItem value="CLOSED_WON">Venta Cerrada</SelectItem>
                  <SelectItem value="CLOSED_LOST">Perdido</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleSourceFilterChange}>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Filtrar por fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las fuentes</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Referido">Referido</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <Users className="h-4 w-4 mr-2" />
                  Lista de Leads
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analíticas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Cargando leads...</span>
                  </div>
                ) : (
                  <LeadsListView 
                    leads={filteredLeads} 
                    onCall={handleCall}
                    onView={handleView}
                  />
                )}
              </TabsContent>
              <TabsContent value="analytics" className="p-4">
                <div>
                  <h3 className="font-semibold">Analíticas de Leads</h3>
                  <p className="text-sm text-gray-500">
                    Gráficos y métricas sobre tus leads
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onLeadCreated={handleLeadCreated}
      />

      {/* IA Assistant especializada para Gestión de Leads */}
      <AIAssistant 
        context="Gestión de Leads - Análisis y seguimiento de prospectos"
        initialMinimized={true}
      />
    </>
  );
};

export default LeadsManagement;
