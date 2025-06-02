import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search,
  Filter,
  Download,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  User,
  Eye,
  Edit,
  Trash2,
  Clock,
  Target,
  Building,
  DollarSign
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  city: string;
  interests: string[];
  createdAt: string;
  lastContact: string;
  assignedTo: string;
  value: number;
  stage: string;
  campaignCode: string;
  totalInteractions: number;
  promotionsShown: number;
  activations: number;
}

const LeadsManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Datos simulados mejorados
  useEffect(() => {
    const sampleLeads: Lead[] = [
      {
        id: '1',
        name: 'Carlos González',
        email: 'carlos.gonzalez@email.com',
        phone: '+57 301 234 5678',
        source: 'Meta Ads',
        status: 'qualified',
        score: 85,
        city: 'Bogotá',
        interests: ['Excel Avanzado', 'Power BI'],
        createdAt: '2024-01-26T10:30:00Z',
        lastContact: '2024-01-26T10:30:00Z',
        assignedTo: 'María García',
        value: 1200000,
        stage: 'proposal',
        campaignCode: 'META_EXCEL_2024_Q1',
        totalInteractions: 8,
        promotionsShown: 3,
        activations: 1
      },
      {
        id: '2',
        name: 'Ana María López',
        email: 'ana.lopez@company.com',
        phone: '+57 320 987 6543',
        source: 'TikTok Ads',
        status: 'contacted',
        score: 92,
        city: 'Medellín',
        interests: ['Contabilidad Digital', 'Excel'],
        createdAt: '2024-01-25T14:20:00Z',
        lastContact: '2024-01-26T09:15:00Z',
        assignedTo: 'Carlos Rodríguez',
        value: 1800000,
        stage: 'contacted',
        campaignCode: 'TIKTOK_CONT_2024_Q1',
        totalInteractions: 12,
        promotionsShown: 4,
        activations: 0
      },
      {
        id: '3',
        name: 'Luis Fernando Torres',
        email: 'luis.torres@gmail.com',
        phone: '+57 315 456 7890',
        source: 'Google Ads',
        status: 'qualified',
        score: 78,
        city: 'Cali',
        interests: ['Project Management'],
        createdAt: '2024-01-24T16:45:00Z',
        lastContact: '2024-01-25T11:30:00Z',
        assignedTo: 'Diana Morales',
        value: 2100000,
        stage: 'qualified',
        campaignCode: 'GOOGLE_MIXED_2024_Q1',
        totalInteractions: 6,
        promotionsShown: 2,
        activations: 0
      },
      {
        id: '4',
        name: 'Patricia Ramírez',
        email: 'patricia.ramirez@hotmail.com',
        phone: '+57 310 789 0123',
        source: 'Instagram',
        status: 'proposal',
        score: 95,
        city: 'Barranquilla',
        interests: ['Finanzas Corporativas', 'Excel Avanzado'],
        createdAt: '2024-01-23T09:20:00Z',
        lastContact: '2024-01-26T08:45:00Z',
        assignedTo: 'Roberto Silva',
        value: 2500000,
        stage: 'proposal',
        campaignCode: 'INSTA_PROJECT_2024_Q1',
        totalInteractions: 15,
        promotionsShown: 5,
        activations: 2
      }
    ];

    setLeads(sampleLeads);
    setFilteredLeads(sampleLeads);
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.campaignCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por fuente
    if (filterSource !== 'all') {
      filtered = filtered.filter(lead => lead.source === filterSource);
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'value':
          return b.value - a.value;
        case 'interactions':
          return b.totalInteractions - a.totalInteractions;
        default:
          return 0;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filterSource, filterStatus, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      activated: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCall = (lead: Lead) => {
    toast({
      title: "Iniciando llamada",
      description: `Conectando con ${lead.name} (${lead.phone})`,
    });
  };

  const handleWhatsApp = (lead: Lead) => {
    const message = encodeURIComponent(`Hola ${lead.name}, soy de CCD Capacitación. Me gustaría conversar contigo sobre nuestros cursos.`);
    const cleanPhone = lead.phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleViewProfile = (lead: Lead) => {
    navigate(`/leads/${lead.id}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedLeads.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un lead",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Acción ejecutada",
      description: `${action} aplicado a ${selectedLeads.length} leads`,
    });
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const selectAllLeads = () => {
    setSelectedLeads(filteredLeads.map(lead => lead.id));
  };

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Leads</h1>
          <p className="text-gray-600">Base de datos completa y gestión de prospectos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nombre Completo</Label>
                  <Input placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="juan@email.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input placeholder="+57 300 123 4567" />
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <Input placeholder="Bogotá" />
                </div>
                <div>
                  <Label>Código de Campaña</Label>
                  <Input placeholder="META_EXCEL_2024_Q1" />
                </div>
                <div>
                  <Label>Fuente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta">Meta Ads</SelectItem>
                      <SelectItem value="tiktok">TikTok Ads</SelectItem>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="organico">Orgánico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewLeadOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Crear Lead
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Promedio</p>
                <p className="text-2xl font-bold">
                  {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold">
                  {formatCurrency(leads.reduce((sum, lead) => sum + lead.value, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activaciones</p>
                <p className="text-2xl font-bold">
                  {leads.reduce((sum, lead) => sum + lead.activations, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las fuentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Orgánico">Orgánico</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="contacted">Contactado</SelectItem>
                <SelectItem value="qualified">Calificado</SelectItem>
                <SelectItem value="proposal">Propuesta</SelectItem>
                <SelectItem value="activated">Activado</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score (Mayor a menor)</SelectItem>
                <SelectItem value="name">Nombre (A-Z)</SelectItem>
                <SelectItem value="created">Fecha creación</SelectItem>
                <SelectItem value="value">Valor potencial</SelectItem>
                <SelectItem value="interactions">Interacciones</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Limpiar
              </Button>
              <Button variant="outline" size="sm" onClick={selectAllLeads}>
                Todos
              </Button>
            </div>
          </div>

          {/* Acciones masivas */}
          {selectedLeads.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedLeads.length} leads seleccionados
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Asignar')}>
                    Asignar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Cambiar estado')}>
                    Cambiar Estado
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Exportar')}>
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            Mostrando {filteredLeads.length} de {leads.length} leads
          </div>
        </CardContent>
      </Card>

      {/* Tabla de leads mejorada */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input 
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={() => selectedLeads.length === filteredLeads.length ? clearSelection() : selectAllLeads()}
                    />
                  </th>
                  <th className="text-left p-3">Lead</th>
                  <th className="text-left p-3">Contacto</th>
                  <th className="text-left p-3">Campaña</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Score</th>
                  <th className="text-left p-3">Actividad</th>
                  <th className="text-left p-3">Valor</th>
                  <th className="text-left p-3">Asignado</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input 
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <h4 className="font-medium">{lead.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {lead.city}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-gray-600">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <Badge variant="outline">{lead.source}</Badge>
                        <div className="text-xs text-gray-600 mt-1 font-mono">
                          {lead.campaignCode}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{lead.totalInteractions} interacciones</div>
                        <div className="text-gray-600">{lead.promotionsShown} promociones</div>
                        <div className="text-green-600">{lead.activations} activaciones</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{formatCurrency(lead.value)}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{lead.assignedTo}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleCall(lead)}>
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleWhatsApp(lead)}>
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewProfile(lead)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsManagement;
