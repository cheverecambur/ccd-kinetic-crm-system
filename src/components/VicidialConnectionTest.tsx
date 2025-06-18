
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useVicidialReal } from '@/hooks/useVicidialReal';
import { 
  Wifi, 
  WifiOff, 
  Settings, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const VicidialConnectionTest = () => {
  const { toast } = useToast();
  const { isVicidialConnected, checkVicidialConnection, vicidialApi } = useVicidialReal();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResults([]);
    
    try {
      // Test 1: Verificar conexión básica
      setTestResults(prev => [...prev, '🔄 Verificando conexión con Vicidial...']);
      const isConnected = await checkVicidialConnection();
      
      if (!isConnected) {
        setTestResults(prev => [...prev, '❌ Error: No se puede conectar con Vicidial']);
        setTestResults(prev => [...prev, '💡 Verifique la URL del servidor en las variables de entorno']);
        return;
      }
      
      setTestResults(prev => [...prev, '✅ Conexión establecida con Vicidial']);

      // Test 2: Obtener versión
      setTestResults(prev => [...prev, '🔄 Obteniendo versión de Vicidial...']);
      const versionResponse = await vicidialApi.getVersion();
      
      if (vicidialApi.isSuccess(versionResponse)) {
        setTestResults(prev => [...prev, `✅ Versión: ${versionResponse.rawResponse}`]);
        setConnectionDetails(prev => ({
          ...prev,
          version: versionResponse.rawResponse
        }));
      } else {
        setTestResults(prev => [...prev, `❌ Error obteniendo versión: ${versionResponse.error}`]);
      }

      // Test 3: Obtener información del servidor
      setTestResults(prev => [...prev, '🔄 Obteniendo información del servidor...']);
      const serverResponse = await vicidialApi.getWebserverInfo();
      
      if (vicidialApi.isSuccess(serverResponse)) {
        setTestResults(prev => [...prev, '✅ Información del servidor obtenida']);
        setConnectionDetails(prev => ({
          ...prev,
          serverInfo: serverResponse.rawResponse
        }));
      } else {
        setTestResults(prev => [...prev, `⚠️ Advertencia: ${serverResponse.error}`]);
      }

      setTestResults(prev => [...prev, '🎉 ¡Prueba de conexión completada exitosamente!']);
      
      toast({
        title: "Prueba exitosa",
        description: "La conexión con Vicidial está funcionando correctamente",
      });

    } catch (error: any) {
      setTestResults(prev => [...prev, `❌ Error inesperado: ${error.message}`]);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con Vicidial",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getCurrentConfig = () => {
    return {
      url: import.meta.env.VITE_VICIDIAL_URL || 'No configurado',
      user: import.meta.env.VITE_VICIDIAL_USER || 'No configurado',
      pass: import.meta.env.VITE_VICIDIAL_PASS ? '****' : 'No configurado'
    };
  };

  const config = getCurrentConfig();

  return (
    <div className="space-y-6">
      {/* Estado de conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isVicidialConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Estado de Conexión Vicidial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge className={isVicidialConnected ? "bg-green-500" : "bg-red-500"}>
                {isVicidialConnected ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conectado
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Desconectado
                  </>
                )}
              </Badge>
            </div>
            <Button 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              variant="outline"
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Probando...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Probar Conexión
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuración actual */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Actual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>URL del Servidor Vicidial</Label>
            <div className="p-2 bg-gray-100 rounded font-mono text-sm">
              {config.url}
            </div>
          </div>
          <div>
            <Label>Usuario de API</Label>
            <div className="p-2 bg-gray-100 rounded font-mono text-sm">
              {config.user}
            </div>
          </div>
          <div>
            <Label>Contraseña de API</Label>
            <div className="p-2 bg-gray-100 rounded font-mono text-sm">
              {config.pass}
            </div>
          </div>
          
          {config.url === 'No configurado' && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Configuración requerida:</strong> Configure las variables de entorno para conectar con Vicidial.
              </p>
              <ul className="text-yellow-700 text-xs mt-2 space-y-1">
                <li>• VITE_VICIDIAL_URL=http://tu-servidor-vicidial.com</li>
                <li>• VITE_VICIDIAL_USER=api_user</li>
                <li>• VITE_VICIDIAL_PASS=api_password</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados de la prueba */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalles de conexión */}
      {connectionDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Conexión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectionDetails.version && (
              <div>
                <Label>Versión de Vicidial</Label>
                <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                  {connectionDetails.version}
                </div>
              </div>
            )}
            {connectionDetails.serverInfo && (
              <div>
                <Label>Información del Servidor</Label>
                <div className="p-2 bg-gray-100 rounded font-mono text-xs max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {connectionDetails.serverInfo}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Guía de configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Guía de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Pasos para configurar Vicidial:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Configure las variables de entorno en su archivo .env</li>
              <li>Asegúrese de que el servidor Vicidial tenga la API habilitada</li>
              <li>Verifique que el usuario de API tenga los permisos necesarios</li>
              <li>Pruebe la conexión usando el botón "Probar Conexión"</li>
            </ol>
            
            <p className="mt-4"><strong>Funciones disponibles:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Marcado manual y automático</li>
              <li>Control de llamadas (colgar, pausar, transferir)</li>
              <li>Disposiciones y callbacks</li>
              <li>Grabación de llamadas</li>
              <li>Gestión de leads</li>
              <li>Métricas en tiempo real</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VicidialConnectionTest;
