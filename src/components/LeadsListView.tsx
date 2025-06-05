
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Phone, 
  MessageSquare, 
  Eye,
  Mail,
  Star,
  Clock,
  User
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  status: string;
  score: number;
  source: string;
  course: string;
  lastContact?: string;
  nextAction?: string;
  callbackTime?: string;
  callbackDate?: string;
  disposition?: string;
  attemptCount: number;
}

interface LeadsListViewProps {
  leads: Lead[];
  onCall: (phone: string, name: string, id: string) => void;
  onView: (id: string) => void;
}

const LeadsListView: React.FC<LeadsListViewProps> = ({ leads, onCall, onView }) => {
  
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

  const getDispositionColor = (disposition?: string) => {
    if (!disposition) return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      'NO_CONTESTA': 'bg-gray-100 text-gray-800',
      'NO_DESEA': 'bg-red-100 text-red-800',
      'CLTE_POTENCIAL': 'bg-yellow-100 text-yellow-800',
      'VOLVER_LLAMAR': 'bg-blue-100 text-blue-800',
      'MUY_INTERESADO': 'bg-green-100 text-green-800',
      'SER_VACANTE': 'bg-purple-100 text-purple-800',
      'PAGO_INCOMPLETO': 'bg-orange-100 text-orange-800',
      'TRIBULADO': 'bg-green-200 text-green-900',
      'EFICAZ': 'bg-gray-200 text-gray-800'
    };
    
    return colors[disposition] || 'bg-gray-100 text-gray-800';
  };

  const getDispositionName = (code?: string) => {
    if (!code) return '';
    
    const names: Record<string, string> = {
      'NO_CONTESTA': 'No Contesta',
      'NO_DESEA': 'No Desea',
      'CLTE_POTENCIAL': 'Cliente Potencial',
      'VOLVER_LLAMAR': 'Volver a Llamar',
      'MUY_INTERESADO': 'Muy Interesado',
      'SER_VACANTE': 'Ser Vacante',
      'PAGO_INCOMPLETO': 'Pago Incompleto',
      'TRIBULADO': 'Tribulado',
      'EFICAZ': 'Eficaz'
    };
    
    return names[code] || code;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleWhatsApp = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${lead.name}, soy de CCD Capacitación. ¿Tienes unos minutos para conversar sobre nuestros cursos?`);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (lead: Lead) => {
    if (lead.email) {
      const subject = encodeURIComponent('Información sobre nuestros cursos - CCD Capacitación');
      const body = encodeURIComponent(`Hola ${lead.name},\n\nGracias por tu interés en nuestros cursos.\n\nSaludos,\nEquipo CCD Capacitación`);
      window.location.href = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Lista de Leads ({leads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipificación</TableHead>
                <TableHead>Último Contacto</TableHead>
                <TableHead>Intentos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.city}</div>
                      {lead.callbackDate && lead.callbackTime && (
                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          Callback: {lead.callbackDate} {lead.callbackTime}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="text-sm font-mono">{lead.phone}</div>
                      {lead.email && (
                        <div className="text-xs text-gray-500 truncate max-w-32">
                          {lead.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {lead.source}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-blue-700">
                        {lead.course || 'Sin curso'}
                      </div>
                      {lead.nextAction && (
                        <div className="text-xs text-blue-600 mt-1">
                          {lead.nextAction}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {lead.disposition && (
                      <Badge variant="outline" className={getDispositionColor(lead.disposition)}>
                        {getDispositionName(lead.disposition)}
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {lead.lastContact && (
                      <div className="text-sm text-gray-600">
                        {lead.lastContact}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{lead.attemptCount}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        onClick={() => onCall(lead.phone, lead.name, lead.id)}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                        onClick={() => handleWhatsApp(lead)}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      
                      {lead.email && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEmail(lead)}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onView(lead.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {leads.length === 0 && (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay leads disponibles</h3>
              <p className="text-gray-600">
                No se encontraron leads con los filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsListView;
