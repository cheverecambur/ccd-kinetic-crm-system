
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Send, 
  Loader2, 
  User,
  Brain,
  Settings,
  BarChart3,
  MessageSquare,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'suggestion' | 'analysis' | 'configuration' | 'help';
}

interface AIAssistantProps {
  context?: string;
  initialMinimized?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context, initialMinimized = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mensaje de bienvenida personalizado según el rol
    const welcomeMessage = getWelcomeMessage();
    if (welcomeMessage) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        type: 'help'
      }]);
    }
  }, [user?.role]);

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'AGENT':
        return `¡Hola ${user.name}! Soy tu asistente de IA especializado en ventas y atención al cliente. Te puedo ayudar con:

📞 **Gestión de llamadas**: Scripts, objeciones, técnicas de cierre
👥 **Leads**: Análisis de prospectos, estrategias de seguimiento
📊 **Rendimiento**: Métricas personales, áreas de mejora
💡 **Consejos**: Tips para aumentar conversiones

¿En qué te puedo ayudar hoy?`;

      case 'SUPERVISOR':
        return `¡Hola ${user.name}! Soy tu asistente de IA para supervisión y gestión de equipos. Te ayudo con:

👥 **Gestión de equipo**: Análisis de rendimiento, coaching
📈 **Reportes**: KPIs, tendencias, análisis comparativo
🎯 **Campañas**: Optimización, asignación de recursos
⚡ **Calidad**: Monitoreo, evaluaciones, mejoras

¿Qué necesitas analizar o gestionar?`;

      case 'ADMIN':
        return `¡Hola ${user.name}! Soy tu asistente de IA para administración del sistema. Te apoyo en:

⚙️ **Configuración**: Sistema, usuarios, permisos
📊 **Analytics**: ROI, análisis avanzados, predicciones
🔧 **Optimización**: Procesos, workflows, automatización
🛡️ **Seguridad**: Políticas, auditorías, compliance

¿Qué aspecto del sistema quieres configurar u optimizar?`;

      default:
        return '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte?';
    }
  };

  const getSystemPrompt = () => {
    const baseContext = `Eres un asistente de IA especializado para un sistema CRM de call center. El usuario actual es ${user?.name} con rol ${user?.role}.`;
    
    switch (user?.role) {
      case 'AGENT':
        return `${baseContext}

ESPECIALIZACIÓN: Asesor Comercial/Agente de Ventas
- Ayuda con scripts de ventas y manejo de objeciones
- Proporciona análisis de leads y estrategias de contacto
- Ofrece consejos para mejorar conversiones
- Asiste en programación de callbacks y seguimientos
- Analiza métricas de rendimiento personal
- Sugiere técnicas de cierre de ventas
- Ayuda con documentación de interacciones

CONTEXTO ACTUAL: ${context || 'Panel de asesor'}
TONO: Professional pero cercano, motivacional, orientado a resultados`;

      case 'SUPERVISOR':
        return `${baseContext}

ESPECIALIZACIÓN: Supervisor de Equipos
- Analiza rendimiento de equipos y agentes individuales
- Proporciona insights sobre KPIs y métricas
- Sugiere estrategias de coaching y mejora
- Ayuda con asignación de recursos y campañas
- Analiza tendencias y patrones de datos
- Asiste en evaluaciones de calidad
- Proporciona reportes ejecutivos

CONTEXTO ACTUAL: ${context || 'Panel de supervisión'}
TONO: Analítico, estratégico, orientado a liderazgo`;

      case 'ADMIN':
        return `${baseContext}

ESPECIALIZACIÓN: Administración de Sistema
- Configura y optimiza el sistema CRM
- Analiza ROI y métricas globales
- Sugiere mejoras en procesos y workflows
- Ayuda con configuración de usuarios y permisos
- Proporciona análisis predictivos
- Asiste en integración de herramientas
- Ofrece soporte técnico avanzado

CONTEXTO ACTUAL: ${context || 'Panel de administración'}
TONO: Técnico, estratégico, orientado a la optimización`;

      default:
        return `${baseContext} Proporciona ayuda general con el sistema CRM.`;
    }
  };

  const getQuickSuggestions = () => {
    switch (user?.role) {
      case 'AGENT':
        return [
          "¿Cómo mejorar mi tasa de conversión?",
          "Script para venta de cursos",
          "Cómo manejar objeciones de precio",
          "Analizar mi rendimiento de hoy"
        ];
      case 'SUPERVISOR':
        return [
          "Análisis del equipo esta semana",
          "KPIs de conversión por agente",
          "Estrategia para campaign mejorar",
          "Reportes de calidad de llamadas"
        ];
      case 'ADMIN':
        return [
          "Configurar nuevas campañas",
          "Análisis ROI por fuente de leads",
          "Optimizar asignación automática",
          "Configurar integraciones"
        ];
      default:
        return ["¿Cómo usar el sistema?", "Ayuda general"];
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          systemPrompt: getSystemPrompt(),
          context: context,
          userRole: user?.role,
          conversationHistory: messages.slice(-5) // Últimos 5 mensajes para contexto
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el asistente');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: data.type || 'help'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo conectar con el asistente de IA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'AGENT': return <User className="h-4 w-4" />;
      case 'SUPERVISOR': return <BarChart3 className="h-4 w-4" />;
      case 'ADMIN': return <Settings className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'AGENT': return 'bg-blue-500';
      case 'SUPERVISOR': return 'bg-green-500';
      case 'ADMIN': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className={`${getRoleColor()} hover:opacity-80 rounded-full p-3 shadow-lg`}
        >
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <span className="hidden sm:inline">IA Assistant</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px]">
      <Card className="shadow-2xl border-2">
        <CardHeader className={`${getRoleColor()} text-white p-3`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              IA Assistant
              <Badge variant="secondary" className="text-xs">
                {getRoleIcon()}
                {user?.role}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 p-1"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-80 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Procesando...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Sugerencias rápidas */}
          {messages.length <= 1 && (
            <div className="p-3 border-t bg-gray-50">
              <div className="text-xs font-medium text-gray-600 mb-2">Sugerencias rápidas:</div>
              <div className="space-y-1">
                {getQuickSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs text-left w-full p-2 bg-white border rounded hover:bg-gray-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta algo..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className={getRoleColor()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
