
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Mail,
  Calendar,
  FileText,
  CreditCard,
  GraduationCap,
  Target
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LeadActivationFlowProps {
  leadId: string;
  onActivationComplete: (data: any) => void;
}

const LeadActivationFlow: React.FC<LeadActivationFlowProps> = ({ leadId, onActivationComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [activationData, setActivationData] = useState({
    qualification: {
      budget: '',
      timeframe: '',
      decisionMaker: '',
      urgency: '',
      fitScore: 0
    },
    proposal: {
      course: '',
      schedule: '',
      price: '',
      discount: '',
      paymentPlan: ''
    },
    follow_up: {
      nextContactDate: '',
      contactMethod: '',
      notes: '',
      expectations: ''
    }
  });

  const steps = [
    { id: 1, title: 'Calificación', icon: Target, description: 'Evaluar el fit del lead' },
    { id: 2, title: 'Propuesta', icon: FileText, description: 'Crear propuesta personalizada' },
    { id: 3, title: 'Seguimiento', icon: Calendar, description: 'Planificar próximos pasos' },
    { id: 4, title: 'Activación', icon: CheckCircle, description: 'Completar activación' }
  ];

  const updateActivationData = (section: string, field: string, value: string | number) => {
    setActivationData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleActivationComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActivationComplete = () => {
    toast({
      title: "Lead Activado",
      description: "El lead ha sido activado exitosamente y movido a la fase de conversión",
    });
    onActivationComplete(activationData);
  };

  const calculateFitScore = () => {
    const { budget, timeframe, decisionMaker, urgency } = activationData.qualification;
    let score = 0;
    
    if (budget) score += 25;
    if (timeframe) score += 25;
    if (decisionMaker === 'yes') score += 25;
    if (urgency === 'high') score += 25;
    
    return score;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Calificación del Lead</h3>
              <p className="text-gray-600 mb-6">Evalúa qué tan calificado está este lead para convertirse en cliente.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Presupuesto Disponible</label>
                <Select 
                  value={activationData.qualification.budget}
                  onValueChange={(value) => updateActivationData('qualification', 'budget', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rango" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500k">Menos de $500.000</SelectItem>
                    <SelectItem value="500k-1m">$500.000 - $1.000.000</SelectItem>
                    <SelectItem value="1m-2m">$1.000.000 - $2.000.000</SelectItem>
                    <SelectItem value="over-2m">Más de $2.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Marco de Tiempo</label>
                <Select 
                  value={activationData.qualification.timeframe}
                  onValueChange={(value) => updateActivationData('qualification', 'timeframe', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuándo quiere empezar?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Inmediato (Esta semana)</SelectItem>
                    <SelectItem value="month">En el próximo mes</SelectItem>
                    <SelectItem value="quarter">En los próximos 3 meses</SelectItem>
                    <SelectItem value="later">Más adelante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">¿Es el tomador de decisiones?</label>
                <Select 
                  value={activationData.qualification.decisionMaker}
                  onValueChange={(value) => updateActivationData('qualification', 'decisionMaker', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sí, decide solo</SelectItem>
                    <SelectItem value="partial">Decide con otros</SelectItem>
                    <SelectItem value="no">No, necesita aprobación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nivel de Urgencia</label>
                <Select 
                  value={activationData.qualification.urgency}
                  onValueChange={(value) => updateActivationData('qualification', 'urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Qué tan urgente es?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta - Necesita empezar ya</SelectItem>
                    <SelectItem value="medium">Media - Puede esperar un poco</SelectItem>
                    <SelectItem value="low">Baja - Solo está explorando</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Score de Calificación</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={calculateFitScore()} className="flex-1" />
                <span className="font-bold text-lg">{calculateFitScore()}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {calculateFitScore() >= 75 ? 'Lead altamente calificado' :
                 calculateFitScore() >= 50 ? 'Lead moderadamente calificado' :
                 'Lead requiere más calificación'}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Propuesta Personalizada</h3>
              <p className="text-gray-600 mb-6">Crea una propuesta específica basada en las necesidades del lead.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Curso Recomendado</label>
                <Select 
                  value={activationData.proposal.course}
                  onValueChange={(value) => updateActivationData('proposal', 'course', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contabilidad-basica">Contabilidad Básica</SelectItem>
                    <SelectItem value="excel-avanzado">Excel Avanzado</SelectItem>
                    <SelectItem value="marketing-digital">Marketing Digital</SelectItem>
                    <SelectItem value="nomina">Nómina y Payroll</SelectItem>
                    <SelectItem value="paquete-completo">Paquete Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Horario Propuesto</label>
                <Select 
                  value={activationData.proposal.schedule}
                  onValueChange={(value) => updateActivationData('proposal', 'schedule', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Mañanas (8:00 - 12:00)</SelectItem>
                    <SelectItem value="afternoon">Tardes (2:00 - 6:00)</SelectItem>
                    <SelectItem value="evening">Noches (6:00 - 10:00)</SelectItem>
                    <SelectItem value="weekend">Fines de semana</SelectItem>
                    <SelectItem value="flexible">Horario flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio Propuesto</label>
                <Input
                  placeholder="Ej: $800.000"
                  value={activationData.proposal.price}
                  onChange={(e) => updateActivationData('proposal', 'price', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descuento Ofrecido</label>
                <Select 
                  value={activationData.proposal.discount}
                  onValueChange={(value) => updateActivationData('proposal', 'discount', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar descuento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin descuento</SelectItem>
                    <SelectItem value="10">10% - Pronto pago</SelectItem>
                    <SelectItem value="15">15% - Promoción especial</SelectItem>
                    <SelectItem value="20">20% - Cliente corporativo</SelectItem>
                    <SelectItem value="custom">Descuento personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Plan de Pago</label>
                <Select 
                  value={activationData.proposal.paymentPlan}
                  onValueChange={(value) => updateActivationData('proposal', 'paymentPlan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plan de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Pago completo al inicio</SelectItem>
                    <SelectItem value="2-payments">2 cuotas (50% - 50%)</SelectItem>
                    <SelectItem value="3-payments">3 cuotas (40% - 30% - 30%)</SelectItem>
                    <SelectItem value="monthly">Pago mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span className="font-medium">Resumen de la Propuesta</span>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Curso:</span> {activationData.proposal.course || 'No seleccionado'}</p>
                <p><span className="font-medium">Precio:</span> {activationData.proposal.price || 'No definido'}</p>
                <p><span className="font-medium">Descuento:</span> {activationData.proposal.discount ? `${activationData.proposal.discount}%` : 'Ninguno'}</p>
                <p><span className="font-medium">Plan de pago:</span> {activationData.proposal.paymentPlan || 'No seleccionado'}</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Plan de Seguimiento</h3>
              <p className="text-gray-600 mb-6">Define cómo y cuándo darás seguimiento a este lead.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Próximo Contacto</label>
                <Input
                  type="datetime-local"
                  value={activationData.follow_up.nextContactDate}
                  onChange={(e) => updateActivationData('follow_up', 'nextContactDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Método de Contacto</label>
                <Select 
                  value={activationData.follow_up.contactMethod}
                  onValueChange={(value) => updateActivationData('follow_up', 'contactMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cómo contactarás?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Llamada telefónica</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Reunión presencial</SelectItem>
                    <SelectItem value="video-call">Videollamada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Expectativas del Cliente</label>
                <Textarea
                  placeholder="¿Qué espera el cliente del próximo contacto?"
                  value={activationData.follow_up.expectations}
                  onChange={(e) => updateActivationData('follow_up', 'expectations', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notas de Seguimiento</label>
                <Textarea
                  placeholder="Notas importantes para el próximo contacto..."
                  value={activationData.follow_up.notes}
                  onChange={(e) => updateActivationData('follow_up', 'notes', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Recordatorio Automático</span>
              </div>
              <p className="text-sm text-gray-600">
                Se creará un recordatorio automático para el {activationData.follow_up.nextContactDate ? 
                  new Date(activationData.follow_up.nextContactDate).toLocaleString() : 
                  'fecha seleccionada'} usando {activationData.follow_up.contactMethod || 'el método seleccionado'}.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">¡Lead Activado Exitosamente!</h3>
              <p className="text-gray-600 mb-6">
                El lead ha sido procesado y movido a la fase de conversión. 
                Se han creado todas las tareas y recordatorios correspondientes.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg text-left">
              <h4 className="font-semibold mb-4">Resumen de la Activación:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Score de Calificación:</span>
                  <Badge className="bg-green-500">{calculateFitScore()}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Curso Propuesto:</span>
                  <span className="font-medium">{activationData.proposal.course || 'No definido'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio:</span>
                  <span className="font-medium">{activationData.proposal.price || 'No definido'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Próximo Contacto:</span>
                  <span className="font-medium">
                    {activationData.follow_up.nextContactDate ? 
                      new Date(activationData.follow_up.nextContactDate).toLocaleDateString() : 
                      'No programado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={handleActivationComplete} className="bg-green-600 hover:bg-green-700">
                <GraduationCap className="h-4 w-4 mr-2" />
                Finalizar Activación
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${
                isActive ? 'text-blue-600' : 
                isCompleted ? 'text-green-600' : 
                'text-gray-400'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : 
                  isCompleted ? 'bg-green-100' : 
                  'bg-gray-100'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="hidden md:block">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-4 ${
                  isCompleted ? 'bg-green-300' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Anterior
        </Button>
        
        <Button 
          onClick={nextStep}
          disabled={currentStep === 4}
        >
          {currentStep === steps.length ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};

export default LeadActivationFlow;
