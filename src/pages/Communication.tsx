
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  Calendar,
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'whatsapp' | 'email' | 'sms';
  to: string;
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  leadName: string;
  attachments?: string[];
}

interface Template {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  category: string;
}

const Communication = () => {
  const [selectedTab, setSelectedTab] = useState('messages');
  const [messageType, setMessageType] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const { toast } = useToast();

  // Mock data
  const messages: Message[] = [
    {
      id: '1',
      type: 'whatsapp',
      to: '3001234567',
      content: 'Hola María, te contacto de CCD Capacitación por tu interés en nuestro curso de Contabilidad Básica.',
      status: 'read',
      timestamp: '2024-01-15T10:30:00Z',
      leadName: 'María González'
    },
    {
      id: '2',
      type: 'email',
      to: 'carlos@email.com',
      subject: 'Información sobre Excel Avanzado',
      content: 'Estimado Carlos, adjunto encontrarás la información completa sobre nuestro curso de Excel Avanzado.',
      status: 'delivered',
      timestamp: '2024-01-15T09:15:00Z',
      leadName: 'Carlos Rodríguez'
    },
    {
      id: '3',
      type: 'sms',
      to: '3152468135',
      content: 'Ana, recordatorio: tienes una cita programada hoy a las 3 PM para hablar sobre Marketing Digital.',
      status: 'sent',
      timestamp: '2024-01-15T08:45:00Z',
      leadName: 'Ana López'
    }
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Saludo inicial WhatsApp',
      type: 'whatsapp',
      content: 'Hola {{nombre}}, soy {{asesor}} de CCD Capacitación. Te contacto por tu interés en {{curso}}. ¿Tienes unos minutos para conversar?',
      variables: ['nombre', 'asesor', 'curso'],
      category: 'Prospección'
    },
    {
      id: '2',
      name: 'Información curso Email',
      type: 'email',
      subject: 'Información completa sobre {{curso}} - CCD Capacitación',
      content: 'Estimado/a {{nombre}},\n\nGracias por tu interés en nuestro curso de {{curso}}.\n\nEn adjunto encontrarás:\n- Pensum académico\n- Modalidades de pago\n- Fechas de inicio\n\nQuedo atento a cualquier consulta.\n\nSaludos,\n{{asesor}}',
      variables: ['nombre', 'curso', 'asesor'],
      category: 'Información'
    },
    {
      id: '3',
      name: 'Recordatorio cita SMS',
      type: 'sms',
      content: '{{nombre}}, recordatorio: tienes cita hoy a las {{hora}} para {{curso}}. ¡Te esperamos!',
      variables: ['nombre', 'hora', 'curso'],
      category: 'Recordatorios'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      read: 'bg-purple-100 text-purple-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'read': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'sms': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Error",
        description: "El mensaje no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    // Simular envío
    toast({
      title: "Mensaje enviado",
      description: `Mensaje ${messageType} enviado correctamente`,
    });

    // Limpiar formulario
    setMessageContent('');
    setRecipients('');
    setSubject('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessageContent(template.content);
      if (template.subject) {
        setSubject(template.subject);
      }
      setMessageType(template.type);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Comunicación Multicanal</h1>
          <p className="text-gray-600">Gestiona WhatsApp, Email y SMS desde un solo lugar</p>
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

      {/* Métricas de comunicación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensajes Hoy</p>
                <p className="text-2xl font-bold">247</p>
                <p className="text-xs text-green-600">+18% vs ayer</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emails Enviados</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-blue-600">+12% vs ayer</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SMS Enviados</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-orange-600">+25% vs ayer</p>
              </div>
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasa Respuesta</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-green-600">+5% vs ayer</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="send">Enviar Mensaje</TabsTrigger>
          <TabsTrigger value="messages">Historial</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
        </TabsList>

        {/* Enviar mensaje */}
        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de envío */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Mensaje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tipo de mensaje */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={messageType === 'whatsapp' ? 'default' : 'outline'}
                      onClick={() => setMessageType('whatsapp')}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      variant={messageType === 'email' ? 'default' : 'outline'}
                      onClick={() => setMessageType('email')}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      variant={messageType === 'sms' ? 'default' : 'outline'}
                      onClick={() => setMessageType('sms')}
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      SMS
                    </Button>
                  </div>

                  {/* Destinatarios */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {messageType === 'email' ? 'Email(s)' : 'Teléfono(s)'}
                    </label>
                    <Input
                      placeholder={
                        messageType === 'email' 
                          ? 'email1@ejemplo.com, email2@ejemplo.com' 
                          : '3001234567, 3109876543'
                      }
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                    />
                  </div>

                  {/* Asunto (solo para email) */}
                  {messageType === 'email' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Asunto</label>
                      <Input
                        placeholder="Asunto del email"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Plantilla */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Plantilla</label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates
                          .filter(t => t.type === messageType)
                          .map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contenido del mensaje */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Mensaje</label>
                    <Textarea
                      placeholder={
                        messageType === 'sms' 
                          ? 'Máximo 160 caracteres...' 
                          : 'Escribe tu mensaje...'
                      }
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows={messageType === 'sms' ? 3 : 6}
                      maxLength={messageType === 'sms' ? 160 : undefined}
                    />
                    {messageType === 'sms' && (
                      <p className="text-xs text-gray-500 mt-1">
                        {messageContent.length}/160 caracteres
                      </p>
                    )}
                  </div>

                  {/* Archivos adjuntos (solo para email y whatsapp) */}
                  {messageType !== 'sms' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Archivos adjuntos</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Arrastra archivos aquí o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo 10MB por archivo
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar {messageType === 'whatsapp' ? 'WhatsApp' : messageType === 'email' ? 'Email' : 'SMS'}
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Programar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vista previa */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(messageType)}
                      <span className="text-sm font-medium capitalize">{messageType}</span>
                    </div>
                    
                    {messageType === 'email' && subject && (
                      <div>
                        <p className="text-xs text-gray-600">Asunto:</p>
                        <p className="text-sm font-medium">{subject}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-600">Mensaje:</p>
                      <div className="bg-gray-50 rounded-lg p-3 mt-1">
                        <p className="text-sm whitespace-pre-wrap">
                          {messageContent || 'El mensaje aparecerá aquí...'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-600">Destinatarios:</p>
                      <p className="text-sm">{recipients || 'No especificados'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Variables disponibles */}
              {selectedTemplate && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Variables Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {templates
                        .find(t => t.id === selectedTemplate)
                        ?.variables.map(variable => (
                          <Badge key={variable} variant="outline">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Historial de mensajes */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial de Mensajes</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getTypeIcon(message.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{message.leadName}</h4>
                            <Badge className={getStatusColor(message.status)}>
                              {getStatusIcon(message.status)}
                              <span className="ml-1 capitalize">{message.status}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {message.type === 'email' ? message.to : `+57 ${message.to}`}
                          </p>
                          
                          {message.subject && (
                            <p className="text-sm font-medium mb-2">{message.subject}</p>
                          )}
                          
                          <p className="text-sm text-gray-900">{message.content}</p>
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(message.timestamp).toLocaleString('es-CO')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plantillas */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Plantillas de Mensaje</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {template.subject && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Asunto:</p>
                        <p className="text-sm">{template.subject}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Contenido:</p>
                      <p className="text-sm text-gray-900 line-clamp-3">{template.content}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Variables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Campañas */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Campañas de Comunicación
            </h3>
            <p className="text-gray-600 mb-6">
              Crea y gestiona campañas automatizadas de comunicación multicanal
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Campaña
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
