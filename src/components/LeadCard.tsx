
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  User, 
  MapPin, 
  Calendar,
  Star,
  Eye
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  status: string;
  score: number;
  source: string;
  lastContact?: string;
  nextAction?: string;
}

interface LeadCardProps {
  lead: Lead;
  onView?: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onView }) => {
  const { toast } = useToast();

  const handleCall = () => {
    toast({
      title: "Iniciando llamada",
      description: `Conectando con ${lead.name} (${lead.phone})`,
    });
  };

  const handleWhatsApp = () => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${lead.name}, soy de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp abierto",
      description: `Mensaje enviado a ${lead.name}`,
    });
  };

  const handleEmail = () => {
    if (lead.email) {
      const subject = encodeURIComponent('Información sobre nuestros cursos - CCD Capacitación');
      const body = encodeURIComponent(`Hola ${lead.name},\n\nGracias por tu interés en nuestros cursos.\n\nSaludos,\nEquipo CCD Capacitación`);
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header con nombre y score */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {lead.city}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                {lead.score}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-500">Score</span>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-green-600" />
              <span>{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
          </div>

          {/* Status y fuente */}
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {lead.source}
            </Badge>
          </div>

          {/* Información adicional */}
          {lead.lastContact && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Último contacto: {new Date(lead.lastContact).toLocaleDateString()}
            </div>
          )}

          {lead.nextAction && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              Próxima acción: {lead.nextAction}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4 mr-1" />
              Llamar
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            {lead.email && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEmail}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {onView && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onView(lead.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
