'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Target, 
  Brain, 
  Award,
  ChevronRight,
  Filter,
  Search,
  CheckCircle
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  targetMuscles: string[];
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  duration: string;
  scientificEvidence: string;
  studyReference: string;
  benefits: string[];
  instructions: string[];
  videoUrl?: string;
  category: 'mejillas' | 'ojos' | 'frente' | 'boca' | 'cuello' | 'completo';
  cvValidation: {
    enabled: boolean;
    keyPoints: string[];
    feedbackTypes: string[];
  };
}

const exercises: Exercise[] = [
  {
    id: 'cheek_lifter',
    name: 'Elevador de Mejillas',
    description: 'Ejercicio fundamental para tonificar los músculos de las mejillas y mejorar el volumen facial',
    targetMuscles: ['Buccinator', 'Orbicularis oris', 'Zigomaticus'],
    difficulty: 'principiante',
    duration: '10 repeticiones × 20 segundos',
    scientificEvidence: 'Northwestern University: +15% volumen mejillas',
    studyReference: 'JAMA Dermatology 2018',
    benefits: [
      'Aumento de volumen en mejillas',
      'Mejora de la definición de pómulos',
      'Reducción de líneas de sonrisa',
      'Mejora circulación facial'
    ],
    instructions: [
      'Siéntate cómodamente con la espalda recta',
      'Forma una "O" con tus labios',
      'Dobla el labio superior hacia adentro',
      'Sonríe ampliamente manteniendo la posición',
      'Mantén por 20 segundos, relaja y repite'
    ],
    category: 'mejillas',
    cvValidation: {
      enabled: true,
      keyPoints: ['labios en forma O', 'elevación de mejillas', 'activación buccinator'],
      feedbackTypes: ['posición labios', 'elevación mejillas', 'tensión muscular']
    }
  },
  {
    id: 'eyebrow_lifter',
    name: 'Elevador de Cejas',
    description: 'Fortalece el músculo frontal y reduce líneas horizontales de la frente',
    targetMuscles: ['Frontalis', 'Corrugator supercilii', 'Orbicularis oculi'],
    difficulty: 'principiante',
    duration: '20 segundos × 3 repeticiones',
    scientificEvidence: 'PMC Study: -30% líneas horizontales frente',
    studyReference: 'Medicina Journal 2025',
    benefits: [
      'Reducción líneas frente',
      'Elevación de cejas',
      'Mejora expresión facial',
      'Fortalecimiento frontal'
    ],
    instructions: [
      'Coloca dedos índices bajo las cejas',
      'Aplica presión suave hacia abajo',
      'Eleva las cejas resistiendo con los dedos',
      'Mantén los ojos bien abiertos',
      'Sostén por 20 segundos, relaja y repite'
    ],
    category: 'frente',
    cvValidation: {
      enabled: true,
      keyPoints: ['posición dedos', 'elevación cejas', 'apertura ojos'],
      feedbackTypes: ['resistencia dedos', 'elevación frontal', 'activación muscular']
    }
  },
  {
    id: 'happy_cheeks_sculpting',
    name: 'Esculpido Mejillas Felices',
    description: 'Define los pómulos y mejora la simetría facial mediante sonrisa controlada',
    targetMuscles: ['Buccinator', 'Zigomaticus', 'Levator labii'],
    difficulty: 'intermedio',
    duration: '20 segundos × 3 repeticiones',
    scientificEvidence: 'Medicina Journal: +20% definición pómulos',
    studyReference: 'PMC Study 2025',
    benefits: [
      'Definición enhanced pómulos',
      'Mejora simetría facial',
      'Tono muscular general',
      'Expresión más juvenil'
    ],
    instructions: [
      'Sonríe con labios cerrados',
      'Coloca dedos en comisuras de la boca',
      'Desliza dedos hacia los pómulos',
      'Aplica presión suave hacia arriba',
      'Mantén la sonrisa y presión por 20 segundos'
    ],
    category: 'mejillas',
    cvValidation: {
      enabled: true,
      keyPoints: ['sonrisa labios cerrados', 'trayectoria dedos', 'elevación mejillas'],
      feedbackTypes: ['forma sonrisa', 'trayectoria correcta', 'tensión adecuada']
    }
  },
  {
    id: 'jaw_neck_firmer',
    name: 'Fortalecedor Mandíbula-Cuello',
    description: 'Tonifica el área del cuello y define la línea de la mandíbula',
    targetMuscles: ['Digastric', 'Platysma', 'Mylohyoid'],
    difficulty: 'intermedio',
    duration: '15 repeticiones',
    scientificEvidence: 'PMC Study: Mayor efecto en digastric muscle',
    studyReference: 'Medicina Journal 2025',
    benefits: [
      'Definición línea mandíbula',
      'Reducción papada',
      'Firmeza cuello',
      'Mejora perfil facial'
    ],
    instructions: [
      'Inclina ligeramente la cabeza hacia atrás',
      'Relaja la mandíbula completamente',
      'Presiona la lengua contra el paladar',
      'Realiza movimiento de cucharilla hacia arriba',
      'Sostén y repite suavemente'
    ],
    category: 'cuello',
    cvValidation: {
      enabled: true,
      keyPoints: ['posición cabeza', 'relajación mandíbula', 'movimiento cucharilla'],
      feedbackTypes: ['ángulo cabeza', 'activación lengua', 'tensión cuello']
    }
  },
  {
    id: 'eye_tightening',
    name: 'Tensado Ocular',
    description: 'Reduce patas de gallo y fortalece el área alrededor de los ojos',
    targetMuscles: ['Orbicularis oculi', 'Corrugator supercilii'],
    difficulty: 'principiante',
    duration: '10 repeticiones × 15 segundos',
    scientificEvidence: 'Estudio clínico: -25% patas de gallo',
    studyReference: 'Dermatology Research 2024',
    benefits: [
      'Reducción patas de gallo',
      'Firmeza párpados',
      'Mejora mirada',
      'Prevención arrugas oculares'
    ],
    instructions: [
      'Cierra los ojos suavemente',
      'Coloca dedos en las esquinas externas de los ojos',
      'Aplica presión suave hacia las sienes',
      'Intenta abrir los ojos resistiendo la presión',
      'Mantén por 15 segundos y relaja'
    ],
    category: 'ojos',
    cvValidation: {
      enabled: true,
      keyPoints: ['posición dedos', 'resistencia apertura', 'activación orbicular'],
      feedbackTypes: ['presión dedos', 'resistencia adecuada', 'activación correcta']
    }
  },
  {
    id: 'lip_perioral',
    name: 'Fortalecedor Perioral',
    description: 'Elimina líneas alrededor de la boca y fortalece labios',
    targetMuscles: ['Orbicularis oris', 'Depressor anguli oris'],
    difficulty: 'intermedio',
    duration: '12 repeticiones × 10 segundos',
    scientificEvidence: 'Clinical Study: +35% tonicidad labios',
    studyReference: 'Aesthetic Medicine Journal 2024',
    benefits: [
      'Reducción líneas periorales',
      'Definición labios',
      'Mejora sonrisa',
      'Prevención arrugas boca'
    ],
    instructions: [
      'Relaja completamente la boca',
      'Infla las mejillas con aire',
      'Traslada el aire de una mejilla a otra',
      'Mantén el aire en cada mejilla 10 segundos',
      'Expulsa el aire suavemente'
    ],
    category: 'boca',
    cvValidation: {
      enabled: true,
      keyPoints: ['inflación mejillas', 'movimiento aire', 'control orbicular'],
      feedbackTypes: ['presión aire adecuada', 'control muscular', 'movimiento fluido']
    }
  }
];

const difficultyColors = {
  principiante: 'bg-green-100 text-green-800',
  intermedio: 'bg-yellow-100 text-yellow-800',
  avanzado: 'bg-red-100 text-red-800'
};

const categoryIcons = {
  mejillas: '👄',
  ojos: '👁️',
  frente: '👃',
  boca: '💋',
  cuello: '🦴',
  completo: '😊'
};

const categoryNames = {
  mejillas: 'Mejillas',
  ojos: 'Ojos',
  frente: 'Frente',
  boca: 'Boca',
  cuello: 'Cuello',
  completo: 'Rostro Completo'
};

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['todas', ...Object.keys(categoryNames)];
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'todas' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const exercisesByCategory = Object.keys(categoryNames).reduce((acc, category) => {
    acc[category] = exercises.filter(ex => ex.category === category);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Biblioteca de Ejercicios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ejercicios científicamente validados con verificación por Computer Vision
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ejercicios, músculos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                {category === 'todas' ? 'Todas' : categoryNames[category as keyof typeof categoryNames]}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-pink-500"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryIcons[exercise.category]}</span>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Badge className={difficultyColors[exercise.difficulty]}>
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {exercise.duration}
                  </Badge>
                  {exercise.cvValidation.enabled && (
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      <Brain className="w-3 h-3 mr-1" />
                      CV
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Músculos objetivo:</h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.targetMuscles.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{exercise.targetMuscles.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-xs font-medium text-green-800">
                      <Award className="w-3 h-3 inline mr-1" />
                      {exercise.scientificEvidence}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exercise Detail Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedExercise.name}
                    </h2>
                    <div className="flex gap-2 mb-3">
                      <Badge className={difficultyColors[selectedExercise.difficulty]}>
                        {selectedExercise.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedExercise.duration}
                      </Badge>
                      {selectedExercise.cvValidation.enabled && (
                        <Badge variant="outline" className="border-blue-500 text-blue-700">
                          <Brain className="w-3 h-3 mr-1" />
                          Computer Vision
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExercise(null)}
                  >
                    ✕
                  </Button>
                </div>

                <p className="text-gray-600 mb-6">{selectedExercise.description}</p>

                <Tabs defaultValue="instructions" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
                    <TabsTrigger value="muscles">Músculos</TabsTrigger>
                    <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                    <TabsTrigger value="science">Ciencia</TabsTrigger>
                  </TabsList>

                  <TabsContent value="instructions" className="mt-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Instrucciones paso a paso:</h3>
                      <ol className="space-y-2">
                        {selectedExercise.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </TabsContent>

                  <TabsContent value="muscles" className="mt-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Músculos objetivo:</h3>
                      <div className="grid gap-2">
                        {selectedExercise.targetMuscles.map((muscle, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Target className="w-4 h-4 text-pink-600" />
                            <span className="text-gray-700">{muscle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="benefits" className="mt-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Beneficios comprobados:</h3>
                      <ul className="space-y-2">
                        {selectedExercise.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="science" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Evidencia Científica:</h3>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-green-800 font-medium">
                            {selectedExercise.scientificEvidence}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Referencia del estudio:</h4>
                        <p className="text-gray-600">{selectedExercise.studyReference}</p>
                      </div>
                      {selectedExercise.cvValidation.enabled && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Validación por Computer Vision:</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Puntos clave monitoreados:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedExercise.cvValidation.keyPoints.map((point, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {point}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Tipos de feedback:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedExercise.cvValidation.feedbackTypes.map((feedback, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feedback}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 flex gap-3">
                  <Button className="bg-pink-600 hover:bg-pink-700 flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Ejercicio
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedExercise(null)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}