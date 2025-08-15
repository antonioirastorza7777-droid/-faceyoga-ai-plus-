'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Camera, 
  Settings, 
  Target, 
  Brain,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  Edit,
  Save,
  Upload,
  Download,
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle,
  Scale
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond';
  skinType: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  primaryConcerns: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferences: {
    language: string;
    notifications: boolean;
    darkMode: boolean;
    weeklyReminders: boolean;
  };
  joinDate: Date;
  lastActive: Date;
}

interface FacialAnalysis {
  estimatedAge: number;
  faceShape: 'oval' | 'round' | 'square' | 'heart' | 'diamond';
  asymmetry: number;
  skinCondition: {
    elasticity: number;
    hydration: number;
    texture: number;
  };
  problemAreas: string[];
  recommendedExercises: string[];
  personalizedRoutine: {
    morning: string[];
    evening: string[];
    weekly: string[];
  };
}

interface PersonalizationSettings {
  difficulty: 'auto' | 'beginner' | 'intermediate' | 'advanced';
  sessionDuration: number;
  weeklyGoal: number;
  focusAreas: string[];
  avoidedExercises: string[];
  coachPreference: 'sophia' | 'elena' | 'marcus' | 'auto';
}

interface UserProfileProps {
  userId?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
  onAnalysisUpdate?: (analysis: FacialAnalysis) => void;
}

export default function UserProfile({ userId, onProfileUpdate, onAnalysisUpdate }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [facialAnalysis, setFacialAnalysis] = useState<FacialAnalysis | null>(null);
  const [personalization, setPersonalization] = useState<PersonalizationSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  // Initialize with sample data
  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    const sampleProfile: UserProfile = {
      id: userId || 'user-123',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      age: 42,
      faceShape: 'oval',
      skinType: 'combination',
      primaryConcerns: ['líneas de expresión', 'flacidez mejillas', 'párpados caídos'],
      fitnessLevel: 'intermediate',
      goals: ['mejorar tonicidad facial', 'reducir arrugas', 'mejorar definición mandibular'],
      preferences: {
        language: 'es',
        notifications: true,
        darkMode: false,
        weeklyReminders: true
      },
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastActive: new Date()
    };

    const sampleAnalysis: FacialAnalysis = {
      estimatedAge: 42,
      faceShape: 'oval',
      asymmetry: 15,
      skinCondition: {
        elasticity: 65,
        hydration: 70,
        texture: 60
      },
      problemAreas: ['mejillas', 'contorno ojos', 'línea mandibular'],
      recommendedExercises: [
        'Elevador de Mejillas',
        'Tensado Ocular',
        'Fortalecedor Mandíbula-Cuello',
        'Esculpido Mejillas Felices'
      ],
      personalizedRoutine: {
        morning: ['Elevador de Cejas (5 min)', 'Tensado Ocular (3 min)'],
        evening: ['Elevador de Mejillas (8 min)', 'Fortalecedor Mandíbula-Cuello (5 min)'],
        weekly: ['Esculpido Mejillas Felices (3 veces)', 'Rutina completa (2 veces)']
      }
    };

    const samplePersonalization: PersonalizationSettings = {
      difficulty: 'auto',
      sessionDuration: 15,
      weeklyGoal: 4,
      focusAreas: ['mejillas', 'ojos', 'cuello'],
      avoidedExercises: [],
      coachPreference: 'auto'
    };

    setProfile(sampleProfile);
    setFacialAnalysis(sampleAnalysis);
    setPersonalization(samplePersonalization);
    setEditedProfile(sampleProfile);
  };

  const handleProfileUpdate = () => {
    if (profile && editedProfile) {
      const updatedProfile = { ...profile, ...editedProfile };
      setProfile(updatedProfile);
      setIsEditing(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    }
  };

  const runFacialAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate facial analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, this would use TensorFlow.js and actual image analysis
    const updatedAnalysis: FacialAnalysis = {
      ...facialAnalysis!,
      estimatedAge: profile!.age + Math.floor(Math.random() * 5) - 2,
      asymmetry: Math.floor(Math.random() * 20) + 5,
      skinCondition: {
        elasticity: Math.floor(Math.random() * 30) + 60,
        hydration: Math.floor(Math.random() * 25) + 65,
        texture: Math.floor(Math.random() * 35) + 55
      }
    };

    setFacialAnalysis(updatedAnalysis);
    setIsAnalyzing(false);
    
    if (onAnalysisUpdate) {
      onAnalysisUpdate(updatedAnalysis);
    }
  };

  const getFaceShapeIcon = (faceShape: string) => {
    const icons = {
      oval: '🥚',
      round: '⭕',
      square: '⬜',
      heart: '❤️',
      diamond: '💎'
    };
    return icons[faceShape as keyof typeof icons] || '👤';
  };

  const getSkinTypeColor = (skinType: string) => {
    const colors = {
      dry: 'bg-yellow-100 text-yellow-800',
      oily: 'bg-orange-100 text-orange-800',
      combination: 'bg-green-100 text-green-800',
      sensitive: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800'
    };
    return colors[skinType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getFitnessLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!profile || !facialAnalysis || !personalization) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="text-base">
                  Miembro desde {profile.joinDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge className={getFitnessLevelColor(profile.fitnessLevel)}>
                    {profile.fitnessLevel === 'beginner' ? 'Principiante' : 
                     profile.fitnessLevel === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Facial</TabsTrigger>
          <TabsTrigger value="personalization">Personalización</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Edad</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editedProfile.age || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label>Forma de Rostro</Label>
                      <Select 
                        value={editedProfile.faceShape || profile.faceShape}
                        onValueChange={(value) => setEditedProfile(prev => ({ ...prev, faceShape: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oval">Ovalado</SelectItem>
                          <SelectItem value="round">Redondo</SelectItem>
                          <SelectItem value="square">Cuadrado</SelectItem>
                          <SelectItem value="heart">Corazón</SelectItem>
                          <SelectItem value="diamond">Diamante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo de Piel</Label>
                      <Select 
                        value={editedProfile.skinType || profile.skinType}
                        onValueChange={(value) => setEditedProfile(prev => ({ ...prev, skinType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dry">Seca</SelectItem>
                          <SelectItem value="oily">Grasa</SelectItem>
                          <SelectItem value="combination">Mixta</SelectItem>
                          <SelectItem value="sensitive">Sensible</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{profile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{profile.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Edad:</span>
                      <span className="font-medium">{profile.age} años</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Forma de Rostro:</span>
                      <span className="font-medium flex items-center gap-2">
                        {getFaceShapeIcon(profile.faceShape)} {profile.faceShape}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de Piel:</span>
                      <Badge className={getSkinTypeColor(profile.skinType)}>
                        {profile.skinType === 'dry' ? 'Seca' :
                         profile.skinType === 'oily' ? 'Grasa' :
                         profile.skinType === 'combination' ? 'Mixta' :
                         profile.skinType === 'sensitive' ? 'Sensible' : 'Normal'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Goals and Concerns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos y Preocupaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Preocupaciones Principales</Label>
                      <Textarea
                        value={editedProfile.primaryConcerns?.join(', ') || ''}
                        onChange={(e) => setEditedProfile(prev => ({ 
                          ...prev, 
                          primaryConcerns: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        }))}
                        placeholder="líneas de expresión, flacidez, etc."
                      />
                    </div>
                    <div>
                      <Label>Nivel de Condición Física</Label>
                      <Select 
                        value={editedProfile.fitnessLevel || profile.fitnessLevel}
                        onValueChange={(value) => setEditedProfile(prev => ({ ...prev, fitnessLevel: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Objetivos Personales</Label>
                      <Textarea
                        value={editedProfile.goals?.join(', ') || ''}
                        onChange={(e) => setEditedProfile(prev => ({ 
                          ...prev, 
                          goals: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        }))}
                        placeholder="mejorar tonicidad, reducir arrugas, etc."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Preocupaciones Principales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.primaryConcerns.map((concern, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Objetivos Personales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.goals.map((goal, index) => (
                          <Badge key={index} className="bg-pink-100 text-pink-800 text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Nivel de Experiencia:</h4>
                      <Badge className={getFitnessLevelColor(profile.fitnessLevel)}>
                        {profile.fitnessLevel === 'beginner' ? 'Principiante' : 
                         profile.fitnessLevel === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <div className="space-y-6">
            {/* Analysis Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Análisis Facial IA
                    </CardTitle>
                    <CardDescription>
                      Análisis personalizado basado en tu tipo facial y preocupaciones
                    </CardDescription>
                  </div>
                  <Button
                    onClick={runFacialAnalysis}
                    disabled={isAnalyzing}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Actualizar Análisis
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Analysis Results */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Facial Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Métricas Faciales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {facialAnalysis.estimatedAge}
                      </div>
                      <div className="text-sm text-gray-600">Edad Estimada</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {facialAnalysis.asymmetry}%
                      </div>
                      <div className="text-sm text-gray-600">Asimetría</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Condición de la Piel:</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Elasticidad</span>
                          <span className="text-sm font-medium">{facialAnalysis.skinCondition.elasticity}%</span>
                        </div>
                        <Progress value={facialAnalysis.skinCondition.elasticity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Hidratación</span>
                          <span className="text-sm font-medium">{facialAnalysis.skinCondition.hydration}%</span>
                        </div>
                        <Progress value={facialAnalysis.skinCondition.hydration} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Textura</span>
                          <span className="text-sm font-medium">{facialAnalysis.skinCondition.texture}%</span>
                        </div>
                        <Progress value={facialAnalysis.skinCondition.texture} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Forma de Rostro Detectada:</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFaceShapeIcon(facialAnalysis.faceShape)}</span>
                      <span className="font-medium capitalize">{facialAnalysis.faceShape}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Recomendaciones Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Áreas Problemáticas Detectadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {facialAnalysis.problemAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ejercicios Recomendados:</h4>
                    <div className="space-y-1">
                      {facialAnalysis.recommendedExercises.map((exercise, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {exercise}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rutina Personalizada:</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-600">Mañana:</span>
                        <ul className="ml-4 mt-1">
                          {facialAnalysis.personalizedRoutine.morning.map((routine, index) => (
                            <li key={index}>• {routine}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-purple-600">Noche:</span>
                        <ul className="ml-4 mt-1">
                          {facialAnalysis.personalizedRoutine.evening.map((routine, index) => (
                            <li key={index}>• {routine}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">Semanal:</span>
                        <ul className="ml-4 mt-1">
                          {facialAnalysis.personalizedRoutine.weekly.map((routine, index) => (
                            <li key={index}>• {routine}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personalization" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración de Personalización
              </CardTitle>
              <CardDescription>
                Ajusta la aplicación según tus preferencias y objetivos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                  <Select value={personalization.difficulty} onValueChange={(value) => setPersonalization(prev => ({ ...prev, difficulty: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automático</SelectItem>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duración de Sesiones (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={personalization.sessionDuration}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, sessionDuration: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="weekly">Meta Semanal (sesiones)</Label>
                  <Input
                    id="weekly"
                    type="number"
                    value={personalization.weeklyGoal}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, weeklyGoal: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="coach">Preferencia de Coach</Label>
                  <Select value={personalization.coachPreference} onValueChange={(value) => setPersonalization(prev => ({ ...prev, coachPreference: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automático</SelectItem>
                      <SelectItem value="sophia">Sophia (Técnica)</SelectItem>
                      <SelectItem value="elena">Elena (Motivación)</SelectItem>
                      <SelectItem value="marcus">Marcus (Ciencia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Áreas de Enfoque</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {['mejillas', 'ojos', 'frente', 'boca', 'cuello', 'línea mandibular', 'arrugas', 'tonicidad'].map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={personalization.focusAreas.includes(area)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPersonalization(prev => ({
                              ...prev,
                              focusAreas: [...prev.focusAreas, area]
                            }));
                          } else {
                            setPersonalization(prev => ({
                              ...prev,
                              focusAreas: prev.focusAreas.filter(a => a !== area)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Configuración
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferencias de la Aplicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notificaciones</Label>
                    <p className="text-sm text-gray-600">Recibir recordatorios y actualizaciones</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={profile.preferences.notifications}
                    onCheckedChange={(checked) => {
                      if (profile) {
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, notifications: checked }
                        });
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Modo Oscuro</Label>
                    <p className="text-sm text-gray-600">Interfaz oscura para mayor comodidad</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={profile.preferences.darkMode}
                    onCheckedChange={(checked) => {
                      if (profile) {
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, darkMode: checked }
                        });
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReminders">Recordatorios Semanales</Label>
                    <p className="text-sm text-gray-600">Resumen de progreso cada semana</p>
                  </div>
                  <Switch
                    id="weeklyReminders"
                    checked={profile.preferences.weeklyReminders}
                    onCheckedChange={(checked) => {
                      if (profile) {
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, weeklyReminders: checked }
                        });
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={profile.preferences.language} onValueChange={(value) => {
                  if (profile) {
                    setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, language: value }
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Preferencias
                </Button>
                <Button variant="outline" onClick={() => {
                  // Reset to defaults
                  if (profile) {
                    setProfile({
                      ...profile,
                      preferences: {
                        language: 'es',
                        notifications: true,
                        darkMode: false,
                        weeklyReminders: true
                      }
                    });
                  }
                }}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Restablecer Valores
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}