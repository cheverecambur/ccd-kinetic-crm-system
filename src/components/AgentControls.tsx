
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVicidialApi } from '@/hooks/useVicidialApi';
import { 
  Phone, 
  PhoneOff, 
  Pause, 
  Play, 
  LogIn, 
  LogOut,
  PhoneCall,
  Timer,
  User
} from 'lucide-react';

const AgentControls = () => {
  const {
    loading,
    agentSession,
    callSession,
    login,
    logout,
    pause,
    resume,
    dialLead,
    hangup,
    setDisposition
  } = useVicidialApi();

  const [loginForm, setLoginForm] = useState({
    campaign: '',
    phone_login: '',
    phone_pass: ''
  });

  const [callForm, setCallForm] = useState({
    phone_number: '',
    lead_id: ''
  });

  const [dispositionForm, setDispositionForm] = useState({
    disposition: '',
    comments: ''
  });

  const handleLogin = async () => {
    await login({
      user: '', // Se establece automáticamente en el hook
      pass: '', // Se puede manejar desde la autenticación
      ...loginForm
    });
  };

  const handleDial = async () => {
    if (callForm.phone_number) {
      await dialLead({
        phone_number: callForm.phone_number,
        lead_id: callForm.lead_id || undefined
      });
    }
  };

  const handleDisposition = async () => {
    if (dispositionForm.disposition) {
      await setDisposition(dispositionForm.disposition, dispositionForm.comments);
      setDispositionForm({ disposition: '', comments: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-green-500';
      case 'PAUSED': return 'bg-yellow-500';
      case 'ON_CALL': return 'bg-blue-500';
      case 'LOGGED_OUT': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-500';
      case 'RINGING': return 'bg-yellow-500';
      case 'PAUSED': return 'bg-orange-500';
      case 'IDLE': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado del Agente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Estado del Agente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(agentSession.status)}>
                {agentSession.status}
              </Badge>
              {agentSession.campaign && (
                <span className="text-sm text-gray-600">
                  Campaña: {agentSession.campaign}
                </span>
              )}
              {agentSession.phone && (
                <span className="text-sm text-gray-600">
                  Teléfono: {agentSession.phone}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!agentSession.isLoggedIn ? (
                <Button onClick={handleLogin} disabled={loading}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              ) : (
                <>
                  {agentSession.status === 'READY' && (
                    <Button onClick={() => pause()} disabled={loading} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  )}
                  {agentSession.status === 'PAUSED' && (
                    <Button onClick={resume} disabled={loading} variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Reanudar
                    </Button>
                  )}
                  <Button onClick={logout} disabled={loading} variant="destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Login */}
      {!agentSession.isLoggedIn && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaign">Campaña</Label>
              <Input
                id="campaign"
                value={loginForm.campaign}
                onChange={(e) => setLoginForm(prev => ({...prev, campaign: e.target.value}))}
                placeholder="Nombre de la campaña"
              />
            </div>
            <div>
              <Label htmlFor="phone_login">Teléfono Login</Label>
              <Input
                id="phone_login"
                value={loginForm.phone_login}
                onChange={(e) => setLoginForm(prev => ({...prev, phone_login: e.target.value}))}
                placeholder="Número de teléfono"
              />
            </div>
            <div>
              <Label htmlFor="phone_pass">Contraseña Teléfono</Label>
              <Input
                id="phone_pass"
                type="password"
                value={loginForm.phone_pass}
                onChange={(e) => setLoginForm(prev => ({...prev, phone_pass: e.target.value}))}
                placeholder="Contraseña del teléfono"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de Llamada */}
      {agentSession.isLoggedIn && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Controles de Llamada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {callSession.isActive && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={getCallStatusColor(callSession.status)}>
                    {callSession.status}
                  </Badge>
                  {callSession.phoneNumber && (
                    <span className="font-medium">{callSession.phoneNumber}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    <span>{Math.floor(callSession.duration / 60)}:{(callSession.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <Button onClick={hangup} disabled={loading} variant="destructive">
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Colgar
                </Button>
              </div>
            )}

            {!callSession.isActive && agentSession.status === 'READY' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone_number">Número de Teléfono</Label>
                    <Input
                      id="phone_number"
                      value={callForm.phone_number}
                      onChange={(e) => setCallForm(prev => ({...prev, phone_number: e.target.value}))}
                      placeholder="+57XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead_id">ID Lead (Opcional)</Label>
                    <Input
                      id="lead_id"
                      value={callForm.lead_id}
                      onChange={(e) => setCallForm(prev => ({...prev, lead_id: e.target.value}))}
                      placeholder="ID del lead"
                    />
                  </div>
                </div>
                <Button onClick={handleDial} disabled={loading || !callForm.phone_number}>
                  <Phone className="h-4 w-4 mr-2" />
                  Marcar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Disposición de Llamada */}
      {callSession.isActive && callSession.status === 'CONNECTED' && (
        <Card>
          <CardHeader>
            <CardTitle>Disposición de Llamada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="disposition">Disposición</Label>
              <Select value={dispositionForm.disposition} onValueChange={(value) => 
                setDispositionForm(prev => ({...prev, disposition: value}))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar disposición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">Venta Realizada</SelectItem>
                  <SelectItem value="CALLBACK">Solicita Callback</SelectItem>
                  <SelectItem value="NI">No Interesado</SelectItem>
                  <SelectItem value="NP">No Contesta</SelectItem>
                  <SelectItem value="BUSY">Ocupado</SelectItem>
                  <SelectItem value="DNC">No Llamar</SelectItem>
                  <SelectItem value="DISC">Desconectado</SelectItem>
                  <SelectItem value="WRONG">Número Equivocado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                value={dispositionForm.comments}
                onChange={(e) => setDispositionForm(prev => ({...prev, comments: e.target.value}))}
                placeholder="Comentarios adicionales..."
                rows={3}
              />
            </div>
            <Button onClick={handleDisposition} disabled={loading || !dispositionForm.disposition}>
              Establecer Disposición
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentControls;
