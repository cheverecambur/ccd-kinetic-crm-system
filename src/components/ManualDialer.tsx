
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Users, Search, Plus } from 'lucide-react';
import { useVicidialReal } from '@/hooks/useVicidialReal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ManualDialerProps {
  onCall: (phoneNumber: string, leadName?: string, leadId?: string) => void;
}

const ManualDialer: React.FC<ManualDialerProps> = ({ onCall }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundLead, setFoundLead] = useState<any>(null);
  const { addLead } = useVicidialReal();
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

    onCall(phoneNumber, leadName || 'Manual Call', foundLead?.id);
    
    // Limpiar campos después de llamar
    setPhoneNumber('');
    setLeadName('');
    setFoundLead(null);
    
    toast({
      title: "Llamada iniciada",
      description: `Marcando a ${phoneNumber}`,
    });
  };

  const handleSearchLead = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsSearching(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .or(`phone_number.ilike.%${cleanPhone}%,alt_phone.ilike.%${cleanPhone}%`)
        .limit(1);
      
      if (error) throw error;
      
      if (leads && leads.length > 0) {
        const lead = leads[0];
        setFoundLead(lead);
        setLeadName(`${lead.first_name || ''} ${lead.last_name || ''}`.trim());
        toast({
          title: "Lead encontrado",
          description: `Lead: ${lead.first_name} ${lead.last_name}`,
        });
      } else {
        setFoundLead(null);
        toast({
          title: "No encontrado",
          description: "No se encontró un lead con este número",
        });
      }
    } catch (error) {
      console.error('Error searching lead:', error);
      toast({
        title: "Error",
        description: "Error al buscar el lead",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateLead = async () => {
    if (!phoneNumber.trim() || !leadName.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa el teléfono y nombre",
        variant: "destructive",
      });
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const nameParts = leadName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
      const success = await addLead({
        phone_number: cleanPhone,
        phone_code: '+57',
        first_name: firstName,
        last_name: lastName,
        status: 'NEW',
        lead_quality: 'WARM'
      });

      if (success) {
        toast({
          title: "Lead creado",
          description: "Lead agregado exitosamente a Vicidial",
        });
        
        // Buscar el lead recién creado
        setTimeout(() => {
          handleSearchLead();
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "Error al crear el lead",
        variant: "destructive",
      });
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
          <Label htmlFor="leadName">Nombre del Lead</Label>
          <div className="flex gap-2">
            <Input
              id="leadName"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Nombre del contacto"
              className="flex-1"
            />
            <Button
              onClick={handleCreateLead}
              disabled={!phoneNumber.trim() || !leadName.trim()}
              variant="outline"
              size="icon"
              title="Crear nuevo lead"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {foundLead && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Lead Encontrado</span>
            </div>
            <div className="text-sm text-green-700">
              <p><strong>Nombre:</strong> {foundLead.first_name} {foundLead.last_name}</p>
              <p><strong>Teléfono:</strong> {foundLead.phone_number}</p>
              {foundLead.email && <p><strong>Email:</strong> {foundLead.email}</p>}
              {foundLead.city && <p><strong>Ciudad:</strong> {foundLead.city}</p>}
              <p><strong>Estado:</strong> {foundLead.status}</p>
            </div>
          </div>
        )}

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
          <p className="mt-2 text-xs">
            💡 <strong>Tip:</strong> Usa el botón de búsqueda para encontrar leads existentes o el botón + para crear uno nuevo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualDialer;
