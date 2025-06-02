
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VicidialDataExtractor from '../components/VicidialDataExtractor';
import PerformanceAlerts from '../components/PerformanceAlerts';
import QualityMonitoring from '../components/QualityMonitoring';
import AdvisorPerformance from '../components/AdvisorPerformance';
import CauseAnalysis from '../components/CauseAnalysis';

const QualityManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Calidad y Rendimiento</h1>
        <p className="text-gray-600">Sistema integral de monitoreo, alertas y análisis de rendimiento</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Causas</TabsTrigger>
          <TabsTrigger value="vicidial">Datos Vicidial</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <AdvisorPerformance />
        </TabsContent>

        <TabsContent value="monitoring">
          <QualityMonitoring />
        </TabsContent>

        <TabsContent value="alerts">
          <PerformanceAlerts />
        </TabsContent>

        <TabsContent value="analysis">
          <CauseAnalysis />
        </TabsContent>

        <TabsContent value="vicidial">
          <VicidialDataExtractor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityManagement;
