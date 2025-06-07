
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Users, Search } from 'lucide-react';
import { useVicidial } from '@/hooks/useVicidial';
import { useToast } from '@/hooks/use-toast';

interface ManualDialerProps {
  onCall: (phoneNumber: string, leadName?: string, leadId?: string) => void;
}

const ManualDialer: React.FC<ManualDialerProps> = ({ onCall }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { leads, fetchLeads } = useVicidial();
  const { toast } = useToast();

  const handleManualDial = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de teléfono",
        variant: "destructive",
      });
      return;
    }

    // Validar formato de número colombiano
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      toast({
        title: "Error",
        description: "El número debe tener al menos 10 dígitos",
        variant: "destructive",
      });
      return;
    }

    onCall(phoneNumber, leadName || 'Manual Call');
    
    // Limpiar campos después de llamar
    setPhoneNumber('');
    setLeadName('');
    
    toast({
      title: "Llamada iniciada",
      description: `Marcando a ${phoneNumber}`,
    });
  };

  const handleSearchLead = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsSearching(true);
    try {
      await fetchLeads();
      const foundLead = leads.find(lead => 
        lead.phone_number?.includes(phoneNumber.replace(/\D/g, ''))
      );
      
      if (foundLead) {
        setLeadName(`${foundLead.first_name || ''} ${foundLead.last_name || ''}`.trim());
        toast({
          title: "Lead encontrado",
          description: `Lead: ${foundLead.first_name} ${foundLead.last_name}`,
        });
      } else {
        toast({
          title: "No encontrado",
          description: "No se encontró un lead con este número",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar el lead",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 12)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Marcador Manual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Número de Teléfono</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              placeholder="+57 300 123 4567"
              className="flex-1"
            />
            <Button
              onClick={handleSearchLead}
              disabled={isSearching || !phoneNumber.trim()}
              variant="outline"
              size="icon"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="leadName">Nombre del Lead (Opcional)</Label>
          <Input
            id="leadName"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            placeholder="Nombre del contacto"
          />
        </div>

        <Button
          onClick={handleManualDial}
          disabled={!phoneNumber.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Phone className="h-4 w-4 mr-2" />
          Marcar Número
        </Button>

        <div className="text-sm text-gray-600">
          <p><strong>Formato sugerido:</strong> +57 300 123 4567</p>
          <p>También acepta: 3001234567, 57 300 123 4567</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualDialer;
