
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  User, 
  MapPin, 
  Calendar,
  Star,
  Clock,
  FileText,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LeadProfileCompleteProps {
  leadPhone: string;
}

const LeadProfileComplete: React.FC<LeadProfileCompleteProps> = ({ leadPhone }) => {
  const { toast } = useToast();
  const [editingNote, setEditingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingInfo, setEditingInfo] = useState(false);

  // Datos simulados del lead
  const leadData = {
    id: '1',
    name: 'María González',
    phone: leadPhone,
    email: 'maria.gonzalez@email.com',
    city: 'Bogotá',
    status: 'qualified',
    score: 85,
    source: 'Facebook',
    interestCourse: 'Contabilidad Básica',
    registrationDate: '2024-01-20',
    lastContact: '2024-01-26T14:20:00Z',
    nextAction: 'Enviar propuesta de Excel Avanzado',
    assignedAgent: 'Carlos Rodríguez',
    leadQuality: 'HOT',
    budget: '$500.000 - $1.000.000',
    timeframe: '1-2 meses'
  };

  const interactions = [
    {
      id: 1,
      type: 'call',
      date: '2024-01-26T14:20:00Z',
      duration: '8:45',
      outcome: 'Interesado en curso de contabilidad',
      agent: 'Carlos Rodríguez',
      notes: 'Lead muy interesado, solicita información de horarios flexibles'
    },
    {
      id: 2,
      type: 'whatsapp',
      date: '2024-01-25T10:15:00Z',
      outcome: 'Envió información inicial',
      agent: 'Carlos Rodríguez',
      notes: 'Respondió rápidamente, buena receptividad'
    },
    {
      id: 3,
      type: 'email',
      date: '2024-01-24T16:30:00Z',
      outcome: 'Propuesta enviada',
      agent: 'Carlos Rodríguez',
      notes: 'Envío de brochure y precios'
    }
  ];

  const notes = [
    {
      id: 1,
      date: '2024-01-26T15:00:00Z',
      author: 'Carlos Rodríguez',
      content: 'Lead muy prometedor. Trabaja en empresa de contabilidad y busca actualizar conocimientos.'
    },
    {
      id: 2,
      date: '2024-01-25T11:00:00Z',
      author: 'Carlos Rodríguez',
      content: 'Prefiere clases nocturnas por horario laboral. Considerar curso de fin de semana.'
    }
  ];

  const handleCall = () => {
    toast({
      title: "Iniciando llamada",
      description: `Conectando con ${leadData.name} (${leadData.phone})`,
    });
  };

  const handleWhatsApp = () => {
    const cleanPhone = leadData.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${leadData.name}, soy ${leadData.assignedAgent} de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp abierto",
      description: `Mensaje enviado a ${leadData.name}`,
    });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Información sobre nuestros cursos - CCD Capacitación');
    const body = encodeURIComponent(`Hola ${leadData.name},\n\nGracias por tu interés en nuestros cursos.\n\nSaludos,\n${leadData.assignedAgent}\nCCD Capacitación`);
    window.location.href = `mailto:${leadData.email}?subject=${subject}&body=${body}`;
  };

  const saveNote = () => {
    if (newNote.trim()) {
      toast({
        title: "Nota guardada",
        description: "La nota ha sido agregada al historial del lead",
      });
      setNewNote('');
      setEditingNote(false);
    }
  };

  const scheduleCallback = () => {
    toast({
      title: "Callback programado",
      description: "Se ha programado un recordatorio para contactar al lead",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'qualified': 'bg-green-100 text-green-800',
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'proposal': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getQualityColor = (quality: string) => {
    const colors = {
      'HOT': 'bg-red-500 text-white',
      'WARM': 'bg-orange-500 text-white',
      'COLD': 'bg-blue-500 text-white'
    };
    return colors[quality as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Header del perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {leadData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{leadData.name}</h2>
                  <Badge className={getStatusColor(leadData.status)}>
                    {leadData.status}
                  </Badge>
                  <Badge className={getQualityColor(leadData.leadQuality)}>
                    {leadData.leadQuality}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{leadData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>{leadData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>{leadData.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Score: <span className="font-bold text-orange-600">{leadData.score}</span></span>
                  <span>Fuente: <span className="font-medium">{leadData.source}</span></span>
                  <span>Curso: <span className="font-medium">{leadData.interestCourse}</span></span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCall} className="bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Llamar
              </Button>
              <Button onClick={handleWhatsApp} className="bg-green-500 hover:bg-green-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={handleEmail} variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="interactions">Interacciones</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Información del Lead</span>
                  <Button variant="ghost" size="sm" onClick={() => setEditingInfo(!editingInfo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingInfo ? (
                  <div className="space-y-4">
                    <Input placeholder="Nombre completo" defaultValue={leadData.name} />
                    <Input placeholder="Email" defaultValue={leadData.email} />
                    <Input placeholder="Teléfono" defaultValue={leadData.phone} />
                    <Select defaultValue={leadData.interestCourse}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contabilidad Básica">Contabilidad Básica</SelectItem>
                        <SelectItem value="Excel Avanzado">Excel Avanzado</SelectItem>
                        <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                        <SelectItem value="Nómina">Nómina</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingInfo(false)}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingInfo(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Curso de Interés</label>
                      <p className="font-medium">{leadData.interestCourse}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Presupuesto</label>
                      <p className="font-medium">{leadData.budget}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Marco de Tiempo</label>
                      <p className="font-medium">{leadData.timeframe}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                      <p className="font-medium">{new Date(leadData.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Asesor Asignado</label>
                      <p className="font-medium">{leadData.assignedAgent}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Próximas acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">{leadData.nextAction}</p>
                      <p className="text-sm text-blue-700">
                        Último contacto: {new Date(leadData.lastContact).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={scheduleCallback} variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar Callback
                  </Button>
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Enviar Propuesta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Interacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {interaction.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                      {interaction.type === 'whatsapp' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {interaction.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                      <span className="font-medium capitalize">{interaction.type}</span>
                      {interaction.duration && (
                        <Badge variant="outline">{interaction.duration}</Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(interaction.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium mb-1">{interaction.outcome}</p>
                    <p className="text-sm text-gray-600 mb-2">{interaction.notes}</p>
                    <p className="text-xs text-gray-500">Por: {interaction.agent}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Notas del Lead</span>
                <Button onClick={() => setEditingNote(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Nota
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingNote && (
                <div className="mb-4 p-4 border rounded-lg">
                  <Textarea
                    placeholder="Escribe tu nota aquí..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveNote} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingNote(false);
                      setNewNote('');
                    }}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(note.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="font-medium">Enviar propuesta comercial</p>
                    <p className="text-sm text-gray-600">Vencimiento: Mañana</p>
                  </div>
                  <Badge className="bg-orange-500">Alta</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="font-medium">Llamada de seguimiento</p>
                    <p className="text-sm text-gray-600">Vencimiento: En 2 días</p>
                  </div>
                  <Badge variant="outline">Media</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadProfileComplete;
