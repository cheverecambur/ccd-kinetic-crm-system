
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Mail, MapPin, BookOpen, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated: () => void;
}

interface LeadFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  state: string;
  interest_course: string;
  source_id: string;
  comments: string;
  lead_quality: string;
}

const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose, onLeadCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    city: '',
    state: '',
    interest_course: '',
    source_id: '',
    comments: '',
    lead_quality: 'COLD'
  });

  const courses = [
    'Excel Avanzado',
    'Contabilidad Básica',
    'Marketing Digital',
    'Administración',
    'Recursos Humanos',
    'Office Básico'
  ];

  const sources = [
    'Facebook',
    'Google',
    'Instagram',
    'TikTok',
    'Referido',
    'Llamada Entrante',
    'WhatsApp'
  ];

  const leadQualities = [
    { value: 'HOT', label: 'Caliente (Muy Interesado)' },
    { value: 'WARM', label: 'Tibio (Moderadamente Interesado)' },
    { value: 'COLD', label: 'Frío (Poco Interés)' }
  ];

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone_number.trim()) {
      toast({
        title: "Error",
        description: "El teléfono es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    // Validar formato de teléfono colombiano
    const phoneRegex = /^(\+57|57)?[3][0-9]{9}$/;
    const cleanPhone = formData.phone_number.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Error",
        description: "Formato de teléfono inválido. Use: +57 300 123 4567",
        variant: "destructive",
      });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Formato de email inválido",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const leadData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number.replace(/\s/g, ''),
        email: formData.email || null,
        city: formData.city,
        state: formData.state,
        interest_course: formData.interest_course,
        source_id: formData.source_id,
        comments: formData.comments || null,
        lead_quality: formData.lead_quality,
        status: 'NEW',
        lead_score: 50, // Score inicial
        phone_code: '+57',
        country_code: 'COL',
        entry_date: new Date().toISOString(),
        modify_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) throw error;

      toast({
        title: "Lead creado exitosamente",
        description: `Lead ${formData.first_name} ${formData.last_name} ha sido añadido`,
      });

      // Limpiar formulario
      setFormData({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        city: '',
        state: '',
        interest_course: '',
        source_id: '',
        comments: '',
        lead_quality: 'COLD'
      });

      onLeadCreated();
      onClose();

    } catch (error) {
      console.error('Error creating lead:', error);
      toast({
        title: "Error al crear lead",
        description: "No se pudo crear el lead. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Crear Nuevo Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Nombre del lead"
              />
            </div>
            <div>
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Apellido del lead"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@ejemplo.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Bogotá, Medellín, etc."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">Departamento</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Cundinamarca, Antioquia, etc."
              />
            </div>
          </div>

          {/* Interés y fuente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interest_course">Curso de Interés</Label>
              <Select value={formData.interest_course} onValueChange={(value) => handleInputChange('interest_course', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {course}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source_id">Fuente del Lead</Label>
              <Select value={formData.source_id} onValueChange={(value) => handleInputChange('source_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="¿Cómo nos conoció?" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calidad del lead */}
          <div>
            <Label htmlFor="lead_quality">Calidad del Lead</Label>
            <Select value={formData.lead_quality} onValueChange={(value) => handleInputChange('lead_quality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar calidad" />
              </SelectTrigger>
              <SelectContent>
                {leadQualities.map((quality) => (
                  <SelectItem key={quality.value} value={quality.value}>
                    {quality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comentarios */}
          <div>
            <Label htmlFor="comments">Comentarios Adicionales</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Información adicional sobre el lead..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Lead
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeadModal;
