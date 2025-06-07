
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, systemPrompt, context, userRole, conversationHistory } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Construir el contexto de la conversación
    const messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    // Agregar historial de conversación para contexto
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Agregar el mensaje actual
    messages.push({
      role: "user",
      content: message
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    // Determinar el tipo de respuesta basado en el contenido
    let responseType = 'help';
    if (assistantResponse.includes('KPI') || assistantResponse.includes('métrica') || assistantResponse.includes('rendimiento')) {
      responseType = 'analysis';
    } else if (assistantResponse.includes('configurar') || assistantResponse.includes('configuración')) {
      responseType = 'configuration';
    } else if (assistantResponse.includes('sugiero') || assistantResponse.includes('recomiendo')) {
      responseType = 'suggestion';
    }

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      type: responseType,
      role: userRole 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Lo siento, estoy experimentando dificultades técnicas. Por favor intenta nuevamente en unos momentos.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
