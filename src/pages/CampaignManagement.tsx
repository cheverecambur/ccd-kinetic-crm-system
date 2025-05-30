
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Phone,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Play,
  Pause,
  Square,
  Settings,
  Edit,
  Plus,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'paused' | 'completed';
  leads: number;
  conversions: number;
  conversionRate: number;
  cpl: number;
  totalSpent: number;
  revenue: number;
  roi: number;
  startDate: string;
  endDate: string;
  dailyBudget: number;
  targetAudience: string;
  adFormat: string;
}

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data para campañas
  const mockCampaigns: Campaign[] = [
    {
      id: 'fb_001',
      name: 'Contabilidad Básica - Bogotá',
      source: 'Facebook',
      status: 'active',
      leads: 1250,
      conversions: 287,
      conversionRate: 23.0,
      cpl: 12500,
      totalSpent: 15625000,
      revenue: 85830000,
      roi: 449,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dailyBudget: 500000,
      targetAudience: 'Mujeres 25-45, Interés en finanzas',
      adFormat: 'Video + Carousel'
    },
    {
      id: 'tiktok_001',
      name: 'Excel Avanzado - Jóvenes',
      source: 'TikTok',
      status: 'active',
      leads: 890,
      conversions: 201,
      conversionRate: 22.6,
      cpl: 15200,
      totalSpent: 13528000,
      revenue: 70349000,
      roi: 420,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      dailyBudget: 450000,
      targetAudience: 'Hombres y Mujeres 18-35, Estudiantes',
      adFormat: 'Video Vertical'
    },
    {
      id: 'google_001',
      name: 'Marketing Digital - Emprendedores',
      source: 'Google',
      status: 'paused',
      leads: 456,
      conversions: 89,
      conversionRate: 19.5,
      cpl: 18500,
      totalSpent: 8436000,
      revenue: 44411000,
      roi: 426,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      dailyBudget: 300000,
      targetAudience: 'Emprendedores, Dueños de negocio',
      adFormat: 'Search + Display'
    },
    {
      id: 'ig_001',
      name: 'Nómina - Profesionales RH',
      source: 'Instagram',
      status: 'active',
      leads: 678,
      conversions: 145,
      conversionRate: 21.4,
      cpl: 14800,
      totalSpent: 10034400,
      revenue: 57855000,
      roi: 476,
      startDate: '2024-01-08',
      endDate: '2024-02-08',
      dailyBudget: 350000,
      targetAudience: 'Profesionales RH, 28-50 años',
      adFormat: 'Stories + Feed'
    }
  ];

  // Datos para gráficos
  const performanceData = [
    { date: '01/01', leads: 45, conversions: 9, spent: 450000 },
    { date: '02/01', leads: 52, conversions: 12, spent: 520000 },
    { date: '03/01', leads: 38, conversions: 8, spent: 380000 },
    { date: '04/01', leads: 65, conversions: 15, spent: 650000 },
    { date: '05/01', leads: 48, conversions: 11, spent: 480000 },
    { date: '06/01', leads: 59, conversions: 14, spent: 590000 },
    { date: '07/01', leads: 42, conversions: 9, spent: 420000 },
  ];

  const sourceDistribution = [
    { name: 'Facebook', value: 45, color: '#1877F2' },
    { name: 'TikTok', value: 25, color: '#000000' },
    { name: 'Google', value: 20, color: '#4285F4' },
    { name: 'Instagram', value: 10, color: '#E4405F' },
  ];

  useEffect(() => {
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <Square className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        toast({
          title: newStatus === 'active' ? "Campaña activada" : "Campaña pausada",
          description: `${campaign.name} ha sido ${newStatus === 'active' ? 'activada' : 'pausada'}`,
        });
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesSource = filterSource === 'all' || campaign.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Campañas</h1>
          <p className="text-gray-600">{filteredCampaigns.length} campañas activas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Métricas globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, camp) => acc + camp.leads, 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversiones</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, camp) => acc + camp.conversions, 0)}
                </p>
                <p className="text-xs text-green-600">+8% vs mes anterior</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inversión Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(campaigns.reduce((acc, camp) => acc + camp.totalSpent, 0))}
                </p>
                <p className="text-xs text-red-600">+15% vs mes anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI Promedio</p>
                <p className="text-2xl font-bold">
                  {Math.round(campaigns.reduce((acc, camp) => acc + camp.roi, 0) / campaigns.length)}%
                </p>
                <p className="text-xs text-green-600">+5% vs mes anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Buscar campañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimización</TabsTrigger>
        </TabsList>

        {/* Lista de campañas */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusIcon(campaign.status)}
                          <span className="ml-1 capitalize">{campaign.status}</span>
                        </Badge>
                        <Badge variant="outline">{campaign.source}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Leads</p>
                          <p className="text-xl font-bold">{campaign.leads.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversiones</p>
                          <p className="text-xl font-bold text-green-600">{campaign.conversions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conv. Rate</p>
                          <p className="text-xl font-bold">{campaign.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CPL</p>
                          <p className="text-xl font-bold">{formatCurrency(campaign.cpl)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Inversión</p>
                          <p className="text-xl font-bold">{formatCurrency(campaign.totalSpent)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className={`text-xl font-bold ${campaign.roi > 300 ? 'text-green-600' : campaign.roi > 200 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {campaign.roi}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Presupuesto diario: {formatCurrency(campaign.dailyBudget)}</span>
                          <span>Audiencia: {campaign.targetAudience}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={campaign.status === 'active' ? "destructive" : "default"}
                            onClick={() => toggleCampaignStatus(campaign.id)}
                          >
                            {campaign.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Ver Detalle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rendimiento */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Leads y Conversiones</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Fuente</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={sourceDistribution} cx="50%" cy="50%" outerRadius={80}>
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {sourceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inversión Diaria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Inversión']} />
                    <Bar dataKey="spent" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPL Promedio</span>
                  <span className="font-bold">{formatCurrency(15200)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPA Promedio</span>
                  <span className="font-bold">{formatCurrency(67300)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROAS</span>
                  <span className="font-bold text-green-600">4.2x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CTR Promedio</span>
                  <span className="font-bold">2.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Frecuencia</span>
                  <span className="font-bold">1.9</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mejor Horario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">10:00 - 12:00</span>
                    <span className="text-sm font-bold">28% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">14:00 - 16:00</span>
                    <span className="text-sm font-bold">25% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">19:00 - 21:00</span>
                    <span className="text-sm font-bold">22% conv.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mejor Audiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mujeres 25-35</span>
                    <span className="text-sm font-bold">31% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hombres 35-45</span>
                    <span className="text-sm font-bold">27% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Estudiantes</span>
                    <span className="text-sm font-bold">24% conv.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mejor Formato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Video</span>
                    <span className="text-sm font-bold">29% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Carousel</span>
                    <span className="text-sm font-bold">26% conv.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Imagen</span>
                    <span className="text-sm font-bold">21% conv.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Embudo de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Impresiones</span>
                  <div className="flex items-center gap-2">
                    <Progress value={100} className="w-32" />
                    <span className="text-sm font-bold">2,450,000</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clics</span>
                  <div className="flex items-center gap-2">
                    <Progress value={2.8} className="w-32" />
                    <span className="text-sm font-bold">68,600 (2.8%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Leads</span>
                  <div className="flex items-center gap-2">
                    <Progress value={42} className="w-32" />
                    <span className="text-sm font-bold">3,274 (4.8%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversiones</span>
                  <div className="flex items-center gap-2">
                    <Progress value={22} className="w-32" />
                    <span className="text-sm font-bold">722 (22%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimización */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Alertas de Optimización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Facebook - Contabilidad Básica:</strong> CPL aumentó 30% en las últimas 24h. Considerar ajustar audiencia.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <strong>TikTok - Excel Avanzado:</strong> Frecuencia alta (3.2). Recomienda expandir audiencia o rotar creativos.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Instagram - Nómina:</strong> Excelente rendimiento. Considerar aumentar presupuesto en 20%.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <h4 className="font-medium text-green-700">Aumentar presupuesto</h4>
                  <p className="text-sm text-gray-600">Instagram - Nómina: +25% presupuesto puede generar +40 conversiones/mes</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <h4 className="font-medium text-yellow-700">Optimizar horarios</h4>
                  <p className="text-sm text-gray-600">Concentrar budget en horarios 10-12h y 19-21h para +15% conversiones</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-blue-700">Nuevas audiencias</h4>
                  <p className="text-sm text-gray-600">Crear lookalike de conversos para escalar campañas exitosas</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Optimización Automática</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <RefreshCw className="h-6 w-6 mb-2" />
                  <span>Sincronizar Métricas</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Reporte Detallado</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagement;
