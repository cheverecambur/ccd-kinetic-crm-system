
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Clock,
  User,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  FileText,
  Target,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos de datos para leads
interface Lead {
  id: number;
  vendor_lead_code: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  status: string;
  source_id: string;
  lead_score: number;
  interest_course: string;
  city: string;
  created_at: string;
  last_local_call_time: string | null;
  called_count: number;
  owner: string | null;
  comments: string;
  lead_quality: string;
}

const LeadsManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Datos simulados para desarrollo
  const mockLeads: Lead[] = [
    {
      id: 1,
      vendor_lead_code: 'META_001',
      first_name: 'María',
      last_name: 'González',
      phone_number: '3001234567',
      email: 'maria@email.com',
      status: 'NEW',
      source_id: 'Facebook Ads',
      lead_score: 85,
      interest_course: 'Contabilidad Básica',
      city: 'Bogotá',
      created_at: '2024-01-15T10:30:00Z',
      last_local_call_time: null,
      called_count: 0,
      owner: null,
      comments: 'Lead interesado en curso de contabilidad, trabaja en empresa pequeña',
      lead_quality: 'HOT'
    },
    {
      id: 2,
      vendor_lead_code: 'TIKTOK_001',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      phone_number: '3109876543',
      email: 'carlos@email.com',
      status: 'CONTACT',
      source_id: 'TikTok Ads',
      lead_score: 72,
      interest_course: 'Excel Avanzado',
      city: 'Medellín',
      created_at: '2024-01-15T09:15:00Z',
      last_local_call_time: '2024-01-15T14:30:00Z',
      called_count: 2,
      owner: 'asesor1',
      comments: 'Contactado, solicita información sobre modalidades de pago',
      lead_quality: 'WARM'
    },
    {
      id: 3,
      vendor_lead_code: 'GOOGLE_001',
      first_name: 'Ana',
      last_name: 'López',
      phone_number: '3152468135',
      email: 'ana@email.com',
      status: 'CALLBACK',
      source_id: 'Google Ads',
      lead_score: 90,
      interest_course: 'Marketing Digital',
      city: 'Cali',
      created_at: '2024-01-15T08:45:00Z',
      last_local_call_time: '2024-01-15T13:20:00Z',
      called_count: 1,
      owner: 'asesor2',
      comments: 'Muy interesada, callback programado para mañana 10 AM',
      lead_quality: 'HOT'
    }
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter, scoreFilter]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      // Simulamos carga de datos
      setTimeout(() => {
        setLeads(mockLeads);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los leads",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone_number.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source_id === sourceFilter);
    }

    if (scoreFilter !== 'all') {
      if (scoreFilter === 'high') {
        filtered = filtered.filter(lead => lead.lead_score >= 80);
      } else if (scoreFilter === 'medium') {
        filtered = filtered.filter(lead => lead.lead_score >= 60 && lead.lead_score < 80);
      } else if (scoreFilter === 'low') {
        filtered = filtered.filter(lead => lead.lead_score < 60);
      }
    }

    setFilteredLeads(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-800',
      'CONTACT': 'bg-green-100 text-green-800',
      'CALLBACK': 'bg-yellow-100 text-yellow-800',
      'SALE': 'bg-purple-100 text-purple-800',
      'NO_SALE': 'bg-red-100 text-red-800',
      'DNC': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getQualityColor = (quality: string) => {
    const colors = {
      'HOT': 'text-red-600',
      'WARM': 'text-orange-600',
      'COLD': 'text-blue-600'
    };
    return colors[quality as keyof typeof colors] || 'text-gray-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCall = (lead: Lead) => {
    toast({
      title: "Iniciando llamada",
      description: `Conectando con ${lead.first_name} ${lead.last_name} (${lead.phone_number})`,
    });
  };

  const handleWhatsApp = (lead: Lead) => {
    const message = encodeURIComponent(`Hola ${lead.first_name}, soy de CCD Capacitación. Te contacto por tu interés en ${lead.interest_course}.`);
    window.open(`https://wa.me/57${lead.phone_number}?text=${message}`, '_blank');
  };

  const handleEmail = (lead: Lead) => {
    const subject = encodeURIComponent(`Información sobre ${lead.interest_course} - CCD Capacitación`);
    const body = encodeURIComponent(`Hola ${lead.first_name},\n\nGracias por tu interés en nuestro curso de ${lead.interest_course}.\n\nSaludos,\nEquipo CCD Capacitación`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const LeadDetailPanel = ({ lead }: { lead: Lead }) => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{lead.first_name} {lead.last_name}</CardTitle>
            <p className="text-gray-600">{lead.email} • {lead.phone_number}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant="outline" className={getQualityColor(lead.lead_quality)}>
              {lead.lead_quality}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score y métricas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(lead.lead_score)}`}>
              {lead.lead_score}
            </div>
            <div className="text-sm text-gray-600">Lead Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{lead.called_count}</div>
            <div className="text-sm text-gray-600">Llamadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {lead.last_local_call_time ? 'Sí' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Contactado</div>
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Fuente</Label>
            <p className="mt-1">{lead.source_id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Ciudad</Label>
            <p className="mt-1">{lead.city}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Curso de Interés</Label>
            <p className="mt-1">{lead.interest_course}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Asesor Asignado</Label>
            <p className="mt-1">{lead.owner || 'Sin asignar'}</p>
          </div>
        </div>

        {/* Comentarios */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Comentarios</Label>
          <Textarea 
            value={lead.comments} 
            readOnly 
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Historial de interacciones */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Historial de Interacciones</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Llamada realizada</p>
                <p className="text-xs text-gray-600">Hoy 14:30 - Duración: 5:20 min</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">WhatsApp enviado</p>
                <p className="text-xs text-gray-600">Ayer 16:45 - Mensaje leído</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button onClick={() => handleCall(lead)} className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
          <Button onClick={() => handleWhatsApp(lead)} variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button onClick={() => handleEmail(lead)} variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Leads</h1>
          <p className="text-gray-600">{filteredLeads.length} leads encontrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowNewLeadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="NEW">Nuevo</SelectItem>
                <SelectItem value="CONTACT">Contactado</SelectItem>
                <SelectItem value="CALLBACK">Callback</SelectItem>
                <SelectItem value="SALE">Venta</SelectItem>
                <SelectItem value="NO_SALE">No venta</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los scores</SelectItem>
                <SelectItem value="high">Alto (80+)</SelectItem>
                <SelectItem value="medium">Medio (60-79)</SelectItem>
                <SelectItem value="low">Bajo (&lt;60)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vista de leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de leads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leads ({filteredLeads.length})
                <Button variant="ghost" size="sm" onClick={loadLeads}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {lead.first_name[0]}{lead.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {lead.first_name} {lead.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {lead.phone_number} • {lead.source_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-bold ${getScoreColor(lead.lead_score)}`}>
                            {lead.lead_score}
                          </div>
                          <Badge className={getStatusColor(lead.status)} variant="secondary">
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {lead.interest_course} • {lead.city}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(lead);
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsApp(lead);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmail(lead);
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de detalle */}
        <div>
          {selectedLead ? (
            <LeadDetailPanel lead={selectedLead} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona un lead
                </h3>
                <p className="text-gray-600">
                  Haz clic en un lead de la lista para ver sus detalles completos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nuevos Hoy</p>
                <p className="text-2xl font-bold">
                  {filteredLeads.filter(l => l.status === 'NEW').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(filteredLeads.reduce((acc, l) => acc + l.lead_score, 0) / filteredLeads.length) || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Callbacks</p>
                <p className="text-2xl font-bold">
                  {filteredLeads.filter(l => l.status === 'CALLBACK').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sin Asignar</p>
                <p className="text-2xl font-bold">
                  {filteredLeads.filter(l => !l.owner).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadsManagement;
