
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  DollarSign,
  Calendar,
  Star,
  AlertTriangle,
  Clock,
  Zap,
  Target,
  FileText,
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  name: string;
  price: number;
  category: string;
  duration: string;
  modality: 'online' | 'presencial' | 'hibrido';
  description: string;
  prerequisites?: string[];
  certification: boolean;
}

interface PaymentOption {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'financing' | 'cash';
  installments?: number;
  interestRate?: number;
  description: string;
}

const LeadActivationFlow = ({ leadId, onActivationComplete }: { 
  leadId: string; 
  onActivationComplete: (data: any) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activationData, setActivationData] = useState({
    leadInfo: {
      name: 'Carlos González',
      phone: '+57 301 234 5678',
      email: 'carlos.gonzalez@email.com',
      city: 'Bogotá',
      score: 85
    },
    selectedCourse: null as Course | null,
    paymentMethod: '',
    paymentDetails: {},
    scheduledCall: null as Date | null,
    notes: '',
    followUpRequired: false,
    discount: 0,
    finalPrice: 0
  });
  const { toast } = useToast();

  // Cursos disponibles
  const availableCourses: Course[] = [
    {
      id: '1',
      name: 'Excel Avanzado + Power BI',
      price: 450000,
      category: 'Análisis de Datos',
      duration: '40 horas',
      modality: 'online',
      description: 'Curso completo de Excel avanzado con Power BI para análisis de datos empresariales',
      prerequisites: ['Conocimientos básicos de Excel'],
      certification: true
    },
    {
      id: '2',
      name: 'Contabilidad Digital Completa',
      price: 800000,
      category: 'Contabilidad',
      duration: '60 horas',
      modality: 'hibrido',
      description: 'Formación integral en contabilidad digital con herramientas modernas',
      certification: true
    },
    {
      id: '3',
      name: 'Project Management Professional',
      price: 1200000,
      category: 'Gestión de Proyectos',
      duration: '80 horas',
      modality: 'presencial',
      description: 'Certificación profesional en gestión de proyectos con metodologías ágiles',
      prerequisites: ['Experiencia laboral mínima 2 años'],
      certification: true
    },
    {
      id: '4',
      name: 'Marketing Digital & Analytics',
      price: 650000,
      category: 'Marketing',
      duration: '50 horas',
      modality: 'online',
      description: 'Estrategias de marketing digital con enfoque en análisis de datos',
      certification: true
    }
  ];

  // Opciones de pago
  const paymentOptions: PaymentOption[] = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      type: 'credit_card',
      description: 'Pago inmediato con tarjeta de crédito'
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      type: 'bank_transfer',
      description: 'Transferencia directa a cuenta bancaria'
    },
    {
      id: 'financing_3',
      name: 'Financiación 3 Cuotas',
      type: 'financing',
      installments: 3,
      interestRate: 0,
      description: 'Pague en 3 cuotas sin intereses'
    },
    {
      id: 'financing_6',
      name: 'Financiación 6 Cuotas',
      type: 'financing',
      installments: 6,
      interestRate: 5,
      description: 'Pague en 6 cuotas con 5% de interés'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateDiscount = (course: Course, leadScore: number) => {
    if (leadScore >= 90) return 0.25; // 25% descuento
    if (leadScore >= 80) return 0.15; // 15% descuento
    if (leadScore >= 70) return 0.10; // 10% descuento
    return 0;
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectCourse = (course: Course) => {
    const discountPercentage = calculateDiscount(course, activationData.leadInfo.score);
    const discountAmount = course.price * discountPercentage;
    const finalPrice = course.price - discountAmount;

    setActivationData({
      ...activationData,
      selectedCourse: course,
      discount: discountPercentage,
      finalPrice: finalPrice
    });
  };

  const completeActivation = () => {
    const activationResult = {
      leadId,
      course: activationData.selectedCourse,
      paymentMethod: activationData.paymentMethod,
      finalPrice: activationData.finalPrice,
      discount: activationData.discount,
      notes: activationData.notes,
      followUpRequired: activationData.followUpRequired,
      scheduledCall: activationData.scheduledCall,
      activatedAt: new Date().toISOString(),
      activatedBy: 'Usuario Actual' // En implementación real, obtener del contexto
    };

    onActivationComplete(activationResult);
    
    toast({
      title: "¡Activación Exitosa!",
      description: `Lead activado con ${activationData.selectedCourse?.name}. Valor: ${formatCurrency(activationData.finalPrice)}`,
    });
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (step === currentStep) return <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">{step}</div>;
    return <div className="h-5 w-5 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">{step}</div>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {getStepIcon(1)}
              <span className={currentStep >= 1 ? 'font-medium' : 'text-gray-500'}>Seleccionar Curso</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-4">
              {getStepIcon(2)}
              <span className={currentStep >= 2 ? 'font-medium' : 'text-gray-500'}>Método de Pago</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-4">
              {getStepIcon(3)}
              <span className={currentStep >= 3 ? 'font-medium' : 'text-gray-500'}>Confirmación</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-4">
              {getStepIcon(4)}
              <span className={currentStep >= 4 ? 'font-medium' : 'text-gray-500'}>Seguimiento</span>
            </div>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Lead Info Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{activationData.leadInfo.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {activationData.leadInfo.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {activationData.leadInfo.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Lead Score</div>
              <div className="flex items-center gap-2">
                <Progress value={activationData.leadInfo.score} className="w-24 h-2" />
                <Badge className="bg-blue-100 text-blue-800">{activationData.leadInfo.score}/100</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Seleccionar Curso para Activación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {availableCourses.map((course) => {
                const discountPercentage = calculateDiscount(course, activationData.leadInfo.score);
                const discountAmount = course.price * discountPercentage;
                const finalPrice = course.price - discountAmount;
                const isSelected = activationData.selectedCourse?.id === course.id;

                return (
                  <Card 
                    key={course.id} 
                    className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                    onClick={() => selectCourse(course)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{course.name}</h3>
                            {course.certification && (
                              <Badge className="bg-green-100 text-green-800">Certificado</Badge>
                            )}
                            <Badge variant="outline">{course.category}</Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Duración:</span>
                              <span className="ml-2 font-medium">{course.duration}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Modalidad:</span>
                              <span className="ml-2 font-medium capitalize">{course.modality}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Prerrequisitos:</span>
                              <span className="ml-2 font-medium">
                                {course.prerequisites ? course.prerequisites.join(', ') : 'Ninguno'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          {discountPercentage > 0 && (
                            <div className="mb-2">
                              <Badge className="bg-red-100 text-red-800">
                                {(discountPercentage * 100).toFixed(0)}% DESC
                              </Badge>
                              <div className="text-sm text-gray-500 line-through">
                                {formatCurrency(course.price)}
                              </div>
                            </div>
                          )}
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(finalPrice)}
                          </div>
                          {discountPercentage > 0 && (
                            <div className="text-sm text-green-600">
                              Ahorro: {formatCurrency(discountAmount)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Resumen del curso seleccionado */}
              {activationData.selectedCourse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Curso Seleccionado</h4>
                  <div className="flex justify-between items-center">
                    <span>{activationData.selectedCourse.name}</span>
                    <div className="text-right">
                      {activationData.discount > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(activationData.selectedCourse.price)}
                        </div>
                      )}
                      <div className="font-bold text-green-600">
                        {formatCurrency(activationData.finalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Opciones de pago */}
              <RadioGroup 
                value={activationData.paymentMethod} 
                onValueChange={(value) => setActivationData({...activationData, paymentMethod: value})}
              >
                <div className="grid gap-4">
                  {paymentOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="font-medium cursor-pointer">
                          {option.name}
                        </Label>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        {option.installments && (
                          <div className="text-sm text-blue-600 mt-1">
                            {option.installments} cuotas de {formatCurrency(activationData.finalPrice / option.installments)}
                            {option.interestRate && option.interestRate > 0 && (
                              <span className="text-red-600"> (+{option.interestRate}% interés)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {/* Detalles adicionales del pago */}
              {activationData.paymentMethod && (
                <div className="space-y-4">
                  <h4 className="font-medium">Detalles del Pago</h4>
                  {activationData.paymentMethod === 'credit_card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Número de Tarjeta</Label>
                        <Input placeholder="**** **** **** ****" />
                      </div>
                      <div>
                        <Label>Nombre en la Tarjeta</Label>
                        <Input placeholder="Nombre completo" />
                      </div>
                      <div>
                        <Label>Fecha de Vencimiento</Label>
                        <Input placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input placeholder="***" />
                      </div>
                    </div>
                  )}
                  {activationData.paymentMethod === 'bank_transfer' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Datos para Transferencia</h5>
                      <div className="text-sm space-y-1">
                        <div><strong>Banco:</strong> Banco Ejemplo</div>
                        <div><strong>Cuenta:</strong> 123-456-789</div>
                        <div><strong>Titular:</strong> CCD CAPACITACION SAS</div>
                        <div><strong>Valor:</strong> {formatCurrency(activationData.finalPrice)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Confirmación de Activación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resumen completo */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-4">Resumen de la Activación</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Información del Cliente</h5>
                    <div className="space-y-1 text-sm">
                      <div>{activationData.leadInfo.name}</div>
                      <div>{activationData.leadInfo.phone}</div>
                      <div>{activationData.leadInfo.email}</div>
                      <div>{activationData.leadInfo.city}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Curso y Pago</h5>
                    <div className="space-y-1 text-sm">
                      <div><strong>Curso:</strong> {activationData.selectedCourse?.name}</div>
                      <div><strong>Método de Pago:</strong> {paymentOptions.find(p => p.id === activationData.paymentMethod)?.name}</div>
                      <div><strong>Valor Total:</strong> {formatCurrency(activationData.finalPrice)}</div>
                      {activationData.discount > 0 && (
                        <div className="text-green-600">
                          <strong>Descuento Aplicado:</strong> {(activationData.discount * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas adicionales */}
              <div>
                <Label>Notas de la Activación</Label>
                <Textarea 
                  placeholder="Comentarios adicionales sobre la activación..."
                  value={activationData.notes}
                  onChange={(e) => setActivationData({...activationData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              {/* Opciones de seguimiento */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="followup"
                    checked={activationData.followUpRequired}
                    onCheckedChange={(checked) => setActivationData({...activationData, followUpRequired: !!checked})}
                  />
                  <Label htmlFor="followup">Programar seguimiento post-activación</Label>
                </div>

                {activationData.followUpRequired && (
                  <div>
                    <Label>Fecha para Seguimiento</Label>
                    <Input 
                      type="datetime-local" 
                      onChange={(e) => setActivationData({...activationData, scheduledCall: new Date(e.target.value)})}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Activación Completada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Activación Exitosa!</h3>
                <p className="text-gray-600">
                  El lead ha sido activado correctamente con el curso {activationData.selectedCourse?.name}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  Valor de la Venta: {formatCurrency(activationData.finalPrice)}
                </div>
                {activationData.followUpRequired && (
                  <div className="text-sm text-gray-600 mt-2">
                    Seguimiento programado para: {activationData.scheduledCall?.toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={completeActivation}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Factura
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Confirmación
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        
        <Button 
          onClick={currentStep === 4 ? completeActivation : nextStep}
          disabled={
            (currentStep === 1 && !activationData.selectedCourse) ||
            (currentStep === 2 && !activationData.paymentMethod)
          }
        >
          {currentStep === 4 ? 'Finalizar' : 'Siguiente'}
          {currentStep !== 4 && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default LeadActivationFlow;
