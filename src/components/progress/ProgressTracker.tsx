'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  Camera,
  Upload,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

interface ProgressMeasurement {
  timestamp: Date;
  cheekVolume: number;
  eyebrowHeight: number;
  jawlineDefinition: number;
  faceSymmetry: number;
  overallYouthfulness: number;
  photo?: string;
}

interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: Date;
  duration: number;
  averageScore: number;
  repetitions: number;
  caloriesBurned?: number;
  muscleActivation: Record<string, number>;
}

interface ProgressGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  completed: boolean;
  category: 'sessions' | 'score' | 'consistency' | 'improvement';
}

interface ScientificProgress {
  weeksElapsed: number;
  potentialImprovement: number;
  actualImprovement: number;
  studyReference: string;
  confidenceLevel: number;
  recommendations: string[];
}

interface ProgressTrackerProps {
  userId?: string;
  onPhotoCapture?: (photo: string) => void;
  onGoalUpdate?: (goalId: string, newValue: number) => void;
}

export default function ProgressTracker({ userId, onPhotoCapture, onGoalUpdate }: ProgressTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [measurements, setMeasurements] = useState<ProgressMeasurement[]>([]);
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [goals, setGoals] = useState<ProgressGoal[]>([]);
  const [scientificProgress, setScientificProgress] = useState<ScientificProgress | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    // Sample measurements over time
    const sampleMeasurements: ProgressMeasurement[] = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i -= 7) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      sampleMeasurements.push({
        timestamp: date,
        cheekVolume: 60 + Math.random() * 20 + (30 - i) * 0.3,
        eyebrowHeight: 55 + Math.random() * 15 + (30 - i) * 0.2,
        jawlineDefinition: 50 + Math.random() * 25 + (30 - i) * 0.4,
        faceSymmetry: 70 + Math.random() * 20 + (30 - i) * 0.1,
        overallYouthfulness: 65 + Math.random() * 15 + (30 - i) * 0.5,
      });
    }
    setMeasurements(sampleMeasurements);

    // Sample exercise sessions
    const sampleSessions: ExerciseSession[] = [];
    const exercises = [
      'Elevador de Mejillas',
      'Elevador de Cejas',
      'Esculpido Mejillas Felices',
      'Fortalecedor Mandíbula-Cuello'
    ];

    for (let i = 0; i < 25; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      sampleSessions.push({
        id: `session-${i}`,
        exerciseId: `exercise-${Math.floor(Math.random() * 4)}`,
        exerciseName: exercises[Math.floor(Math.random() * exercises.length)],
        date,
        duration: Math.floor(Math.random() * 10) + 5,
        averageScore: Math.floor(Math.random() * 30) + 70,
        repetitions: Math.floor(Math.random() * 15) + 5,
        caloriesBurned: Math.floor(Math.random() * 20) + 10,
        muscleActivation: {
          'Buccinator': Math.floor(Math.random() * 40) + 60,
          'Frontalis': Math.floor(Math.random() * 35) + 65,
          'Orbicularis': Math.floor(Math.random() * 30) + 70,
          'Platysma': Math.floor(Math.random() * 25) + 75
        }
      });
    }
    setSessions(sampleSessions.sort((a, b) => b.date.getTime() - a.date.getTime()));

    // Sample goals
    const sampleGoals: ProgressGoal[] = [
      {
        id: 'goal-1',
        title: 'Completar 30 sesiones',
        description: 'Realizar 30 sesiones de yoga facial este mes',
        targetValue: 30,
        currentValue: 25,
        unit: 'sesiones',
        deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        completed: false,
        category: 'sessions'
      },
      {
        id: 'goal-2',
        title: 'Mejorar técnica al 85%',
        description: 'Alcanzar un promedio del 85% en todos los ejercicios',
        targetValue: 85,
        currentValue: 78,
        unit: '%',
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        completed: false,
        category: 'score'
      },
      {
        id: 'goal-3',
        title: 'Práctica consistente',
        description: 'Ejercitarse 5 días a la semana durante 4 semanas',
        targetValue: 20,
        currentValue: 18,
        unit: 'días',
        deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        completed: false,
        category: 'consistency'
      }
    ];
    setGoals(sampleGoals);

    // Calculate scientific progress
    calculateScientificProgress(sampleMeasurements, sampleSessions);
  };

  const calculateScientificProgress = (measurements: ProgressMeasurement[], sessions: ExerciseSession[]) => {
    if (measurements.length < 2) return;

    const firstMeasurement = measurements[0];
    const lastMeasurement = measurements[measurements.length - 1];
    const weeksElapsed = Math.floor((lastMeasurement.timestamp.getTime() - firstMeasurement.timestamp.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // Based on Northwestern University study: 20 weeks = 2.7 years improvement
    const studyWeeks = 20;
    const studyImprovement = 2.7;
    const potentialImprovement = (weeksElapsed / studyWeeks) * studyImprovement;
    
    const overallImprovement = ((lastMeasurement.overallYouthfulness - firstMeasurement.overallYouthfulness) / 100) * potentialImprovement;
    const actualImprovement = Math.max(0, overallImprovement);
    
    const confidenceLevel = Math.min(95, 60 + (sessions.length * 2) + (weeksElapsed * 3));
    
    const recommendations = [];
    if (actualImprovement < potentialImprovement * 0.5) {
      recommendations.push('Aumenta la frecuencia de tus sesiones para mejores resultados');
    }
    if (sessions.length < weeksElapsed * 3) {
      recommendations.push('Intenta realizar al menos 3-4 sesiones por semana');
    }
    if (actualImprovement > potentialImprovement * 0.8) {
      recommendations.push('¡Excelente progreso! Continúa con tu rutina actual');
    }

    setScientificProgress({
      weeksElapsed,
      potentialImprovement,
      actualImprovement,
      studyReference: 'Northwestern University JAMA Dermatology 2018',
      confidenceLevel,
      recommendations
    });
  };

  const getPeriodData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const periodSessions = sessions.filter(session => session.date >= startDate);
    const periodMeasurements = measurements.filter(measurement => measurement.timestamp >= startDate);

    return { periodSessions, periodMeasurements, startDate };
  };

  const calculateStats = (periodSessions: ExerciseSession[], periodMeasurements: ProgressMeasurement[]) => {
    const totalSessions = periodSessions.length;
    const totalDuration = periodSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageScore = totalSessions > 0 ? periodSessions.reduce((sum, session) => sum + session.averageScore, 0) / totalSessions : 0;
    const totalRepetitions = periodSessions.reduce((sum, session) => sum + session.repetitions, 0);
    
    let improvement = 0;
    if (periodMeasurements.length >= 2) {
      const first = periodMeasurements[0];
      const last = periodMeasurements[periodMeasurements.length - 1];
      improvement = ((last.overallYouthfulness - first.overallYouthfulness) / first.overallYouthfulness) * 100;
    }

    return {
      totalSessions,
      totalDuration,
      averageScore,
      totalRepetitions,
      improvement
    };
  };

  const generateProgressReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would generate and download a PDF
    const reportData = {
      period: selectedPeriod,
      stats: calculateStats(getPeriodData().periodSessions, getPeriodData().periodMeasurements),
      scientificProgress,
      goals: goals.filter(goal => !goal.completed),
      generatedAt: new Date()
    };
    
    console.log('Generated report:', reportData);
    setIsGeneratingReport(false);
    
    // Show success message
    alert('¡Reporte generado exitosamente! En una aplicación real, esto descargaría un PDF detallado.');
  };

  const { periodSessions, periodMeasurements } = getPeriodData();
  const stats = calculateStats(periodSessions, periodMeasurements);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Seguimiento de Progreso
              </CardTitle>
              <CardDescription>
                Monitorea tu evolución y compara resultados científicamente
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateProgressReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </>
                )}
              </Button>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Camera className="w-4 h-4 mr-2" />
                Foto Progreso
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'week', label: 'Última Semana' },
              { value: 'month', label: 'Último Mes' },
              { value: 'quarter', label: 'Último Trimestre' },
              { value: 'year', label: 'Último Año' }
            ].map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value as any)}
                className={selectedPeriod === period.value ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">
              {stats.totalSessions}
            </div>
            <div className="text-sm text-gray-600">Sesiones</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(stats.averageScore)}%
            </div>
            <div className="text-sm text-gray-600">Score Promedio</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(stats.totalDuration)}
            </div>
            <div className="text-sm text-gray-600">Minutos Totales</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalRepetitions}
            </div>
            <div className="text-sm text-gray-600">Repeticiones</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.improvement >= 0 ? '+' : ''}{Math.round(stats.improvement)}%
            </div>
            <div className="text-sm text-gray-600">Mejora</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="scientific">Científico</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Evolución General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Juventud General</span>
                      <span className="text-sm text-gray-600">
                        {periodMeasurements.length > 0 ? Math.round(periodMeasurements[periodMeasurements.length - 1].overallYouthfulness) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={periodMeasurements.length > 0 ? periodMeasurements[periodMeasurements.length - 1].overallYouthfulness : 0} 
                      className="h-3" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Volumen de Mejillas</span>
                      <span className="text-sm text-gray-600">
                        {periodMeasurements.length > 0 ? Math.round(periodMeasurements[periodMeasurements.length - 1].cheekVolume) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={periodMeasurements.length > 0 ? periodMeasurements[periodMeasurements.length - 1].cheekVolume : 0} 
                      className="h-3" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Definición Mandibular</span>
                      <span className="text-sm text-gray-600">
                        {periodMeasurements.length > 0 ? Math.round(periodMeasurements[periodMeasurements.length - 1].jawlineDefinition) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={periodMeasurements.length > 0 ? periodMeasurements[periodMeasurements.length - 1].jawlineDefinition : 0} 
                      className="h-3" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Simetría Facial</span>
                      <span className="text-sm text-gray-600">
                        {periodMeasurements.length > 0 ? Math.round(periodMeasurements[periodMeasurements.length - 1].faceSymmetry) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={periodMeasurements.length > 0 ? periodMeasurements[periodMeasurements.length - 1].faceSymmetry : 0} 
                      className="h-3" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Sesiones Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {periodSessions.slice(0, 10).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{session.exerciseName}</div>
                          <div className="text-xs text-gray-600">
                            {session.date.toLocaleDateString()} • {session.duration} min
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.round(session.averageScore)}%</div>
                          <div className="text-xs text-gray-600">{session.repetitions} reps</div>
                        </div>
                      </div>
                    ))}
                    {periodSessions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay sesiones en este período</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scientific" className="mt-4">
          {scientificProgress ? (
            <div className="space-y-6">
              {/* Scientific Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="w-5 h-5" />
                    Análisis Científico del Progreso
                  </CardTitle>
                  <CardDescription>
                    Basado en el estudio Northwestern University JAMA Dermatology 2018
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {scientificProgress.weeksElapsed}
                      </div>
                      <div className="text-sm text-gray-600">Semanas de Práctica</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {scientificProgress.actualImprovement.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Años de Mejora Equivalente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {Math.round(scientificProgress.confidenceLevel)}%
                      </div>
                      <div className="text-sm text-gray-600">Nivel de Confianza</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Interpretación Científica:</h4>
                    <p className="text-blue-800 text-sm">
                      Según el estudio de referencia, 20 semanas de práctica constante pueden resultar en una apariencia 
                      de 2.7 años más joven. Tu progreso actual de {scientificProgress.actualImprovement.toFixed(1)} años 
                      de mejora equivalente representa un {(scientificProgress.actualImprovement / scientificProgress.potentialImprovement * 100).toFixed(1)}% 
                      del potencial esperado para tu tiempo de práctica.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {scientificProgress.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Recomendaciones Científicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scientificProgress.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-800">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Study Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Referencia del Estudio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Estudio:</h4>
                      <p className="text-sm text-gray-600">{scientificProgress.studyReference}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Participantes:</h4>
                      <p className="text-sm text-gray-600">16 mujeres entre 40-65 años</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Duración:</h4>
                      <p className="text-sm text-gray-600">20 semanas de ejercicios diarios</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Resultados:</h4>
                      <p className="text-sm text-gray-600">Mejora promedio de 2.7 años en apariencia facial, medida por dermatólogos independientes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No hay suficientes datos para el análisis científico</p>
                <p className="text-sm text-gray-400 mt-2">Continúa con tus ejercicios para ver el análisis basado en evidencia</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tus Metas</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Meta
              </Button>
            </div>

            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className={goal.completed ? 'border-green-500 bg-green-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      {goal.completed ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completada
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          En progreso
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        <span className="text-sm text-gray-600">
                          {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(goal.currentValue / goal.targetValue) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>Categoría: {goal.category}</span>
                      <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Historial Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-pink-100 text-pink-600">
                            {session.exerciseName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{session.exerciseName}</div>
                          <div className="text-sm text-gray-600">
                            {session.date.toLocaleDateString()} • {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{Math.round(session.averageScore)}%</div>
                        <div className="text-sm text-gray-600">{session.duration}min • {session.repetitions}reps</div>
                      </div>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No hay sesiones registradas</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Temporary import for the icon used in scientific section
  function Microscope(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 0 0-7-7" />
        <path d="M14 22a7 7 0 0 1 7-7" />
        <path d="M10 22h4" />
        <path d="M10 22v-3" />
        <path d="M14 22v-3" />
        <circle cx="12" cy="9" r="3" />
        <path d="M12 2v4" />
        <path d="M12 6l-2-2" />
        <path d="M12 6l2-2" />
      </svg>
    );
  }

  function Lightbulb(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    );
  }
}