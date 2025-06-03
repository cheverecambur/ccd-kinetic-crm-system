import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Search, 
  CheckCircle,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useVicidial } from '@/hooks/useVicidial';
import { useAuth } from '@/contexts/AuthContext';

const QuickActions = () => {
  const { user } = useAuth();
  const { addLead, startCall } = useVicidial();
  
  const [showNewLead, setShowNewLead] = useState(false);
  const [showQuickCall, setShowQuickCall] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [tasksMinimized, setTasksMinimized] = useState(false);

  // Formulario para nuevo lead
  const [newLeadData, setNewLeadData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    course: '',
    source: ''
  });

  // Datos de acciones rápidas
  const todayTasks = [
    { 
      id: 1, 
      type: 'callback', 
      contact: 'María González', 
      phone: '+573012345678',
      time: '10:30', 
      course: 'Contabilidad',
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'callback', 
      contact: 'Carlos Pérez', 
      phone: '+573109876543',
      time: '14:00', 
      course: 'Excel Avanzado',
      priority: 'medium'
    },
    { 
      id: 3, 
      type: 'follow', 
      contact: 'Ana López', 
      phone: '+573152468135',
      time: '16:30', 
      course: 'Marketing Digital',
      priority: 'low'
    }
  ];

  const recentLeads = [
    { id: 1, name: 'Luis Martínez', phone: '+573001234567', score: 95, source: 'Facebook' },
    { id: 2, name: 'Sofia Torres', phone: '+573109876543', score: 88, source: 'TikTok' },
    { id: 3, name: 'Diego Ramírez', phone: '+573152468135', score: 92, source: 'Google' }
  ];

  const handleQuickCall = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    startCall({
      phoneNumber: cleanPhone,
      phoneCode: '57',
      leadName: name
    });
    setShowQuickCall(false);
  };

  const handleQuickWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${name}, soy ${user?.name} de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCreateLead = () => {
    if (!newLeadData.phone_number || !newLeadData.first_name) {
      return;
    }

    const leadData = {
      phone_number: newLeadData.phone_number.replace(/\D/g, ''), // Solo números
      phone_code: '57',
      first_name: newLeadData.first_name,
      last_name: newLeadData.last_name,
      email: newLeadData.email,
      list_id: '999',
      comments: `Curso: ${newLeadData.course}, Fuente: ${newLeadData.source}`
    };

    addLead(leadData);
    
    // Limpiar formulario
    setNewLeadData({
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      course: '',
      source: ''
    });
    
    setShowNewLead(false);
  };

  const markTaskCompleted = (taskId: number) => {
    // En una implementación real, esto actualizaría el estado en Vicidial
    console.log(`Tarea ${taskId} completada`);
  };

  const NewLeadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Nuevo Lead - Vicidial</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowNewLead(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Nombre" 
              value={newLeadData.first_name}
              onChange={(e) => setNewLeadData(prev => ({ ...prev, first_name: e.target.value }))}
            />
            <Input 
              placeholder="Apellido" 
              value={newLeadData.last_name}
              onChange={(e) => setNewLeadData(prev => ({ ...prev, last_name: e.target.value }))}
            />
          </div>
          <Input 
            placeholder="Teléfono (ej: 3001234567)" 
            value={newLeadData.phone_number}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, phone_number: e.target.value }))}
          />
          <Input 
            placeholder="Email" 
            type="email"
            value={newLeadData.email}
            onChange={(e) => setNewLeadData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Select value={newLeadData.course} onValueChange={(value) => setNewLeadData(prev => ({ ...prev, course: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Curso de interés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contabilidad">Contabilidad Básica</SelectItem>
              <SelectItem value="excel">Excel Avanzado</SelectItem>
              <SelectItem value="marketing">Marketing Digital</SelectItem>
              <SelectItem value="nomina">Nómina</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newLeadData.source} onValueChange={(value) => setNewLeadData(prev => ({ ...prev, source: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="referido">Referido</SelectItem>
              <SelectItem value="directo">Directo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={handleCreateLead}
              disabled={!newLeadData.phone_number || !newLeadData.first_name}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear en Vicidial
            </Button>
            <Button variant="outline" onClick={() => setShowNewLead(false)}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuickCallModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Llamada Rápida - Vicidial</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowQuickCall(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Número de teléfono" />
          <div className="text-sm text-gray-600">Leads recientes:</div>
          <div className="space-y-2">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.phone} • Score: {lead.score}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => handleQuickCall(lead.phone, lead.name)}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuickWhatsApp(lead.phone, lead.name)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" variant="outline" onClick={() => setShowQuickCall(false)}>
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const QuickSearchModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Búsqueda Rápida</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowQuickSearch(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Buscar por nombre, teléfono o email..." />
          <div className="text-sm text-gray-600">Resultados recientes:</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.phone} • {lead.source}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleQuickCall(lead.phone, lead.name)}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleQuickWhatsApp(lead.phone, lead.name)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full" variant="outline" onClick={() => setShowQuickSearch(false)}>
            Cerrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {/* Botones flotantes */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col gap-3">
          <Button
            className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowQuickSearch(true)}
            title="Búsqueda rápida"
          >
            <Search className="h-6 w-6" />
          </Button>
          
          <Button
            variant="secondary"
            className="w-14 h-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowQuickCall(true)}
            title="Llamada rápida"
          >
            <Phone className="h-6 w-6" />
          </Button>
          
          <Button
            className="w-14 h-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700"
            onClick={() => setShowNewLead(true)}
            title="Nuevo lead"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Panel de tareas del día - NO desaparece */}
      <Card className={`fixed bottom-6 left-6 w-80 z-30 shadow-lg transition-all duration-300 ${
        tasksMinimized ? 'h-16' : 'h-auto'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Tareas de Hoy</CardTitle>
              <Badge variant="outline">{todayTasks.length}</Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setTasksMinimized(!tasksMinimized)}
            >
              {tasksMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {!tasksMinimized && (
          <CardContent className="space-y-2">
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  {task.type === 'callback' ? (
                    <Calendar className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Phone className="h-4 w-4 text-orange-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{task.contact}</p>
                    <p className="text-xs text-gray-600">{task.time} - {task.course}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleQuickCall(task.phone, task.contact)}
                    title="Llamar con Vicidial"
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleQuickWhatsApp(task.phone, task.contact)}
                    title="WhatsApp"
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => markTaskCompleted(task.id)}
                    title="Marcar como completada"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {todayTasks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">¡Todas las tareas completadas!</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Modales */}
      {showNewLead && <NewLeadModal />}
      {showQuickCall && <QuickCallModal />}
      {showQuickSearch && <QuickSearchModal />}
    </>
  );
};

export default QuickActions;
