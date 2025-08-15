'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Brain, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Award,
  Target,
  Heart,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: Camera,
      title: 'Computer Vision en Tiempo Real',
      description: 'MediaPipe Face Mesh con 468 puntos de tracking facial submilimétrico',
      benefits: ['Validación automática de técnica', 'Feedback inmediato', 'Score de precisión 0-100%']
    },
    {
      icon: Brain,
      title: 'Coaches IA Locales',
      description: 'Ollama local con sistema fallback inteligente sin APIs pagas',
      benefits: ['3 especialistas expertos', 'Conversaciones personalizadas', 'Análisis contextual en tiempo real']
    },
    {
      icon: BarChart3,
      title: 'Progreso Científico',
      description: 'Medición objetiva basada en estudios Northwestern University',
      benefits: ['Comparación antes/después', 'Equivalencia años de mejora', 'Informes exportables PDF']
    },
    {
      icon: Users,
      title: 'Personalización IA',
      description: 'TensorFlow.js para análisis facial completo en navegador',
      benefits: ['Detección de edad y forma facial', 'Ejercicios personalizados', 'Rutinas adaptativas']
    }
  ];

  const scientificEvidence = [
    {
      study: 'Northwestern University 2018',
      journal: 'JAMA Dermatology',
      participants: '16 mujeres 40-65 años',
      duration: '20 semanas',
      results: 'Apariencia 2.7 años más joven promedio',
      icon: Award
    },
    {
      study: 'Medicina Journal 2025',
      journal: 'PMC',
      participants: '12 mujeres edad promedio 49.75 años',
      duration: '8 semanas',
      results: 'Aumento elasticidad TODOS músculos faciales',
      icon: Target
    }
  ];

  const exercises = [
    {
      name: 'Elevador de Mejillas',
      muscles: ['Buccinator', 'Orbicularis oris', 'Zigomaticus'],
      difficulty: 'Principiante',
      duration: '10 repeticiones × 20 segundos',
      evidence: 'Northwestern University: +15% volumen mejillas'
    },
    {
      name: 'Elevador de Cejas',
      muscles: ['Frontalis', 'Corrugator supercilii', 'Orbicularis oculi'],
      difficulty: 'Principiante',
      duration: '20 segundos × 3 repeticiones',
      evidence: 'PMC Study: -30% líneas horizontales frente'
    },
    {
      name: 'Esculpido Mejillas Felices',
      muscles: ['Buccinator', 'Zigomaticus', 'Levator labii'],
      difficulty: 'Intermedio',
      duration: '20 segundos × 3 repeticiones',
      evidence: 'Medicina Journal: +20% definición pómulos'
    }
  ];

  const techStack = [
    { name: 'MediaPipe Face Mesh', type: 'Computer Vision', cost: 'Gratis' },
    { name: 'Ollama Local', type: 'IA Local', cost: 'Gratis' },
    { name: 'TensorFlow.js', type: 'Machine Learning', cost: 'Gratis' },
    { name: 'Web APIs', type: 'Navegador', cost: 'Gratis' },
    { name: 'Next.js + PWA', type: 'Framework', cost: 'Gratis' },
    { name: 'Netlify Hosting', type: 'Deployment', cost: 'Gratis' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolucionario - 100% Tecnologías Gratuitas
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              FaceYoga AI+
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              La PRIMERA aplicación de yoga facial con verificación IA tiempo real usando 
              <span className="font-semibold text-pink-600"> EXCLUSIVAMENTE </span>
              tecnologías actuales 100% gratuitas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Comenzar Gratis
              </Button>
              <Button size="lg" variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sin Suscripciones Engañosas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Científicamente Validado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12">
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="science">Evidencia Científica</TabsTrigger>
            <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
            <TabsTrigger value="technology">Tecnología</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Características Revolucionarias
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tecnología de punta que diferencia FaceYoga AI+ de cualquier otra aplicación
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <feature.icon className="w-8 h-8 text-pink-600" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="science" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Evidencia Científica Validada
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Basado en estudios clínicos rigurosos de instituciones reconocidas
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {scientificEvidence.map((study, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <study.icon className="w-8 h-8 text-purple-600" />
                      <div>
                        <CardTitle className="text-xl">{study.study}</CardTitle>
                        <CardDescription className="text-sm">{study.journal}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Participantes:</span>
                        <span className="text-sm font-medium">{study.participants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duración:</span>
                        <span className="text-sm font-medium">{study.duration}</span>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          {study.results}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ejercicios Científicamente Validados
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ejercicios específicos con validación por Computer Vision
              </p>
            </div>
            <div className="grid gap-6">
              {exercises.map((exercise, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{exercise.name}</CardTitle>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="secondary">{exercise.difficulty}</Badge>
                          <Badge variant="outline">{exercise.duration}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Músculos objetivo:</h4>
                        <div className="flex flex-wrap gap-2">
                          {exercise.muscles.map((muscle, muscleIndex) => (
                            <Badge key={muscleIndex} variant="outline" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">
                          <Target className="w-4 h-4 inline mr-1" />
                          {exercise.evidence}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Stack Tecnológico 100% Gratuito
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tecnologías actuales y sostenibles sin costos ocultos
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                    <CardDescription>{tech.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      {tech.cost}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-12 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-xl text-green-800">Compromiso de Transparencia</CardTitle>
                <CardDescription>
                  Todas las tecnologías utilizadas son gratuitas, de código abierto o estándares web. 
                  Sin APIs pagas, sin costos ocultos, sin sorpresas.
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Lista para transformar tu rutina de cuidado facial?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución del yoga facial con IA. 100% gratuito, científicamente validado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg">
              Conocer Más
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}