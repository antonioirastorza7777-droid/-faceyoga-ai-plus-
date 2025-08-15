'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Brain,
  Heart,
  Microscope,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  Star
} from 'lucide-react';

interface CoachMessage {
  id: string;
  coachId: string;
  content: string;
  timestamp: Date;
  type: 'coach' | 'user';
  context?: {
    exerciseScore?: number;
    musclesWorked?: string[];
    improvement?: number;
    sessionsCompleted?: number;
  };
}

interface AICoach {
  id: string;
  name: string;
  specialty: string;
  personality: string;
  description: string;
  icon: JSX.Element;
  color: string;
  expertise: string[];
  availability: 'online' | 'offline' | 'fallback';
}

interface AICoachSystemProps {
  exerciseData?: {
    currentExercise?: string;
    techniqueScore?: number;
    musclesWorked?: string[];
    sessionsCompleted?: number;
    improvement?: number;
  };
  onCoachResponse?: (coachId: string, response: string) => void;
}

const COACHES: AICoach[] = [
  {
    id: 'sophia',
    name: 'Sophia',
    specialty: 'Experta Técnica',
    personality: 'Precisa, técnica, motivadora pero exigente',
    description: 'Especialista en biomecánica facial y técnica perfecta',
    icon: <Brain className="w-5 h-5" />,
    color: 'text-blue-600',
    expertise: ['Biomecánica facial', 'Técnica perfecta', 'Corrección postural', 'Análisis muscular'],
    availability: 'online'
  },
  {
    id: 'elena',
    name: 'Elena',
    specialty: 'Coach Motivacional',
    personality: 'Motivadora, celebra progreso, enfoque resultados',
    description: 'Experta en motivación y seguimiento de resultados anti-aging',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-pink-600',
    expertise: ['Motivación personal', 'Seguimiento resultados', 'Celebración logros', 'Bienestar emocional'],
    availability: 'online'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    specialty: 'Científico Especialista',
    personality: 'Científico, educativo, basado en evidencia',
    description: 'Investigador especializado en estudios científicos de yoga facial',
    icon: <Microscope className="w-5 h-5" />,
    color: 'text-green-600',
    expertise: ['Investigación científica', 'Estudios clínicos', 'Análisis de datos', 'Evidencia médica'],
    availability: 'online'
  }
];

const FALLBACK_RESPONSES = {
  sophia: {
    technique_correction: [
      "Veo que tu técnica necesita ajuste en la posición de los labios. Intenta formar una 'O' más definida y elevar las mejillas con más fuerza.",
      "Tu score actual es {score}/100. Para mejorar: concentra la tensión en los músculos buccinator y mantén la resistencia.",
      "Buen intento, pero los músculos de las mejillas necesitan más activación. Presiona más fuerte y mantén la posición por más tiempo."
    ],
    encouragement: [
      "¡Excelente progreso! Tu técnica ha mejorado significativamente. Sigue concentrándote en la forma precisa.",
      "Perfecto, estás activando correctamente los músculos objetivo. La tensión es adecuada y la postura es correcta.",
      "Mantén esa posición, tu ejercicio está técnicamente correcto. La activación muscular es óptima."
    ]
  },
  elena: {
    motivation: [
      "¡Increíble! Has completado {sessions} sesiones y tu mejora es visible. Tu dedicación está dando resultados maravillosos.",
      "Tu constancia está dando frutos. Los músculos de tu rostro se ven más tonificados y tu expresión más rejuvenecida.",
      "Continúa así, estás en camino a lucir {improvement} años más joven. Cada ejercicio te acerca a tu objetivo."
    ],
    progress_celebration: [
      "¡Felicidades! Tu progreso en el ejercicio actual ha sido excepcional. Tu técnica ha mejorado notablemente.",
      "Me encanta ver cómo tus mejillas mejoran cada día. La definición es más evidente y la tonicidad aumenta.",
      "Tu constancia está pagando, los resultados son evidentes. Sigue así, el futuro de tu piel es brillante."
    ]
  },
  marcus: {
    scientific_explanation: [
      "Científicamente, el ejercicio de elevación de mejillas activa el músculo buccinator mejorando el volumen facial en un 15% según Northwestern University.",
      "Según el estudio de JAMA Dermatology, deberías ver mejoras significativas en 20 semanas con práctica constante.",
      "Tu activación muscular de {activation}% está dentro del rango óptimo para producir hipertrofia y mejora de tonicidad."
    ],
    evidence_based: [
      "La evidencia muestra que el yoga facial produce mejoras mensurables en la elasticidad cutánea y volumen muscular.",
      "Tu progreso actual coincide con los datos del estudio de Medicina Journal 2025 sobre tonificación facial.",
      "Los músculos faciales muestran {measurement_data}, que es excelente según los parámetros científicos establecidos."
    ]
  }
};

export default function AICoachSystem({ exerciseData, onCoachResponse }: AICoachSystemProps) {
  const [selectedCoach, setSelectedCoach] = useState<AICoach>(COACHES[0]);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: CoachMessage = {
      id: '1',
      coachId: selectedCoach.id,
      content: getWelcomeMessage(selectedCoach.id),
      timestamp: new Date(),
      type: 'coach'
    };
    setMessages([welcomeMessage]);
    
    // Check AI availability (simulate)
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    // Simulate checking AI availability
    setIsAILoading(true);
    setTimeout(() => {
      // For demo purposes, randomly set AI availability
      setAiAvailable(Math.random() > 0.3); // 70% chance AI is available
      setIsAILoading(false);
    }, 2000);
  };

  const getWelcomeMessage = (coachId: string): string => {
    const welcomes = {
      sophia: "¡Hola! Soy Sophia, tu experta en técnica facial. Estoy aquí para ayudarte a perfeccionar cada movimiento y asegurar que obtengas los máximos resultados de cada ejercicio.",
      elena: "¡Bienvenida! Soy Elena, tu coach motivacional. Juntas vamos a celebrar cada logro y mantener esa motivación que te llevará a transformar tu rutina de cuidado facial.",
      marcus: "Hola, soy Marcus. Como científico especialista en yoga facial, estoy aquí para explicarte la evidencia detrás de cada ejercicio y cómo tu cuerpo responde a la práctica."
    };
    return welcomes[coachId as keyof typeof welcomes] || "¡Hola! Estoy aquí para ayudarte con tu práctica de yoga facial.";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateCoachResponse = async (coachId: string, userMessage: string, context: any): Promise<string> => {
    // Try to use AI first if available
    if (aiAvailable) {
      try {
        // Simulate AI response generation
        await new Promise(resolve => setTimeout(resolve, 1500));
        return generateAIResponse(coachId, userMessage, context);
      } catch (error) {
        console.log('AI not available, using fallback');
        return generateFallbackResponse(coachId, userMessage, context);
      }
    } else {
      return generateFallbackResponse(coachId, userMessage, context);
    }
  };

  const generateAIResponse = (coachId: string, userMessage: string, context: any): string => {
    // Simulate AI-generated response based on coach personality and context
    const prompts = {
      sophia: `Eres Sophia, experta técnica en yoga facial.
DATOS TÉCNICOS ACTUALES:
- Score técnica: ${context.techniqueScore || 75}/100
- Ejercicio: ${context.currentExercise || 'general'}
- Músculos trabajados: ${(context.musclesWorked || []).join(', ')}
PERSONALIDAD: Técnica, precisa, motivadora pero exigente
RESPUESTA: Máximo 150 palabras en español
INCLUYE: Corrección específica basada en datos técnicos
Usuario dice: "${userMessage}"
Responde como experta técnica:`,

      elena: `Eres Elena, coach motivacional anti-aging natural.
DATOS PROGRESO:
- Sesiones completadas: ${context.sessionsCompleted || 0}
- Mejora detectada: ${context.improvement || 0}%
- Músculos trabajados: ${(context.musclesWorked || []).join(', ')}
PERSONALIDAD: Motivadora, celebra progreso, enfoque resultados
RESPUESTA: Máximo 150 palabras en español
INCLUYE: Motivación específica basada en progreso real
Usuario dice: "${userMessage}"
Responde motivando con datos concretos:`,

      marcus: `Eres Marcus, científico especialista yoga facial.
DATOS CIENTÍFICOS:
- Músculos activados: ${(context.musclesWorked || []).join(', ')}
- Efectividad ejercicio: ${context.techniqueScore || 75}%
- Estudio referencia: Northwestern University 2018
PERSONALIDAD: Científico, educativo, basado en evidencia
RESPUESTA: Máximo 180 palabras en español
INCLUYE: Explicación científica con estudios reales
Usuario dice: "${userMessage}"
Explica científicamente:`
    };

    // Simulate AI response generation
    const aiResponses = {
      sophia: [
        "Basado en tu técnica actual de ${context.techniqueScore || 75}%, veo que puedes mejorar la activación del músculo buccinator. Concéntrate en mantener la resistencia por 20 segundos y asegúrate de que tus labios mantengan la forma de 'O' perfecta.",
        "Tu técnica muestra buena activación en ${(context.musclesWorked || []).join(', ')}. Para optimizar los resultados, te recomiendo aumentar la tensión gradualmente y mantener cada repetición por el tiempo completo.",
        "He analizado tu forma y puedo sugerirte ajustes específicos. Concentra la energía en las mejillas y mantén una postura erguida para maximizar la efectividad del ejercicio."
      ],
      elena: [
        `¡Fantástico! Llevas ${context.sessionsCompleted || 0} sesiones y tu mejora del ${context.improvement || 0}% es inspiradora. Cada ejercicio te acerca más a tus objetivos de rejuvenecimiento facial.`,
        "Tu dedicación es admirable. Veo que estás trabajando consistentemente los músculos faciales y los resultados comenzarán a ser evidentes muy pronto. ¡Sigue así!",
        "Celebro tu compromiso con el cuidado facial. Cada repetición cuenta y estás construyendo una rutina que transformará tu apariencia y tu confianza."
      ],
      marcus: [
        "Científicamente, los ejercicios de yoga facial activan los 57 músculos faciales. Según el estudio Northwestern University 2018, 20 semanas de práctica constante pueden resultar en una apariencia 2.7 años más joven.",
        "La evidencia muestra que ${(context.musclesWorked || []).join(', ')} son los músculos clave para la tonificación facial. Tu técnica actual del ${context.techniqueScore || 75}% está dentro del rango óptimo para producir adaptaciones musculares.",
        "Basado en la investigación actual, el ejercicio que practicas estimula la producción de colágeno y mejora la circulación sanguínea facial. Los estudios muestran mejoras significativas en la elasticidad cutánea con práctica constante."
      ]
    };

    const responses = aiResponses[coachId as keyof typeof aiResponses] || [];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateFallbackResponse = (coachId: string, userMessage: string, context: any): string => {
    const fallbacks = FALLBACK_RESPONSES[coachId as keyof typeof FALLBACK_RESPONSES];
    if (!fallbacks) return "Estoy aquí para ayudarte con tu práctica de yoga facial.";

    // Analyze user intent and select appropriate response category
    const userMessageLower = userMessage.toLowerCase();
    let category: keyof typeof fallbacks;
    
    if (userMessageLower.includes('técnica') || userMessageLower.includes('correcto') || userMessageLower.includes('hacer')) {
      category = 'technique_correction';
    } else if (userMessageLower.includes('motivación') || userMessageLower.includes('progreso') || userMessageLower.includes('resultado')) {
      category = 'motivation' in fallbacks ? 'motivation' : 'progress_celebration';
    } else if (userMessageLower.includes('ciencia') || userMessageLower.includes('estudio') || userMessageLower.includes('evidencia')) {
      category = 'scientific_explanation' in fallbacks ? 'scientific_explanation' : 'evidence_based';
    } else {
      // Default to first available category
      category = Object.keys(fallbacks)[0] as keyof typeof fallbacks;
    }

    const responses = fallbacks[category] || fallbacks[Object.keys(fallbacks)[0] as keyof typeof fallbacks];
    let response = responses[Math.floor(Math.random() * responses.length)];

    // Replace placeholders with actual data
    response = response.replace('{score}', (context.techniqueScore || 75).toString());
    response = response.replace('{sessions}', (context.sessionsCompleted || 0).toString());
    response = response.replace('{improvement}', (context.improvement || 0).toString());
    response = response.replace('{activation}', (context.techniqueScore || 75).toString());
    response = response.replace('{measurement_data}', 'datos excelentes');

    return response;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      coachId: selectedCoach.id,
      content: inputMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = {
        currentExercise: exerciseData?.currentExercise,
        techniqueScore: exerciseData?.techniqueScore,
        musclesWorked: exerciseData?.musclesWorked,
        sessionsCompleted: exerciseData?.sessionsCompleted,
        improvement: exerciseData?.improvement
      };

      const response = await generateCoachResponse(selectedCoach.id, inputMessage, context);

      const coachMessage: CoachMessage = {
        id: (Date.now() + 1).toString(),
        coachId: selectedCoach.id,
        content: response,
        timestamp: new Date(),
        type: 'coach',
        context
      };

      setMessages(prev => [...prev, coachMessage]);

      if (onCoachResponse) {
        onCoachResponse(selectedCoach.id, response);
      }
    } catch (error) {
      console.error('Error generating coach response:', error);
      
      const errorMessage: CoachMessage = {
        id: (Date.now() + 1).toString(),
        coachId: selectedCoach.id,
        content: "Lo siento, estoy teniendo dificultades para responder en este momento. Por favor, intenta de nuevo en un momento.",
        timestamp: new Date(),
        type: 'coach'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCoachAvailabilityStatus = (coach: AICoach) => {
    switch (coach.availability) {
      case 'online':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponible
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            No disponible
          </Badge>
        );
      case 'fallback':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <Brain className="w-3 h-3 mr-1" />
            Modo básico
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Coach Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Entrenadores IA de FaceYoga
          </CardTitle>
          <CardDescription>
            Elige tu coach especialista para recibir orientación personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {COACHES.map((coach) => (
              <div
                key={coach.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCoach.id === coach.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCoach(coach)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-${coach.color.split('-')[1]}-100`}>
                    {coach.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{coach.name}</h3>
                    <p className="text-sm text-gray-600">{coach.specialty}</p>
                  </div>
                  {getCoachAvailabilityStatus(coach)}
                </div>
                <p className="text-sm text-gray-700 mb-3">{coach.description}</p>
                <div className="flex flex-wrap gap-1">
                  {coach.expertise.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {coach.expertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{coach.expertise.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Status */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Estado del Sistema IA
                </span>
              </div>
              {isAILoading ? (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1 animate-spin" />
                  Verificando...
                </Badge>
              ) : aiAvailable ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  IA Avanzada Activa
                </Badge>
              ) : (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Modo Básico Activo
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className={selectedCoach.color.replace('text-', 'bg-')}>
                {selectedCoach.name[0]}
              </AvatarFallback>
            </Avatar>
            Conversación con {selectedCoach.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-96">
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'coach' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={selectedCoach.color.replace('text-', 'bg-')}>
                          {selectedCoach.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-pink-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-500">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={selectedCoach.color.replace('text-', 'bg-')}>
                        {selectedCoach.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm">Escribiendo...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Pregúnta a ${selectedCoach.name} sobre tu técnica, progreso o cualquier duda...`}
                className="flex-1 resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-pink-600 hover:bg-pink-700 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preguntas Sugeridas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Cómo puedo mejorar mi técnica en el ejercicio actual?")}
              className="text-left justify-start"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Mejorar técnica
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Qué tan bien estoy progresando?")}
              className="text-left justify-start"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Mi progreso
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Cuál es la evidencia científica detrás de estos ejercicios?")}
              className="text-left justify-start"
            >
              <Microscope className="w-4 h-4 mr-2" />
              Evidencia científica
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Cuándo empezaré a ver resultados?")}
              className="text-left justify-start"
            >
              <Clock className="w-4 h-4 mr-2" />
              Resultados
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Qué músculos estoy trabajando exactamente?")}
              className="text-left justify-start"
            >
              <Brain className="w-4 h-4 mr-2" />
              Músculos trabajados
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("¿Necesitas motivación para continuar?")}
              className="text-left justify-start"
            >
              <Heart className="w-4 h-4 mr-2" />
              Motivación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}