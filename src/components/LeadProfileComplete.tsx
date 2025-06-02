
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  TrendingUp, 
  User, 
  Tag, 
  Target,
  Clock,
  Activity,
  MessageSquare,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LeadPromotion {
  id: string;
  promotionCode: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  validUntil: string;
  status: 'active' | 'expired' | 'used' | 'pending';
  interestLevel: 1 | 2 | 3 | 4 | 5;
  dateShown: string;
  responseDate?: string;
  notes: string;
  createdBy: string;
}

interface LeadInteraction {
  id: string;
  date: string;
  type: 'call' | 'whatsapp' | 'email' | 'sms' | 'meeting' | 'promotion_sent' | 'promotion_viewed' | 'activation';
  channel: string;
  agent: string;
  duration?: number;
  outcome: string;
  nextAction?: string;
  notes: string;
  promotionId?: string;
  isPrivate: boolean;
  attachments?: string[];
}

interface LeadCampaign {
  campaignCode: string;
  campaignName: string;
  source: string;
  medium: string;
  term?: string;
  content?: string;
  cost: number;
  dateAdded: string;
  isActive: boolean;
}

interface LeadActivation {
  id: string;
  activatedDate: string;
  activatedBy: string;
  activationMethod: 'call' | 'whatsapp' | 'email' | 'meeting';
  productPurchased: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes: string;
  followUpRequired: boolean;
  satisfactionScore?: number;
}

interface Lead {
  id: string;
  phone: string;
  name: string;
  email?: string;
  city: string;
  status: string;
  score: number;
  stage: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  totalInteractions: number;
  campaign: LeadCampaign;
  promotions: LeadPromotion[];
  interactions: LeadInteraction[];
  activations: LeadActivation[];
  totalRevenue: number;
  roi: number;
  nextScheduledAction?: string;
  tags: string[];
}

const LeadProfileComplete = ({ leadPhone }: { leadPhone: string }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simular carga de datos del lead por teléfono
    const loadLeadData = () => {
      const sampleLead: Lead = {
        id: '1',
        phone: '+57 301 234 5678',
        name: 'Carlos González Martínez',
        email: 'carlos.gonzalez@email.com',
        city: 'Bogotá',
        status: 'qualified',
        score: 85,
        stage: 'proposal',
        assignedTo: 'María García',
        createdAt: '2024-01-15T10:30:00Z',
        lastContact: '2024-01-26T14:20:00Z',
        totalInteractions: 12,
        campaign: {
          campaignCode: 'META_EXCEL_2024_Q1',
          campaignName: 'Meta Ads - Excel Avanzado Q1 2024',
          source: 'Meta Ads',
          medium: 'cpc',
          term: 'excel avanzado',
          content: 'carousel_video',
          cost: 15000,
          dateAdded: '2024-01-15T10:30:00Z',
          isActive: true
        },
        promotions: [
          {
            id: '1',
            promotionCode: 'EXCEL50_JAN',
            productName: 'Excel Avanzado + Power BI',
            originalPrice: 450000,
            discountedPrice: 225000,
            discountPercentage: 50,
            validUntil: '2024-01-31T23:59:59Z',
            status: 'active',
            interestLevel: 5,
            dateShown: '2024-01-20T15:30:00Z',
            responseDate: '2024-01-21T10:15:00Z',
            notes: 'Muy interesado, preguntó por modalidades de pago',
            createdBy: 'María García'
          },
          {
            id: '2',
            promotionCode: 'COMBO_CONT_30',
            productName: 'Combo Contabilidad Digital',
            originalPrice: 800000,
            discountedPrice: 560000,
            discountPercentage: 30,
            validUntil: '2024-02-15T23:59:59Z',
            status: 'pending',
            interestLevel: 3,
            dateShown: '2024-01-25T09:00:00Z',
            notes: 'Enviado por WhatsApp, pendiente respuesta',
            createdBy: 'Carlos Rodríguez'
          }
        ],
        interactions: [
          {
            id: '1',
            date: '2024-01-26T14:20:00Z',
            type: 'call',
            channel: 'Teléfono',
            agent: 'María García',
            duration: 480,
            outcome: 'Interesado en propuesta',
            nextAction: 'Enviar propuesta formal',
            notes: 'Lead muy interesado en Excel Avanzado. Trabaja en área contable de empresa mediana. Tiene presupuesto aprobado. Solicitó información sobre modalidades de pago y certificación.',
            isPrivate: false
          },
          {
            id: '2',
            date: '2024-01-25T09:15:00Z',
            type: 'whatsapp',
            channel: 'WhatsApp',
            agent: 'Carlos Rodríguez',
            outcome: 'Información enviada',
            notes: 'Envío de brochure y promoción especial COMBO_CONT_30',
            promotionId: '2',
            isPrivate: false
          },
          {
            id: '3',
            date: '2024-01-20T15:30:00Z',
            type: 'promotion_sent',
            channel: 'Email',
            agent: 'María García',
            outcome: 'Promoción enviada',
            notes: 'Promoción EXCEL50_JAN enviada por email con video explicativo',
            promotionId: '1',
            isPrivate: false
          }
        ],
        activations: [
          {
            id: '1',
            activatedDate: '2024-01-10T16:45:00Z',
            activatedBy: 'María García',
            activationMethod: 'call',
            productPurchased: 'Curso Básico de Excel',
            amount: 150000,
            paymentMethod: 'Tarjeta de crédito',
            paymentStatus: 'completed',
            notes: 'Primera compra exitosa. Cliente muy satisfecho con la atención.',
            followUpRequired: true,
            satisfactionScore: 5
          }
        ],
        totalRevenue: 150000,
        roi: 900, // (150000 - 15000) / 15000 * 100
        nextScheduledAction: '2024-01-27T10:00:00Z',
        tags: ['alta_calidad', 'presupuesto_confirmado', 'excel', 'contabilidad', 'empresa_mediana']
      };

      setLead(sampleLead);
      setLoading(false);
    };

    setTimeout(loadLeadData, 1000);
  }, [leadPhone]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      used: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getInterestStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < level ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
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

  const calculateDaysUntilExpiry = (validUntil: string) => {
    const expiry = new Date(validUntil);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const addNewPromotion = () => {
    toast({
      title: "Nueva promoción",
      description: "Función para agregar nueva promoción en desarrollo",
    });
  };

  const activateLead = () => {
    toast({
      title: "Activar Lead",
      description: "Función de activación de lead en desarrollo",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Lead no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Lead */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{lead.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {lead.city}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{lead.stage}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Score: {lead.score}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{lead.score}/100</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Ingresos Totales</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(lead.totalRevenue)}</div>
              <div className="text-sm text-green-600">ROI: {lead.roi}%</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={activateLead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activar
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Campaña */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Origen de Campaña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Código de Campaña</div>
              <div className="font-bold text-blue-600">{lead.campaign.campaignCode}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Nombre de Campaña</div>
              <div className="font-medium">{lead.campaign.campaignName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Fuente</div>
              <div className="font-medium">{lead.campaign.source}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Costo de Adquisición</div>
              <div className="font-bold text-red-600">{formatCurrency(lead.campaign.cost)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">ROI de Campaña</div>
              <div className="font-bold text-green-600">{lead.roi}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Estado</div>
              <Badge className={lead.campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {lead.campaign.isActive ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="promotions">
            Promociones ({lead.promotions.length})
          </TabsTrigger>
          <TabsTrigger value="interactions">
            Interacciones ({lead.interactions.length})
          </TabsTrigger>
          <TabsTrigger value="activations">
            Activaciones ({lead.activations.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Interacciones</span>
                </div>
                <p className="text-2xl font-bold">{lead.totalInteractions}</p>
                <p className="text-sm text-gray-600">Total contactos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Promociones</span>
                </div>
                <p className="text-2xl font-bold">{lead.promotions.length}</p>
                <p className="text-sm text-gray-600">Ofertas enviadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Activaciones</span>
                </div>
                <p className="text-2xl font-bold">{lead.activations.length}</p>
                <p className="text-sm text-gray-600">Compras realizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Revenue</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(lead.totalRevenue)}</p>
                <p className="text-sm text-gray-600">Ingresos totales</p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline reciente */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.interactions.slice(0, 3).map((interaction) => (
                  <div key={interaction.id} className="flex gap-4 p-3 border rounded-lg">
                    <div className="mt-1">
                      {interaction.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                      {interaction.type === 'whatsapp' && <MessageSquare className="h-4 w-4 text-green-600" />}
                      {interaction.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                      {interaction.type === 'promotion_sent' && <Tag className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{interaction.agent}</span>
                        <span className="text-sm text-gray-500">{formatDate(interaction.date)}</span>
                        <Badge variant="outline">{interaction.channel}</Badge>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.notes}</p>
                      {interaction.outcome && (
                        <p className="text-sm text-green-600 mt-1">Resultado: {interaction.outcome}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Promociones y Ofertas</h3>
            <Button onClick={addNewPromotion}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Promoción
            </Button>
          </div>

          <div className="space-y-4">
            {lead.promotions.map((promotion) => (
              <Card key={promotion.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{promotion.productName}</h4>
                        <Badge className={getStatusColor(promotion.status)}>
                          {promotion.status}
                        </Badge>
                        <Badge variant="outline">{promotion.promotionCode}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Precio Original</div>
                          <div className="font-medium line-through text-red-600">{formatCurrency(promotion.originalPrice)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Precio con Descuento</div>
                          <div className="font-bold text-green-600">{formatCurrency(promotion.discountedPrice)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Descuento</div>
                          <div className="font-bold text-blue-600">{promotion.discountPercentage}% OFF</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Válido hasta</div>
                          <div className="font-medium">{formatDate(promotion.validUntil)}</div>
                          {calculateDaysUntilExpiry(promotion.validUntil) > 0 && (
                            <div className="text-xs text-orange-600">
                              {calculateDaysUntilExpiry(promotion.validUntil)} días restantes
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Nivel de Interés</div>
                          <div className="flex items-center gap-1">
                            {getInterestStars(promotion.interestLevel)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Mostrada</div>
                          <div className="text-sm">{formatDate(promotion.dateShown)}</div>
                        </div>
                        {promotion.responseDate && (
                          <div>
                            <div className="text-sm text-gray-600">Respuesta</div>
                            <div className="text-sm">{formatDate(promotion.responseDate)}</div>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600 mb-1">Notas del Asesor ({promotion.createdBy})</div>
                        <p className="text-sm">{promotion.notes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <h3 className="text-lg font-semibold">Historial Completo de Interacciones</h3>
          
          <div className="space-y-4">
            {lead.interactions.map((interaction) => (
              <Card key={interaction.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {interaction.type === 'call' && <Phone className="h-5 w-5 text-green-600" />}
                      {interaction.type === 'whatsapp' && <MessageSquare className="h-5 w-5 text-green-600" />}
                      {interaction.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                      {interaction.type === 'promotion_sent' && <Tag className="h-5 w-5 text-purple-600" />}
                      {interaction.type === 'activation' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{interaction.agent}</span>
                        <span className="text-sm text-gray-500">{formatDate(interaction.date)}</span>
                        <Badge variant="outline">{interaction.channel}</Badge>
                        {interaction.duration && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.floor(interaction.duration / 60)}:{(interaction.duration % 60).toString().padStart(2, '0')} min
                          </Badge>
                        )}
                        {interaction.isPrivate && (
                          <Badge variant="outline" className="text-orange-600">Nota Privada</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-2">{interaction.notes}</p>
                      
                      {interaction.outcome && (
                        <div className="bg-green-50 p-2 rounded mb-2">
                          <span className="text-sm font-medium text-green-800">Resultado: </span>
                          <span className="text-sm text-green-700">{interaction.outcome}</span>
                        </div>
                      )}
                      
                      {interaction.nextAction && (
                        <div className="bg-blue-50 p-2 rounded mb-2">
                          <span className="text-sm font-medium text-blue-800">Próxima acción: </span>
                          <span className="text-sm text-blue-700">{interaction.nextAction}</span>
                        </div>
                      )}

                      {interaction.promotionId && (
                        <div className="bg-purple-50 p-2 rounded">
                          <span className="text-sm font-medium text-purple-800">Promoción relacionada: </span>
                          <span className="text-sm text-purple-700">
                            {lead.promotions.find(p => p.id === interaction.promotionId)?.promotionCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activations" className="space-y-6">
          <h3 className="text-lg font-semibold">Historial de Activaciones y Compras</h3>
          
          <div className="space-y-4">
            {lead.activations.map((activation) => (
              <Card key={activation.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-3">{activation.productPurchased}</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fecha de Activación:</span>
                          <span className="font-medium">{formatDate(activation.activatedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activado por:</span>
                          <span className="font-medium">{activation.activatedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Método:</span>
                          <Badge variant="outline">{activation.activationMethod}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-bold text-green-600">{formatCurrency(activation.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pago:</span>
                          <span className="font-medium">{activation.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado del pago:</span>
                          <Badge className={
                            activation.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            activation.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            activation.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {activation.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {activation.satisfactionScore && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-2">Satisfacción del Cliente</div>
                          <div className="flex items-center gap-2">
                            <Progress value={activation.satisfactionScore * 20} className="flex-1" />
                            <span className="font-bold">{activation.satisfactionScore}/5</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <div className="text-sm text-gray-600 mb-1">Notas</div>
                        <p className="text-sm">{activation.notes}</p>
                      </div>
                      
                      {activation.followUpRequired && (
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Requiere seguimiento</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rentabilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Costo de Adquisición:</span>
                    <span className="font-medium text-red-600">{formatCurrency(lead.campaign.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingresos Generados:</span>
                    <span className="font-medium text-green-600">{formatCurrency(lead.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beneficio Neto:</span>
                    <span className="font-bold text-green-600">{formatCurrency(lead.totalRevenue - lead.campaign.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI:</span>
                    <span className="font-bold text-blue-600">{lead.roi}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Días en pipeline:</span>
                    <span className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promociones mostradas:</span>
                    <span className="font-medium">{lead.promotions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de respuesta:</span>
                    <span className="font-medium">
                      {Math.round((lead.promotions.filter(p => p.responseDate).length / lead.promotions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de conversión:</span>
                    <span className="font-medium">
                      {Math.round((lead.activations.length / lead.promotions.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comportamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Canal preferido:</span>
                    <span className="font-medium">WhatsApp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mejor horario:</span>
                    <span className="font-medium">14:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo promedio respuesta:</span>
                    <span className="font-medium">2.5 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score de calidad:</span>
                    <span className="font-bold text-blue-600">{lead.score}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags del lead */}
          <Card>
            <CardHeader>
              <CardTitle>Tags y Categorización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadProfileComplete;
