
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Gift,
  DollarSign,
  Calendar,
  Target,
  Users,
  Percent,
  Clock,
  Star,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Copy,
  Send,
  Eye,
  BarChart3,
  Filter,
  Download,
  Tag,
  Zap,
  Award
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'bogo' | 'free_course' | 'installments';
  discountValue: number;
  originalPrice: number;
  finalPrice: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  targetAudience: string[];
  courses: string[];
  usageLimit: number;
  usageCount: number;
  conditions: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  conversionRate: number;
  revenue: number;
  leadsApplied: number;
}

interface PromoCode {
  id: string;
  code: string;
  promotionId: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: string;
  expiresAt: string;
}

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [showNewPromotion, setShowNewPromotion] = useState(false);
  const [showNewPromoCode, setShowNewPromoCode] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  // Datos simulados
  useEffect(() => {
    setPromotions([
      {
        id: '1',
        name: 'Descuento Enero 2024',
        description: 'Descuento especial de año nuevo para cursos de contabilidad',
        type: 'percentage',
        discountValue: 20,
        originalPrice: 500000,
        finalPrice: 400000,
        validFrom: '2024-01-01',
        validUntil: '2024-01-31',
        isActive: true,
        targetAudience: ['new_leads', 'contabilidad'],
        courses: ['Contabilidad Básica', 'Contabilidad Avanzada', 'NIIF'],
        usageLimit: 100,
        usageCount: 45,
        conditions: ['Solo para nuevos estudiantes', 'No acumulable con otras promociones'],
        createdBy: 'María González',
        createdAt: '2024-01-01T00:00:00Z',
        lastModified: '2024-01-15T10:30:00Z',
        conversionRate: 15.2,
        revenue: 18000000,
        leadsApplied: 156
      },
      {
        id: '2',
        name: 'Excel Avanzado 2x1',
        description: 'Promoción especial: paga uno y lleva dos cursos de Excel',
        type: 'bogo',
        discountValue: 50,
        originalPrice: 600000,
        finalPrice: 600000,
        validFrom: '2024-01-15',
        validUntil: '2024-02-15',
        isActive: true,
        targetAudience: ['warm_leads', 'excel'],
        courses: ['Excel Básico', 'Excel Avanzado', 'Excel VBA'],
        usageLimit: 50,
        usageCount: 23,
        conditions: ['Aplica solo para cursos de Excel', 'El segundo curso debe ser de igual o menor valor'],
        createdBy: 'Carlos Rodríguez',
        createdAt: '2024-01-15T09:00:00Z',
        lastModified: '2024-01-20T14:20:00Z',
        conversionRate: 22.8,
        revenue: 13800000,
        leadsApplied: 89
      },
      {
        id: '3',
        name: 'Curso Gratis Programación',
        description: 'Curso de introducción a programación completamente gratuito',
        type: 'free_course',
        discountValue: 100,
        originalPrice: 450000,
        finalPrice: 0,
        validFrom: '2024-01-10',
        validUntil: '2024-03-10',
        isActive: true,
        targetAudience: ['cold_leads', 'programacion'],
        courses: ['Introducción a Programación'],
        usageLimit: 200,
        usageCount: 87,
        conditions: ['Solo un curso gratis por persona', 'Debe completar encuesta de satisfacción'],
        createdBy: 'Luis Martínez',
        createdAt: '2024-01-10T11:00:00Z',
        lastModified: '2024-01-18T16:45:00Z',
        conversionRate: 8.5,
        revenue: 0,
        leadsApplied: 234
      },
      {
        id: '4',
        name: 'Plan de Pagos Sin Intereses',
        description: 'Paga tu curso en 6 cuotas sin intereses',
        type: 'installments',
        discountValue: 0,
        originalPrice: 800000,
        finalPrice: 800000,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        isActive: true,
        targetAudience: ['interested_leads'],
        courses: ['Todos los cursos'],
        usageLimit: 1000,
        usageCount: 156,
        conditions: ['Mínimo $500,000 en compra', 'Aprobación crediticia requerida'],
        createdBy: 'Ana López',
        createdAt: '2024-01-01T08:00:00Z',
        lastModified: '2024-01-22T12:15:00Z',
        conversionRate: 35.4,
        revenue: 124800000,
        leadsApplied: 445
      }
    ]);

    setPromoCodes([
      {
        id: '1',
        code: 'ENERO20',
        promotionId: '1',
        isActive: true,
        usageLimit: 100,
        usageCount: 45,
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2024-01-31T23:59:59Z'
      },
      {
        id: '2',
        code: 'EXCEL2X1',
        promotionId: '2',
        isActive: true,
        usageLimit: 50,
        usageCount: 23,
        createdAt: '2024-01-15T09:00:00Z',
        expiresAt: '2024-02-15T23:59:59Z'
      },
      {
        id: '3',
        code: 'GRATIS2024',
        promotionId: '3',
        isActive: true,
        usageLimit: 200,
        usageCount: 87,
        createdAt: '2024-01-10T11:00:00Z',
        expiresAt: '2024-03-10T23:59:59Z'
      }
    ]);
  }, []);

  const getPromotionTypeLabel = (type: string) => {
    const types = {
      percentage: 'Descuento %',
      fixed_amount: 'Descuento Fijo',
      bogo: 'Lleva 2 Paga 1',
      free_course: 'Curso Gratis',
      installments: 'Plan de Pagos'
    };
    return types[type as keyof typeof types] || type;
  };

  const getPromotionTypeColor = (type: string) => {
    const colors = {
      percentage: 'bg-blue-100 text-blue-800',
      fixed_amount: 'bg-green-100 text-green-800',
      bogo: 'bg-purple-100 text-purple-800',
      free_course: 'bg-yellow-100 text-yellow-800',
      installments: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isPromotionExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.validFrom);
    const end = new Date(promotion.validUntil);
    return promotion.isActive && now >= start && now <= end;
  };

  const getPromotionStatus = (promotion: Promotion) => {
    if (!promotion.isActive) return { label: 'Inactiva', color: 'bg-gray-100 text-gray-800' };
    if (isPromotionExpired(promotion.validUntil)) return { label: 'Expirada', color: 'bg-red-100 text-red-800' };
    if (isPromotionActive(promotion)) return { label: 'Activa', color: 'bg-green-100 text-green-800' };
    return { label: 'Programada', color: 'bg-blue-100 text-blue-800' };
  };

  const calculateSavings = (originalPrice: number, finalPrice: number) => {
    return originalPrice - finalPrice;
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  const filteredPromotions = promotions.filter(promo => {
    if (filterStatus !== 'all') {
      const status = getPromotionStatus(promo);
      if (filterStatus === 'active' && status.label !== 'Activa') return false;
      if (filterStatus === 'inactive' && status.label !== 'Inactiva') return false;
      if (filterStatus === 'expired' && status.label !== 'Expirada') return false;
    }
    if (filterType !== 'all' && promo.type !== filterType) return false;
    return true;
  });

  const totalRevenue = promotions.reduce((sum, promo) => sum + promo.revenue, 0);
  const totalLeads = promotions.reduce((sum, promo) => sum + promo.leadsApplied, 0);
  const averageConversion = promotions.reduce((sum, promo) => sum + promo.conversionRate, 0) / promotions.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Promociones</h1>
          <p className="text-gray-600">Administra descuentos, ofertas especiales y códigos promocionales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNewPromoCode(true)}>
            <Tag className="h-4 w-4 mr-2" />
            Nuevo Código
          </Button>
          <Button onClick={() => setShowNewPromotion(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promociones Activas</p>
                <p className="text-3xl font-bold">{promotions.filter(p => isPromotionActive(p)).length}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos por Promociones</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Impactados</p>
                <p className="text-3xl font-bold">{totalLeads.toLocaleString()}</p>
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
                <p className="text-3xl font-bold">{averageConversion.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div>
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                  <SelectItem value="expired">Expiradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="percentage">Descuento %</SelectItem>
                  <SelectItem value="fixed_amount">Descuento Fijo</SelectItem>
                  <SelectItem value="bogo">2x1</SelectItem>
                  <SelectItem value="free_course">Curso Gratis</SelectItem>
                  <SelectItem value="installments">Plan Pagos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions">
            Promociones ({filteredPromotions.length})
          </TabsTrigger>
          <TabsTrigger value="codes">
            Códigos ({promoCodes.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="space-y-6">
          {/* Lista de promociones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPromotions.map((promotion) => {
              const status = getPromotionStatus(promotion);
              const usagePercentage = calculateUsagePercentage(promotion.usageCount, promotion.usageLimit);
              const savings = calculateSavings(promotion.originalPrice, promotion.finalPrice);
              
              return (
                <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{promotion.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPromotionTypeColor(promotion.type)}>
                          {getPromotionTypeLabel(promotion.type)}
                        </Badge>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Información de descuento */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-400 line-through">
                          {formatCurrency(promotion.originalPrice)}
                        </div>
                        <div className="text-sm text-gray-600">Precio Original</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {promotion.finalPrice === 0 ? 'GRATIS' : formatCurrency(promotion.finalPrice)}
                        </div>
                        <div className="text-sm text-green-600">
                          {promotion.type === 'percentage' && `${promotion.discountValue}% OFF`}
                          {promotion.type === 'fixed_amount' && `${formatCurrency(savings)} OFF`}
                          {promotion.type === 'bogo' && '2x1'}
                          {promotion.type === 'free_course' && '100% GRATIS'}
                          {promotion.type === 'installments' && 'Sin Intereses'}
                        </div>
                      </div>
                    </div>

                    {/* Vigencia */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Vigente del {formatDate(promotion.validFrom)} al {formatDate(promotion.validUntil)}</span>
                    </div>

                    {/* Uso */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Uso de la promoción</span>
                        <span>{promotion.usageCount} / {promotion.usageLimit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{promotion.leadsApplied}</div>
                        <div className="text-xs text-gray-600">Leads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{promotion.conversionRate}%</div>
                        <div className="text-xs text-gray-600">Conversión</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(promotion.revenue)}</div>
                        <div className="text-xs text-gray-600">Ingresos</div>
                      </div>
                    </div>

                    {/* Cursos aplicables */}
                    <div>
                      <div className="text-sm font-medium mb-2">Cursos aplicables:</div>
                      <div className="flex flex-wrap gap-1">
                        {promotion.courses.slice(0, 3).map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                        {promotion.courses.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{promotion.courses.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </Button>
                      {isPromotionActive(promotion) && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Aplicar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Formulario nueva promoción */}
          {showNewPromotion && (
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Promoción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre de la Promoción</Label>
                    <Input placeholder="Ej: Descuento Enero 2024" />
                  </div>
                  <div>
                    <Label>Tipo de Promoción</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Descuento Porcentual</SelectItem>
                        <SelectItem value="fixed_amount">Descuento Fijo</SelectItem>
                        <SelectItem value="bogo">Compra 1 Lleva 2</SelectItem>
                        <SelectItem value="free_course">Curso Gratuito</SelectItem>
                        <SelectItem value="installments">Plan de Pagos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea placeholder="Describe los beneficios y términos de la promoción..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Valor del Descuento</Label>
                    <Input type="number" placeholder="20" />
                  </div>
                  <div>
                    <Label>Precio Original</Label>
                    <Input type="number" placeholder="500000" />
                  </div>
                  <div>
                    <Label>Precio Final</Label>
                    <Input type="number" placeholder="400000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de Inicio</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Fecha de Fin</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Límite de Uso</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div>
                    <Label>Audiencia Objetivo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar audiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los leads</SelectItem>
                        <SelectItem value="new_leads">Leads nuevos</SelectItem>
                        <SelectItem value="warm_leads">Leads calientes</SelectItem>
                        <SelectItem value="cold_leads">Leads fríos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Cursos Aplicables</Label>
                  <Textarea placeholder="Contabilidad Básica, Excel Avanzado, Marketing Digital..." />
                </div>

                <div>
                  <Label>Condiciones y Términos</Label>
                  <Textarea placeholder="Solo para nuevos estudiantes, No acumulable con otras promociones..." />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Activar promoción inmediatamente</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewPromotion(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Crear Promoción
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="codes" className="space-y-6">
          {/* Lista de códigos promocionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoCodes.map((code) => {
              const promotion = promotions.find(p => p.id === code.promotionId);
              const usagePercentage = (code.usageCount / code.usageLimit) * 100;
              const isExpired = new Date(code.expiresAt) < new Date();
              
              return (
                <Card key={code.id}>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold font-mono bg-gray-100 p-3 rounded-lg mb-2">
                        {code.code}
                      </div>
                      <Badge className={isExpired ? 'bg-red-100 text-red-800' : code.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {isExpired ? 'Expirado' : code.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Promoción asociada:</div>
                        <div className="font-medium">{promotion?.name || 'N/A'}</div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uso del código</span>
                          <span>{code.usageCount} / {code.usageLimit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div>Creado: {formatDate(code.createdAt)}</div>
                        <div>Expira: {formatDate(code.expiresAt)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Formulario nuevo código */}
          {showNewPromoCode && (
            <Card>
              <CardHeader>
                <CardTitle>Generar Nuevo Código Promocional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Código</Label>
                    <Input placeholder="DESCUENTO2024" />
                  </div>
                  <div>
                    <Label>Promoción Asociada</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar promoción" />
                      </SelectTrigger>
                      <SelectContent>
                        {promotions.map((promo) => (
                          <SelectItem key={promo.id} value={promo.id}>
                            {promo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Límite de Uso</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div>
                    <Label>Fecha de Expiración</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewPromoCode(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Generar Código
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics de promociones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Tipo de Promoción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['percentage', 'bogo', 'free_course', 'installments'].map((type) => {
                    const typePromotions = promotions.filter(p => p.type === type);
                    const totalRevenue = typePromotions.reduce((sum, p) => sum + p.revenue, 0);
                    const totalLeads = typePromotions.reduce((sum, p) => sum + p.leadsApplied, 0);
                    const avgConversion = typePromotions.length > 0 
                      ? typePromotions.reduce((sum, p) => sum + p.conversionRate, 0) / typePromotions.length 
                      : 0;

                    return (
                      <div key={type} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <Badge className={getPromotionTypeColor(type)}>
                            {getPromotionTypeLabel(type)}
                          </Badge>
                          <span className="text-sm text-gray-600">{typePromotions.length} promociones</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="font-bold">{formatCurrency(totalRevenue)}</div>
                            <div className="text-xs text-gray-600">Ingresos</div>
                          </div>
                          <div>
                            <div className="font-bold">{totalLeads}</div>
                            <div className="text-xs text-gray-600">Leads</div>
                          </div>
                          <div>
                            <div className="font-bold">{avgConversion.toFixed(1)}%</div>
                            <div className="text-xs text-gray-600">Conversión</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Promociones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotions
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((promo, index) => (
                      <div key={promo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index === 0 && <Award className="h-4 w-4" />}
                            {index > 0 && (index + 1)}
                          </div>
                          <div>
                            <div className="font-medium">{promo.name}</div>
                            <div className="text-sm text-gray-600">{promo.conversionRate}% conversión</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(promo.revenue)}</div>
                          <div className="text-sm text-gray-600">{promo.leadsApplied} leads</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(promotions.reduce((sum, p) => sum + calculateSavings(p.originalPrice, p.finalPrice) * p.usageCount, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Ahorro Total Generado</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Promociones Utilizadas</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {(promotions.reduce((sum, p) => sum + p.usageCount, 0) / promotions.reduce((sum, p) => sum + p.usageLimit, 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Tasa de Utilización</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromotionsManagement;
