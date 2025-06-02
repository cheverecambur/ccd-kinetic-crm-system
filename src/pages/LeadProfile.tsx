
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Zap, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadProfileComplete from '../components/LeadProfileComplete';
import LeadActivationFlow from '../components/LeadActivationFlow';

const LeadProfile = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);

  const handleActivationComplete = (activationData: any) => {
    console.log('Activación completada:', activationData);
    setActivationDialogOpen(false);
    // Aquí se actualizarían los datos del lead en la base de datos
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Leads
          </Button>
          <h1 className="text-2xl font-bold">Perfil Completo del Lead</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Activar Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Proceso de Activación</DialogTitle>
              </DialogHeader>
              <LeadActivationFlow 
                leadId={leadId || '1'} 
                onActivationComplete={handleActivationComplete}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Vista Rápida
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <LeadProfileComplete leadPhone="+57 301 234 5678" />
    </div>
  );
};

export default LeadProfile;
