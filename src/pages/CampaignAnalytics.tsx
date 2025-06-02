
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CampaignROIAnalysis from '../components/CampaignROIAnalysis';

const CampaignAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Campañas
          </Button>
          <h1 className="text-2xl font-bold">Analytics de Campañas</h1>
        </div>
      </div>

      {/* Contenido principal */}
      <CampaignROIAnalysis />
    </div>
  );
};

export default CampaignAnalytics;
