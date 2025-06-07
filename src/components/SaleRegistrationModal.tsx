
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Upload, Save, X, CheckCircle, FileImage, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SaleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  leadName?: string;
  phoneNumber?: string;
  onSaleRegistered: () => void;
}

interface SaleData {
  course_code: string;
  course_name: string;
  payment_amount: number;
  payment_method: string;
  payment_date: string;
  student_name: string;
  student_dni: string;
  student_email: string;
  voucher_number: string;
  payment_status: 'PARTIAL' | 'COMPLETE';
  notes: string;
}

const SaleRegistrationModal: React.FC<SaleRegistrationModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
  phoneNumber,
  onSaleRegistered
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<SaleData>({
    course_code: '',
    course_name: '',
    payment_amount: 0,
    payment_method: '',
    payment_date: new Date().toISOString().split('T')[0],
    student_name: leadName || '',
    student_dni: '',
    student_email: '',
    voucher_number: '',
    payment_status: 'PARTIAL',
    notes: ''
  });

  const courses = [
    { code: 'EXL_ADV', name: 'Excel Avanzado', price: 150 },
    { code: 'CNT_BAS', name: 'Contabilidad Básica', price: 200 },
    { code: 'MKT_DIG', name: 'Marketing Digital', price: 180 },
    { code: 'ADM_GEN', name: 'Administración', price: 220 },
    { code: 'RRH_BAS', name: 'Recursos Humanos', price: 190 },
    { code: 'OFF_BAS', name: 'Office Básico', price: 120 }
  ];

  const paymentMethods = [
    'Transferencia Bancaria',
    'Depósito Bancario',
    'Efectivo',
    'PSE',
    'Tarjeta de Crédito',
    'Tarjeta Débito',
    'Nequi',
    'Daviplata'
  ];

  const handleInputChange = (field: keyof SaleData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCourseChange = (courseCode: string) => {
    const course = courses.find(c => c.code === courseCode);
    if (course) {
      setFormData(prev => ({
        ...prev,
        course_code: courseCode,
        course_name: course.name,
        payment_amount: course.price
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Solo se permiten archivos de imagen",
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo no puede superar los 5MB",
          variant: "destructive",
        });
        return;
      }

      setVoucherFile(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.course_code) {
      toast({
        title: "Error",
        description: "Debes seleccionar un curso",
        variant: "destructive",
      });
      return false;
    }

    if (formData.payment_amount <= 0) {
      toast({
        title: "Error",
        description: "El monto de pago debe ser mayor a 0",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.payment_method) {
      toast({
        title: "Error",
        description: "Debes seleccionar un método de pago",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.student_name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del estudiante es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.student_dni.trim()) {
      toast({
        title: "Error",
        description: "El DNI del estudiante es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (!voucherFile && formData.payment_method !== 'Efectivo') {
      toast({
        title: "Error",
        description: "Debes subir el comprobante de pago",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadVoucher = async (): Promise<string | null> => {
    if (!voucherFile) return null;

    try {
      const fileExt = voucherFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `vouchers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, voucherFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading voucher:', error);
      toast({
        title: "Error al subir comprobante",
        description: "No se pudo subir el comprobante. Intenta de nuevo.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Subir comprobante si existe
      const voucherUrl = await uploadVoucher();
      
      // Registrar la venta
      const saleData = {
        lead_id: leadId ? parseInt(leadId) : null,
        course_code: formData.course_code,
        course_name: formData.course_name,
        payment_amount: formData.payment_amount,
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        student_name: formData.student_name,
        student_dni: formData.student_dni,
        student_email: formData.student_email || null,
        voucher_number: formData.voucher_number,
        voucher_url: voucherUrl,
        payment_status: formData.payment_status,
        notes: formData.notes || null,
        sale_date: new Date().toISOString(),
        status: 'CONFIRMED'
      };

      // TODO: Insertar en tabla de ventas cuando esté creada
      console.log('Sale data:', saleData);

      // Actualizar el lead con la venta
      if (leadId) {
        const { error: leadError } = await supabase
          .from('leads')
          .update({
            status: 'CLOSED_WON',
            modify_date: new Date().toISOString()
          })
          .eq('id', parseInt(leadId));

        if (leadError) console.error('Error updating lead:', leadError);
      }

      toast({
        title: "Venta registrada exitosamente",
        description: `Venta de ${formData.course_name} por $${formData.payment_amount} registrada`,
      });

      // Limpiar formulario
      setFormData({
        course_code: '',
        course_name: '',
        payment_amount: 0,
        payment_method: '',
        payment_date: new Date().toISOString().split('T')[0],
        student_name: '',
        student_dni: '',
        student_email: '',
        voucher_number: '',
        payment_status: 'PARTIAL',
        notes: ''
      });
      setVoucherFile(null);

      onSaleRegistered();
      onClose();

    } catch (error) {
      console.error('Error registering sale:', error);
      toast({
        title: "Error al registrar venta",
        description: "No se pudo registrar la venta. Intenta de nuevo.",
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
            <CheckCircle className="h-5 w-5 text-green-600" />
            Registrar Venta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del lead */}
          {leadName && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Lead:</strong> {leadName}
              </p>
              {phoneNumber && (
                <p className="text-sm text-green-600">
                  <strong>Teléfono:</strong> {phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Selección del curso */}
          <div>
            <Label htmlFor="course">Curso Vendido *</Label>
            <Select value={formData.course_code} onValueChange={handleCourseChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.code} value={course.code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{course.name}</span>
                      <Badge variant="outline" className="ml-2">
                        ${course.price}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Datos del pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_amount">Monto Pagado *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="payment_amount"
                  type="number"
                  value={formData.payment_amount}
                  onChange={(e) => handleInputChange('payment_amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="payment_method">Método de Pago *</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_date">Fecha de Pago *</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleInputChange('payment_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment_status">Estado del Pago</Label>
              <Select value={formData.payment_status} onValueChange={(value: 'PARTIAL' | 'COMPLETE') => handleInputChange('payment_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PARTIAL">Pago Parcial</SelectItem>
                  <SelectItem value="COMPLETE">Pago Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datos del estudiante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_name">Nombre Completo del Estudiante *</Label>
              <Input
                id="student_name"
                value={formData.student_name}
                onChange={(e) => handleInputChange('student_name', e.target.value)}
                placeholder="Nombre completo para el certificado"
              />
            </div>
            <div>
              <Label htmlFor="student_dni">DNI del Estudiante *</Label>
              <Input
                id="student_dni"
                value={formData.student_dni}
                onChange={(e) => handleInputChange('student_dni', e.target.value)}
                placeholder="Número de identificación"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_email">Email del Estudiante</Label>
              <Input
                id="student_email"
                type="email"
                value={formData.student_email}
                onChange={(e) => handleInputChange('student_email', e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="voucher_number">Número de Comprobante</Label>
              <Input
                id="voucher_number"
                value={formData.voucher_number}
                onChange={(e) => handleInputChange('voucher_number', e.target.value)}
                placeholder="Número de referencia"
              />
            </div>
          </div>

          {/* Upload de comprobante */}
          <div>
            <Label htmlFor="voucher_file">Comprobante de Pago</Label>
            <div className="mt-2">
              <label htmlFor="voucher_file" className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                <Upload className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  {voucherFile ? (
                    <span className="text-green-600">
                      <FileImage className="inline h-4 w-4 mr-1" />
                      {voucherFile.name}
                    </span>
                  ) : (
                    <span className="text-gray-600">Subir imagen del comprobante (JPG, PNG)</span>
                  )}
                </div>
              </label>
              <input
                id="voucher_file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Información adicional sobre la venta..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Venta
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

export default SaleRegistrationModal;
