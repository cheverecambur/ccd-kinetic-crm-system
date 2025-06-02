
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CampaignData {
  campaignCode: string;
  campaignName: string;
  source: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  totalSpent: number;
  totalLeads: number;
  qualifiedLeads: number;
  activatedLeads: number;
  totalRevenue: number;
  costPerLead: number;
  costPerActivation: number;
  roi: number;
  conversionRate: number;
  qualificationRate: number;
  activationRate: number;
  averageLeadScore: number;
  dailyData: Array<{
    date: string;
    spent: number;
    leads: number;
    activations: number;
    revenue: number;
  }>;
}

const CampaignROIAnalysis = () => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('roi');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    // Datos simulados de campañas
    const sampleCampaigns: CampaignData[] = [
      {
        campaignCode: 'META_EXCEL_2024_Q1',
        campaignName: 'Meta Ads - Excel Avanzado Q1 2024',
        source: 'Meta Ads',
        isActive: true,
        startDate: '2024-01-01',
        totalSpent: 2500000,
        totalLeads: 156,
        qualifiedLeads: 89,
        activatedLeads: 23,
        totalRevenue: 34500000,
        costPerLead: 16026,
        costPerActivation: 108696,
        roi: 1280,
        conversionRate: 14.7,
        qualificationRate: 57.1,
        activationRate: 25.8,
        averageLeadScore: 78,
        dailyData: [
          { date: '2024-01-15', spent: 85000, leads: 5, activations: 1, revenue: 1200000 },
          { date: '2024-01-16', spent: 92000, leads: 7, activations: 2, revenue: 2400000 },
          { date: '2024-01-17', spent: 78000, leads: 4, activations: 1, revenue: 1800000 },
          { date: '2024-01-18', spent: 105000, leads: 8, activations: 3, revenue: 4200000 },
          { date: '2024-01-19', spent: 88000, leads: 6, activations: 1, revenue: 1500000 }
        ]
      },
      {
        campaignCode: 'TIKTOK_CONT_2024_Q1',
        campaignName: 'TikTok - Contabilidad Digital Q1',
        source: 'TikTok Ads',
        isActive: true,
        startDate: '2024-01-01',
        totalSpent: 1800000,
        totalLeads: 189,
        qualifiedLeads: 112,
        activatedLeads: 18,
        totalRevenue: 25200000,
        costPerLead: 9524,
        costPerActivation: 100000,
        roi: 1300,
        conversionRate: 9.5,
        qualificationRate: 59.3,
        activationRate: 16.1,
        averageLeadScore: 72,
        dailyData: [
          { date: '2024-01-15', spent: 65000, leads: 8, activations: 1, revenue: 1400000 },
          { date: '2024-01-16', spent: 58000, leads: 6, activations: 0, revenue: 0 },
          { date: '2024-01-17', spent: 72000, leads: 9, activations: 2, revenue: 2800000 },
          { date: '2024-01-18', spent: 68000, leads: 7, activations: 1, revenue: 1400000 },
          { date: '2024-01-19', spent: 75000, leads: 10, activations: 2, revenue: 2800000 }
        ]
      },
      {
        campaignCode: 'GOOGLE_MIXED_2024_Q1',
        campaignName: 'Google Ads - Cursos Mixtos Q1',
        source: 'Google Ads',
        isActive: true,
        startDate: '2024-01-01',
        totalSpent: 2200000,
        totalLeads: 134,
        qualifiedLeads: 95,
        activatedLeads: 21,
        totalRevenue: 31500000,
        costPerLead: 16418,
        costPerActivation: 104762,
        roi: 1332,
        conversionRate: 15.7,
        qualificationRate: 70.9,
        activationRate: 22.1,
        averageLeadScore: 82,
        dailyData: [
          { date: '2024-01-15', spent: 78000, leads: 4, activations: 1, revenue: 1500000 },
          { date: '2024-01-16', spent: 82000, leads: 5, activations: 2, revenue: 3000000 },
          { date: '2024-01-17', spent: 85000, leads: 6, activations: 1, revenue: 1500000 },
          { date: '2024-01-18', spent: 90000, leads: 5, activations: 2, revenue: 3000000 },
          { date: '2024-01-19', spent: 88000, leads: 4, activations: 1, revenue: 1500000 }
        ]
      },
      {
        campaignCode: 'INSTA_PROJECT_2024_Q1',
        campaignName: 'Instagram - Project Management Q1',
        source: 'Instagram',
        isActive: false,
        startDate: '2024-01-01',
        endDate: '2024-01-20',
        totalSpent: 1200000,
        totalLeads: 78,
        qualifiedLeads: 31,
        activatedLeads: 8,
        totalRevenue: 12000000,
        costPerLead: 15385,
        costPerActivation: 150000,
        roi: 900,
        conversionRate: 10.3,
        qualificationRate: 39.7,
        activationRate: 25.8,
        averageLeadScore: 65,
        dailyData: [
          { date: '2024-01-15', spent: 65000, leads: 4, activations: 0, revenue: 0 },
          { date: '2024-01-16', spent: 58000, leads: 3, activations: 1, revenue: 1500000 },
          { date: '2024-01-17', spent: 62000, leads: 5, activations: 1, revenue: 1500000 },
          { date: '2024-01-18', spent: 68000, leads: 4, activations: 0, revenue: 0 },
          { date: '2024-01-19', spent: 70000, leads: 2, activations: 1, revenue: 1500000 }
        ]
      }
    ];

    setCampaigns(sampleCampaigns);
    setFilteredCampaigns(sampleCampaigns);
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    // Filtro por fuente
    if (selectedSource !== 'all') {
      filtered = filtered.filter(campaign => campaign.source === selectedSource);
    }

    // Filtro por estado
    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active';
      filtered = filtered.filter(campaign => campaign.isActive === isActive);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'roi':
          return b.roi - a.roi;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'leads':
          return b.totalLeads - a.totalLeads;
        case 'cost':
          return a.costPerLead - b.costPerLead;
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  }, [campaigns, selectedSource, selectedStatus, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 1000) return 'text-green-600';
    if (roi >= 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadgeColor = (roi: number) => {
    if (roi >= 1000) return 'bg-green-100 text-green-800';
    if (roi >= 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Métricas generales
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalLeads = filteredCampaigns.reduce((sum, c) => sum + c.totalLeads, 0);
  const totalActivations = filteredCampaigns.reduce((sum, c) => sum + c.activatedLeads, 0);
  const overallROI = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent * 100) : 0;
  const averageConversion = filteredCampaigns.length > 0 ? 
    filteredCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / filteredCampaigns.length : 0;

  // Datos para gráfico de comparación
  const comparisonData = filteredCampaigns.map(campaign => ({
    name: campaign.campaignCode.replace(/_/g, ' '),
    ROI: campaign.roi,
    Leads: campaign.totalLeads,
    Activaciones: campaign.activatedLeads,
    'Costo por Lead': campaign.costPerLead
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Análisis de ROI por Campaña</h1>
          <p className="text-gray-600">Rentabilidad detallada y comparación de campañas publicitarias</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalle
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inversión Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI General</p>
                <p className={`text-2xl font-bold ${getROIColor(overallROI)}`}>
                  {overallROI.toFixed(1)}%
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
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversión Promedio</p>
                <p className="text-2xl font-bold">{averageConversion.toFixed(1)}%</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las fuentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">ROI (Mayor a menor)</SelectItem>
                <SelectItem value="revenue">Ingresos</SelectItem>
                <SelectItem value="leads">Cantidad de leads</SelectItem>
                <SelectItem value="cost">Costo por lead</SelectItem>
                <SelectItem value="conversion">Tasa de conversión</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de comparación */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de ROI por Campaña</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any, name: string) => {
                if (name === 'Costo por Lead') {
                  return [formatCurrency(Number(value)), name];
                }
                return [value, name];
              }} />
              <Legend />
              <Bar dataKey="ROI" fill="#10b981" name="ROI %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista detallada de campañas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Campaña</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.campaignCode} className="border">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información básica */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-bold text-lg">{campaign.campaignName}</h3>
                        <Badge className={campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {campaign.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Código:</span>
                          <span className="font-mono text-blue-600">{campaign.campaignCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuente:</span>
                          <Badge variant="outline">{campaign.source}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inicio:</span>
                          <span>{new Date(campaign.startDate).toLocaleDateString('es-ES')}</span>
                        </div>
                        {campaign.endDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fin:</span>
                            <span>{new Date(campaign.endDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Métricas de performance */}
                    <div>
                      <h4 className="font-semibold mb-3">Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>ROI</span>
                            <Badge className={getROIBadgeColor(campaign.roi)}>
                              {campaign.roi.toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress value={Math.min(campaign.roi / 10, 100)} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tasa de Conversión</span>
                            <span className="font-medium">{campaign.conversionRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={campaign.conversionRate * 2} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tasa de Calificación</span>
                            <span className="font-medium">{campaign.qualificationRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={campaign.qualificationRate} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score Promedio</span>
                            <span className="font-medium">{campaign.averageLeadScore}/100</span>
                          </div>
                          <Progress value={campaign.averageLeadScore} />
                        </div>
                      </div>
                    </div>

                    {/* Métricas financieras */}
                    <div>
                      <h4 className="font-semibold mb-3">Financieras</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inversión:</span>
                          <span className="font-medium text-red-600">{formatCurrency(campaign.totalSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ingresos:</span>
                          <span className="font-medium text-green-600">{formatCurrency(campaign.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Beneficio:</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(campaign.totalRevenue - campaign.totalSpent)}
                          </span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo por Lead:</span>
                          <span className="font-medium">{formatCurrency(campaign.costPerLead)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Costo por Activación:</span>
                          <span className="font-medium">{formatCurrency(campaign.costPerActivation)}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Leads Totales:</span>
                          <span className="font-medium">{campaign.totalLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calificados:</span>
                          <span className="font-medium">{campaign.qualifiedLeads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activados:</span>
                          <span className="font-bold text-green-600">{campaign.activatedLeads}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertas y recomendaciones */}
                  <div className="mt-4 pt-4 border-t">
                    {campaign.roi < 500 && (
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">ROI bajo - Revisar estrategia de campaña</span>
                      </div>
                    )}
                    {campaign.conversionRate < 10 && (
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Tasa de conversión baja - Optimizar landing page</span>
                      </div>
                    )}
                    {campaign.roi >= 1000 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Excelente performance - Considerar aumentar presupuesto</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignROIAnalysis;
