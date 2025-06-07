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

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  assigned_to: string;
  created_at: string;
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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setLeads(data);
      }
    } catch (error: any) {
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
                  <SelectItem value="NUEVO">Nuevo</SelectItem>
                  <SelectItem value="CONTACTADO">Contactado</SelectItem>
                  <SelectItem value="EN_NEGOCIACION">En Negociación</SelectItem>
                  <SelectItem value="CONVERTIDO">Convertido</SelectItem>
                  <SelectItem value="DESCARTADO">Descartado</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleSourceFilterChange}>
                <SelectTrigger className="md:col-span-1">
                  <SelectValue placeholder="Filtrar por fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las fuentes</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Referido">Referido</SelectItem>
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
                <LeadsListView leads={filteredLeads} loading={loading} />
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
