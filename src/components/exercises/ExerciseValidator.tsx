'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FacialTrackingCamera from '@/components/camera/FacialTrackingCamera';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Target,
  Clock,
  Trophy,
  TrendingUp,
  Brain,
  Lightbulb,
  Timer
} from 'lucide-react';

interface ValidationResult {
  score: number;
  feedback: string;
  corrections: string[];
  isCorrect: boolean;
  confidence: number;
  muscleActivation: Record<string, number>;
  formIssues: string[];
  improvements: string[];
}

interface ExerciseSession {
  exerciseId: string;
  startTime: Date;
  endTime?: Date;
  repetitions: number;
  averageScore: number;
  bestScore: number;
  validationResults: ValidationResult[];
  isCompleted: boolean;
}

interface ExerciseValidatorProps {
  exercise: {
    id: string;
    name: string;
    description: string;
    targetMuscles: string[];
    difficulty: 'principiante' | 'intermedio' | 'avanzado';
    duration: string;
    instructions: string[];
    cvValidation: {
      enabled: boolean;
      keyPoints: string[];
      feedbackTypes: string[];
    };
  };
  onComplete?: (session: ExerciseSession) => void;
}

export default function ExerciseValidator({ exercise, onComplete }: ExerciseValidatorProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRep, setCurrentRep] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [session, setSession] = useState<ExerciseSession | null>(null);
  const [currentValidation, setCurrentValidation] = useState<ValidationResult | null>(null);
  const [realTimeFeedback, setRealTimeFeedback] = useState<string>('');
  const [exercisePhase, setExercisePhase] = useState<'ready' | 'starting' | 'active' | 'rest' | 'completed'>('ready');

  // Initialize exercise session
  const initializeSession = () => {
    const newSession: ExerciseSession = {
      exerciseId: exercise.id,
      startTime: new Date(),
      repetitions: 0,
      averageScore: 0,
      bestScore: 0,
      validationResults: [],
      isCompleted: false
    };
    setSession(newSession);
    setCurrentRep(0);
    setTimeLeft(parseDuration(exercise.duration));
    setExercisePhase('starting');
  };

  const parseDuration = (duration: string): number => {
    // Parse duration like "10 repeticiones × 20 segundos" or "20 segundos × 3 repeticiones"
    const match = duration.match(/(\d+)\s*(?:repeticiones?|segundos?)/g);
    if (match && match.length >= 2) {
      const numbers = match.map(m => parseInt(m));
      return numbers[0] * numbers[1]; // Total seconds
    }
    return 60; // Default 60 seconds
  };

  const startExercise = () => {
    initializeSession();
    setIsActive(true);
    setIsPaused(false);
    setExercisePhase('active');
  };

  const pauseExercise = () => {
    setIsPaused(!isPaused);
  };

  const resetExercise = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentRep(0);
    setTimeLeft(parseDuration(exercise.duration));
    setSession(null);
    setCurrentValidation(null);
    setRealTimeFeedback('');
    setExercisePhase('ready');
  };

  const completeExercise = () => {
    if (session) {
      const completedSession: ExerciseSession = {
        ...session,
        endTime: new Date(),
        isCompleted: true,
        averageScore: session.validationResults.length > 0 
          ? session.validationResults.reduce((sum, r) => sum + r.score, 0) / session.validationResults.length
          : 0,
        bestScore: session.validationResults.length > 0
          ? Math.max(...session.validationResults.map(r => r.score))
          : 0
      };
      
      setSession(completedSession);
      setExercisePhase('completed');
      setIsActive(false);
      
      if (onComplete) {
        onComplete(completedSession);
      }
    }
  };

  // Handle tracking results from camera
  const handleTrackingResult = (result: any) => {
    if (!isActive || isPaused || !session) return;

    // Simulate exercise-specific validation
    const validation: ValidationResult = validateExerciseTechnique(result, exercise.id);
    setCurrentValidation(validation);
    setRealTimeFeedback(validation.feedback);

    // Update session with new validation result
    const updatedSession = {
      ...session,
      validationResults: [...session.validationResults, validation],
      repetitions: session.repetitions + (validation.isCorrect ? 1 : 0)
    };
    setSession(updatedSession);

    // Check if exercise should be completed
    if (validation.isCorrect && updatedSession.repetitions >= targetReps) {
      setTimeout(completeExercise, 1000);
    }
  };

  const validateExerciseTechnique = (trackingResult: any, exerciseId: string): ValidationResult => {
    // Simulate validation based on exercise type
    const baseScore = trackingResult.exerciseScore || Math.random() * 40 + 60;
    const confidence = trackingResult.confidence || 0.8;

    let feedback = '';
    let corrections: string[] = [];
    let muscleActivation: Record<string, number> = {};
    let formIssues: string[] = [];
    let improvements: string[] = [];

    switch (exerciseId) {
      case 'cheek_lifter':
        muscleActivation = {
          'Buccinator': Math.random() * 40 + 60,
          'Orbicularis oris': Math.random() * 30 + 70,
          'Zigomaticus': Math.random() * 35 + 65
        };
        
        if (baseScore > 85) {
          feedback = 'Excelente técnica! Tus mejillas están perfectamente elevadas.';
          improvements = ['Mantén esta posición', 'Concentra la tensión en las mejillas'];
        } else if (baseScore > 70) {
          feedback = 'Buena técnica. Intenta elevar un poco más las mejillas.';
          corrections = ['Aumenta la elevación de mejillas', 'Mantén la forma de O con los labios'];
          improvements = ['Presiona más con los músculos'];
        } else {
          feedback = 'Ajusta tu técnica. Enfócate en la forma de tus labios.';
          corrections = [
            'Forma una O más definida con los labios',
            'Dobla mejor el labio superior',
            'Eleva las mejillas con más fuerza'
          ];
          formIssues = ['Posición labios incorrecta', 'Insuficiente elevación mejillas'];
        }
        break;

      case 'eyebrow_lifter':
        muscleActivation = {
          'Frontalis': Math.random() * 45 + 55,
          'Corrugator supercilii': Math.random() * 30 + 60,
          'Orbicularis oculi': Math.random() * 25 + 65
        };
        
        if (baseScore > 85) {
          feedback = 'Perfecto! Máxima activación del músculo frontal.';
          improvements = ['Mantén la resistencia', 'Controla la presión'];
        } else if (baseScore > 70) {
          feedback = 'Buena resistencia. Aplica un poco más de presión.';
          corrections = ['Aumenta presión con los dedos', 'Mantén los ojos bien abiertos'];
        } else {
          feedback = 'Necesitas aplicar más resistencia con los dedos.';
          corrections = [
            'Presiona más firmemente con los dedos',
            'Eleva las cejas con más fuerza',
            'Mantén los ojos completamente abiertos'
          ];
          formIssues = ['Presión insuficiente', 'Falta de elevación frontal'];
        }
        break;

      default:
        muscleActivation = {
          'General': baseScore
        };
        feedback = baseScore > 75 ? 'Buena técnica. Continúa así.' : 'Ajusta tu posición y postura.';
    }

    return {
      score: baseScore,
      feedback,
      corrections,
      isCorrect: baseScore > 75,
      confidence,
      muscleActivation,
      formIssues,
      improvements
    };
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeLeft > 0 && exercisePhase === 'active') {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isActive, isPaused, timeLeft, exercisePhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 85) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Regular';
    return 'Necesita mejorar';
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{exercise.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {exercise.description}
              </CardDescription>
              <div className="flex gap-2 mt-3">
                <Badge variant={exercise.difficulty === 'principiante' ? 'default' : 'secondary'}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.duration}
                </Badge>
                <Badge variant="outline">
                  <Target className="w-3 h-3 mr-1" />
                  {targetReps} repeticiones
                </Badge>
              </div>
            </div>
            
            {exercisePhase === 'completed' && session && (
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(session.averageScore)}%
                </div>
                <div className="text-sm text-gray-600">Puntuación Final</div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Controls */}
      {exercisePhase !== 'completed' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {exercisePhase === 'ready' && (
                  <Button
                    onClick={startExercise}
                    className="bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Ejercicio
                  </Button>
                )}
                
                {exercisePhase === 'active' && (
                  <>
                    <Button
                      onClick={pauseExercise}
                      variant={isPaused ? "default" : "outline"}
                      size="lg"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Reanudar
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={resetExercise}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reiniciar
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {session?.repetitions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Repeticiones</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">Tiempo Restante</div>
                </div>
                
                {currentValidation && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(currentValidation.score)}`}>
                      {Math.round(currentValidation.score)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {getScoreMessage(currentValidation.score)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera and Tracking */}
        <div>
          <FacialTrackingCamera
            exerciseId={exercise.id}
            onTrackingResult={handleTrackingResult}
            isActive={isActive && !isPaused}
            width={480}
            height={360}
          />

          {/* Real-time Feedback */}
          {realTimeFeedback && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-pink-600" />
                  <span className="font-medium">Feedback en Tiempo Real</span>
                </div>
                <Alert className={currentValidation?.isCorrect ? "border-green-500" : "border-yellow-500"}>
                  <AlertDescription className={currentValidation?.isCorrect ? "text-green-800" : "text-yellow-800"}>
                    {realTimeFeedback}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Exercise Details and Validation */}
        <div>
          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
              <TabsTrigger value="validation">Validación</TabsTrigger>
              <TabsTrigger value="progress">Progreso</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Instrucciones Paso a Paso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Puntos Clave:</h4>
                    <ul className="space-y-1">
                      {exercise.cvValidation.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-blue-800">
                          <Target className="w-3 h-3" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Análisis de Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentValidation ? (
                    <div className="space-y-4">
                      {/* Overall Score */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Puntuación General:</span>
                          <span className={`font-bold ${getScoreColor(currentValidation.score)}`}>
                            {Math.round(currentValidation.score)}% - {getScoreMessage(currentValidation.score)}
                          </span>
                        </div>
                        <Progress value={currentValidation.score} className="h-3" />
                      </div>

                      {/* Muscle Activation */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Activación Muscular:</h4>
                        <div className="space-y-2">
                          {Object.entries(currentValidation.muscleActivation).map(([muscle, activation]) => (
                            <div key={muscle}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{muscle}</span>
                                <span className="text-sm font-medium">{Math.round(activation)}%</span>
                              </div>
                              <Progress value={activation} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Corrections */}
                      {currentValidation.corrections.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Correcciones:</h4>
                          <ul className="space-y-1">
                            {currentValidation.corrections.map((correction, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {correction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {currentValidation.improvements.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sugerencias:</h4>
                          <ul className="space-y-1">
                            {currentValidation.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Comienza el ejercicio para ver el análisis de técnica</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progreso del Ejercicio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {session && session.validationResults.length > 0 ? (
                    <div className="space-y-4">
                      {/* Session Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-pink-600">
                            {session.repetitions}
                          </div>
                          <div className="text-sm text-gray-600">Repeticiones Válidas</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">
                            {Math.round(session.averageScore)}%
                          </div>
                          <div className="text-sm text-gray-600">Puntuación Promedio</div>
                        </div>
                      </div>

                      {/* Recent Validations */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Validaciones Recientes:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {session.validationResults.slice(-5).map((validation, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                {validation.isCorrect ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm">Validación {session.validationResults.length - 4 + index}</span>
                              </div>
                              <span className={`text-sm font-medium ${getScoreColor(validation.score)}`}>
                                {Math.round(validation.score)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Comienza el ejercicio para ver tu progreso</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Completion Summary */}
      {exercisePhase === 'completed' && session && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Trophy className="w-5 h-5" />
              ¡Ejercicio Completado!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {session.repetitions}
                </div>
                <div className="text-sm text-gray-600">Repeticiones Válidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(session.averageScore)}%
                </div>
                <div className="text-sm text-gray-600">Puntuación Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(session.bestScore)}%
                </div>
                <div className="text-sm text-gray-600">Mejor Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {session.validationResults.length}
                </div>
                <div className="text-sm text-gray-600">Validaciones</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={resetExercise}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Repetir Ejercicio
              </Button>
              <Button variant="outline">
                Siguiente Ejercicio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}