
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Play, 
  Pause, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Headphones,
  MessageSquare,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

interface CallRecord {
  id: string;
  advisorId: string;
  advisorName: string;
  leadPhone: string;
  callDate: Date;
  duration: number;
  disposition: string;
  recording: string;
  quality: {
    overall: number;
    greeting: number;
    listening: number;
    product_knowledge: number;
    closing: number;
    compliance: number;
  };
  feedback: string;
  reviewed: boolean;
  reviewer: string;
}

interface QualityMetrics {
  advisor: string;
  totalCalls: number;
  reviewedCalls: number;
  averageQuality: number;
  trend: 'up' | 'down' | 'stable';
  strengths: string[];
  improvements: string[];
}

const QualityMonitoring = () => {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [playingRecording, setPlayingRecording] = useState(false);

  const callRecords: CallRecord[] = [
    {
      id: '1',
      advisorId: 'advisor1',
      advisorName: 'Carlos Rodríguez',
      leadPhone: '+57 301 234 5678',
      callDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 480,
      disposition: 'INTERESTED',
      recording: 'recording_001.mp3',
      quality: {
        overall: 92,
        greeting: 95,
        listening: 90,
        product_knowledge: 88,
        closing: 94,
        compliance: 96
      },
      feedback: 'Excelente manejo de objeciones. Mejorar conocimiento técnico del producto.',
      reviewed: true,
      reviewer: 'Supervisor 1'
    },
    {
      id: '2',
      advisorId: 'advisor2',
      advisorName: 'María González',
      leadPhone: '+57 300 876 5432',
      callDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: 360,
      disposition: 'CALLBACK',
      recording: 'recording_002.mp3',
      quality: {
        overall: 78,
        greeting: 85,
        listening: 75,
        product_knowledge: 82,
        closing: 70,
        compliance: 88
      },
      feedback: 'Necesita mejorar técnicas de cierre. Muy buena escucha activa.',
      reviewed: true,
      reviewer: 'Supervisor 2'
    }
  ];

  const qualityMetrics: QualityMetrics[] = [
    {
      advisor: 'Carlos Rodríguez',
      totalCalls: 45,
      reviewedCalls: 12,
      averageQuality: 89,
      trend: 'up',
      strengths: ['Manejo de objeciones', 'Cumplimiento', 'Saludo profesional'],
      improvements: ['Conocimiento técnico', 'Tiempo de llamada']
    },
    {
      advisor: 'María González',
      totalCalls: 38,
      reviewedCalls: 10,
      averageQuality: 82,
      trend: 'stable',
      strengths: ['Escucha activa', 'Empatía', 'Seguimiento'],
      improvements: ['Técnicas de cierre', 'Confianza en el producto']
    }
  ];

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Llamadas para Monitoreo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callRecords.map((call) => (
                  <div key={call.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">{call.advisorName}</div>
                          <div className="text-sm text-gray-600">{call.leadPhone}</div>
                          <div className="text-xs text-gray-500">
                            {call.callDate.toLocaleString()} • {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <Badge className={call.reviewed ? 'bg-green-500' : 'bg-blue-500'}>
                          {call.reviewed ? 'Revisada' : 'Pendiente'}
                        </Badge>
                        <Badge variant="outline">{call.disposition}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {call.reviewed && (
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getQualityColor(call.quality.overall)}`}>
                              {call.quality.overall}%
                            </div>
                            <div className="text-xs text-gray-500">Calidad</div>
                          </div>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedCall(call)}>
                              <Play className="h-4 w-4 mr-2" />
                              Revisar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Revisión de Calidad - {call.advisorName}</DialogTitle>
                            </DialogHeader>
                            {selectedCall && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Información de la Llamada</h4>
                                    <div className="space-y-1 text-sm">
                                      <div><span className="font-medium">Asesor:</span> {call.advisorName}</div>
                                      <div><span className="font-medium">Lead:</span> {call.leadPhone}</div>
                                      <div><span className="font-medium">Fecha:</span> {call.callDate.toLocaleString()}</div>
                                      <div><span className="font-medium">Duración:</span> {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}</div>
                                      <div><span className="font-medium">Disposición:</span> {call.disposition}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Reproductor de Audio</h4>
                                    <div className="p-4 border rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Button 
                                          size="sm" 
                                          onClick={() => setPlayingRecording(!playingRecording)}
                                        >
                                          {playingRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </Button>
                                        <span className="text-sm">{call.recording}</span>
                                      </div>
                                      <Progress value={playingRecording ? 45 : 0} className="h-2" />
                                      <div className="text-xs text-gray-500 mt-1">
                                        {playingRecording ? '02:15 / 08:00' : '00:00 / 08:00'}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-4">Evaluación de Calidad</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(call.quality).map(([category, score]) => (
                                      category !== 'overall' && (
                                        <div key={category} className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="capitalize">{category.replace('_', ' ')}</span>
                                            <span className={`font-medium ${getQualityColor(score)}`}>{score}%</span>
                                          </div>
                                          <Progress value={score} className="h-2" />
                                        </div>
                                      )
                                    ))}
                                  </div>
                                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span className="font-medium">Calidad General: </span>
                                      <span className={`text-xl font-bold ${getQualityColor(call.quality.overall)}`}>
                                        {call.quality.overall}%
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Retroalimentación</h4>
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="h-4 w-4 mt-1 text-blue-500" />
                                      <div>
                                        <p className="text-sm">{call.feedback}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                          Revisado por: {call.reviewer}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.advisor}</span>
                    <Badge className={getQualityBadge(metric.averageQuality)}>
                      {metric.averageQuality}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{metric.totalCalls}</div>
                        <div className="text-xs text-gray-600">Total Llamadas</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{metric.reviewedCalls}</div>
                        <div className="text-xs text-gray-600">Revisadas</div>
                      </div>
                      <div className="flex items-center justify-center">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        ) : (
                          <div className="h-5 w-5 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Fortalezas
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {metric.strengths.map((strength, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-yellow-500" />
                        Áreas de Mejora
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {metric.improvements.map((improvement, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reporte de Calidad General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85.5%</div>
                  <div className="text-sm text-gray-600">Calidad Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-gray-600">Llamadas Revisadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Asesores Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">22%</div>
                  <div className="text-sm text-gray-600">Cobertura de Monitoreo</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Distribución de Calidad</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-24">Excelente (90-100%)</span>
                      <Progress value={35} className="flex-1" />
                      <span className="text-sm w-12">35%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-24">Bueno (80-89%)</span>
                      <Progress value={45} className="flex-1" />
                      <span className="text-sm w-12">45%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-24">Regular (70-79%)</span>
                      <Progress value={15} className="flex-1" />
                      <span className="text-sm w-12">15%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm w-24">Deficiente (&lt;70%)</span>
                      <Progress value={5} className="flex-1" />
                      <span className="text-sm w-12">5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityMonitoring;
