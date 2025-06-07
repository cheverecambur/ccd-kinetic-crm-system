
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneOff, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Clock,
  Timer
} from 'lucide-react';
import { CallSession } from '@/hooks/useVicidial';

interface CallControlsProps {
  callSession: CallSession;
  onHangup: () => void;
  onPause: () => void;
  onMute: () => void;
  onHold: () => void;
  formatCallDuration: (seconds: number) => string;
  isEndingCall?: boolean;
  isPausingCall?: boolean;
}

const CallControls: React.FC<CallControlsProps> = ({
  callSession,
  onHangup,
  onPause,
  onMute,
  onHold,
  formatCallDuration,
  isEndingCall = false,
  isPausingCall = false
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isOnHold, setIsOnHold] = React.useState(false);

  const handleMute = () => {
    setIsMuted(!isMuted);
    onMute();
  };

  const handleHold = () => {
    setIsOnHold(!isOnHold);
    onHold();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'ringing': return 'bg-yellow-500';
      case 'paused': return 'bg-orange-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (!callSession.isActive) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Phone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No hay llamada activa</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Control de Llamada</span>
          <Badge className={getStatusColor(callSession.status)}>
            {callSession.status?.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de la llamada */}
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold">
            {callSession.leadName || 'Llamada Manual'}
          </div>
          <div className="text-sm text-gray-600">
            {callSession.phoneNumber}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-mono text-lg">
              {formatCallDuration(callSession.duration)}
            </span>
          </div>
        </div>

        {/* Estados especiales */}
        {callSession.isPaused && (
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center">
            <Pause className="h-5 w-5 mx-auto mb-1 text-orange-600" />
            <p className="text-sm text-orange-800">Llamada en pausa</p>
          </div>
        )}

        {isMuted && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
            <MicOff className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-sm text-blue-800">Micrófono silenciado</p>
          </div>
        )}

        {isOnHold && (
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 text-center">
            <Timer className="h-5 w-5 mx-auto mb-1 text-purple-600" />
            <p className="text-sm text-purple-800">Llamada en espera</p>
          </div>
        )}

        {/* Controles principales */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onPause}
            disabled={isPausingCall}
            variant={callSession.isPaused ? "default" : "outline"}
            className="flex-1"
          >
            {callSession.isPaused ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Reanudar
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            )}
          </Button>

          <Button
            onClick={handleMute}
            variant={isMuted ? "default" : "outline"}
            className="flex-1"
          >
            {isMuted ? (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Activar
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Silenciar
              </>
            )}
          </Button>

          <Button
            onClick={handleHold}
            variant={isOnHold ? "default" : "outline"}
            className="flex-1"
          >
            {isOnHold ? (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Retomar
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Espera
              </>
            )}
          </Button>

          <Button
            onClick={onHangup}
            disabled={isEndingCall}
            variant="destructive"
            className="flex-1"
          >
            {isEndingCall ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Colgando...
              </div>
            ) : (
              <>
                <PhoneOff className="h-4 w-4 mr-2" />
                Colgar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallControls;
