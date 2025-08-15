'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Crown, 
  CheckCircle, 
  XCircle,
  Zap,
  Shield,
  Heart,
  Brain,
  TrendingUp,
  Award,
  Gift,
  Lock,
  Unlock,
  CreditCard,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: {
    exercises: string[];
    cvTracking: string[];
    aiCoaching: string[];
    progress: string[];
    personalization: string[];
  };
  limitations: {
    clearlyExplained: string;
    noHiddenRestrictions: string;
    upgradeVoluntary: string;
    functionalValue: string;
  };
  ethicalPricing: {
    singleClearPrice: string;
    noAutoRenewal: string;
    cancelInstantly: string;
    moneyBackGuarantee: string;
    transparentTerms: string;
  };
  popular?: boolean;
  cta: string;
  ctaVariant: 'default' | 'outline' | 'secondary';
}

interface FreemiumModelProps {
  onUpgrade?: (tier: string) => void;
  currentTier?: string;
}

export default function FreemiumModel({ onUpgrade, currentTier = 'free' }: FreemiumModelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'FaceYoga AI+ Free',
      price: '€0',
      period: 'permanente',
      description: 'Acceso completo a las características fundamentales - 100% gratuito',
      features: {
        exercises: [
          '3 ejercicios básicos completos',
          'Cheek Lifter científico',
          'Eye Tightening básico', 
          'Basic Jaw Firmer'
        ],
        cvTracking: [
          'Verificación técnica MediaPipe completa',
          'Score precisión ejercicios',
          'Feedback correcciones básico'
        ],
        aiCoaching: [
          '1 coach (Sophia técnica)',
          '5 conversaciones/día',
          'Sistema fallback inteligente ilimitado'
        ],
        progress: [
          'Tracking progreso básico',
          'Fotos antes/después',
          'Mediciones científicas básicas'
        ],
        personalization: [
          'Análisis facial básico',
          'Recomendaciones generales',
          'Rutinas predefinidas'
        ]
      },
      limitations: {
        clearlyExplained: 'Límites mostrados claramente en interfaz',
        noHiddenRestrictions: 'Sin restricciones ocultas o trampas',
        upgradeVoluntary: 'Upgrade completamente voluntario',
        functionalValue: 'Tier gratuito proporciona valor real funcional'
      },
      ethicalPricing: {
        singleClearPrice: '€0 - Completamente gratuito',
        noAutoRenewal: 'No aplica - siempre gratuito',
        cancelInstantly: 'No aplica - sin suscripción',
        moneyBackGuarantee: 'Garantía de satisfacción 100%',
        transparentTerms: 'Términos claros sin letra pequeña'
      },
      cta: 'Comenzar Gratis',
      ctaVariant: 'default'
    },
    {
      id: 'premium',
      name: 'FaceYoga AI+ Premium', 
      price: '€4.99',
      period: selectedPeriod === 'monthly' ? 'al mes' : 'al año (ahorra 16%)',
      description: 'Experiencia completa con todas las características avanzadas',
      features: {
        exercises: [
          'Todos los ejercicios (15+ completos)',
          'Rutinas personalizadas IA',
          'Ejercicios avanzados específicos',
          'Programas anti-aging científicos'
        ],
        cvTracking: [
          'Análisis avanzado 468 puntos',
          'Detección asimetría facial',
          'Correcciones técnicas detalladas',
          'Análisis activación muscular completo'
        ],
        aiCoaching: [
          '3 coaches especializados',
          'Conversaciones ilimitadas',
          'Análisis IA personalizado avanzado',
          'Planes adaptados edad/forma cara'
        ],
        progress: [
          'Tracking científico completo',
          'Equivalencia estudios Northwestern',
          'Informes PDF exportables',
          'Comparación antes/después HD'
        ],
        personalization: [
          'Análisis facial IA completo',
          'Recomendaciones específicas cara',
          'Ajuste automático dificultad',
          'Rutinas adaptativas progreso'
        ]
      },
      limitations: {
        clearlyExplained: 'Sin límites de funcionalidad',
        noHiddenRestrictions: 'Acceso completo a todas las características',
        upgradeVoluntary: 'Mantener premium es opcional',
        functionalValue: 'Valor premium significativo y justificado'
      },
      ethicalPricing: {
        singleClearPrice: selectedPeriod === 'monthly' ? '€4.99/mes - precio único sin sorpresas' : '€49.99/año - ahorro del 16%',
        noAutoRenewal: 'Renovación manual cada mes/año',
        cancelInstantly: 'Cancelación instantánea desde app - 2 clics',
        moneyBackGuarantee: 'Garantía devolución 14 días completos',
        transparentTerms: 'Términos claros sin letra pequeña'
      },
      popular: true,
      cta: selectedPeriod === 'monthly' ? 'Comenzar Premium Mensual' : 'Comenzar Premium Anual',
      ctaVariant: 'default'
    }
  ];

  const competitorComparison = [
    {
      feature: 'Precio Transparente',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: 'Precio claro sin aumentos sorpresa'
    },
    {
      feature: 'Cancelación Fácil',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: '2 clics para cancelar, sin complicaciones'
    },
    {
      feature: 'Sin Auto-renovación',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: 'Renovación manual, tú controlas'
    },
    {
      feature: 'Garantía Devolución',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: '14 días garantía de devolución'
    },
    {
      feature: 'Valor Real Gratis',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: 'Versión gratuita realmente funcional'
    },
    {
      feature: 'Tecnología 100% Gratuita',
      faceyoga: <CheckCircle className="w-5 h-5 text-green-500" />,
      competitors: <XCircle className="w-5 h-5 text-red-500" />,
      description: 'Sin APIs pagas ocultas'
    }
  ];

  const ethicalPrinciples = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Transparencia Total',
      description: 'Todos los precios y límites se muestran claramente. No hay costos ocultos, tarifas sorpresa o condiciones engañosas.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Valor Real Gratuito',
      description: 'Nuestra versión gratuita ofrece valor real y funcional. No es una versión limitada con el único propósito de forzar el upgrade.'
    },
    {
      icon: <Unlock className="w-6 h-6" />,
      title: 'Control del Usuario',
      description: 'Tú tienes el control total. Cancelación instantánea, sin auto-renovación forzada, sin contratos a largo plazo.'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Tecnología Ética',
      description: 'Usamos exclusivamente tecnologías gratuitas y abiertas. No dependemos de APIs pagas que encarecen el servicio.'
    }
  ];

  const handleUpgrade = (tierId: string) => {
    if (onUpgrade) {
      onUpgrade(tierId);
    }
  };

  const getCurrentTierBadge = (tierId: string) => {
    if (tierId === currentTier) {
      return (
        <Badge className="bg-green-500 ml-2">
          <CheckCircle className="w-3 h-3 mr-1" />
          Plan Actual
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Modelo Freemium Ético
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transparencia total y valor real. Sin trucos, sin sorpresas, sin costos ocultos.
        </p>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={selectedPeriod === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('monthly')}
                className={selectedPeriod === 'monthly' ? 'bg-white shadow' : ''}
              >
                Mensual
              </Button>
              <Button
                variant={selectedPeriod === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('yearly')}
                className={selectedPeriod === 'yearly' ? 'bg-white shadow' : ''}
              >
                Anual <Badge className="ml-2 bg-green-500">Ahorra 16%</Badge>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-2 gap-8">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative ${tier.popular ? 'border-pink-500 shadow-lg' : ''} ${tier.id === currentTier ? 'ring-2 ring-green-500' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-pink-500 text-white px-3 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {tier.name}
                  {getCurrentTierBadge(tier.id)}
                </CardTitle>
                {tier.id === 'premium' && <Crown className="w-6 h-6 text-yellow-500" />}
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-gray-600">/{tier.period}</span>
              </div>
              <CardDescription className="text-base mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* CTA Button */}
              <Button 
                className={`w-full ${tier.id === 'premium' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                size="lg"
                onClick={() => handleUpgrade(tier.id)}
                disabled={tier.id === currentTier}
              >
                {tier.id === currentTier ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Plan Actual
                  </>
                ) : (
                  tier.cta
                )}
              </Button>

              {/* Features */}
              <Tabs defaultValue="exercises" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="exercises" className="text-xs">Ejercicios</TabsTrigger>
                  <TabsTrigger value="tracking" className="text-xs">Tracking</TabsTrigger>
                  <TabsTrigger value="coaching" className="text-xs">Coaches</TabsTrigger>
                  <TabsTrigger value="progress" className="text-xs">Progreso</TabsTrigger>
                  <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                </TabsList>

                <TabsContent value="exercises" className="mt-4">
                  <div className="space-y-2">
                    {tier.features.exercises.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tracking" className="mt-4">
                  <div className="space-y-2">
                    {tier.features.cvTracking.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="coaching" className="mt-4">
                  <div className="space-y-2">
                    {tier.features.aiCoaching.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="mt-4">
                  <div className="space-y-2">
                    {tier.features.progress.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="personal" className="mt-4">
                  <div className="space-y-2">
                    {tier.features.personalization.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Ethical Pricing */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Compromiso Ético
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {tier.ethicalPricing.singleClearPrice}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {tier.ethicalPricing.noAutoRenewal}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {tier.ethicalPricing.cancelInstantly}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {tier.ethicalPricing.moneyBackGuarantee}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ethical Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Nuestros Principios Éticos
          </CardTitle>
          <CardDescription>
            La base de nuestro modelo de negocio transparente y honesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ethicalPrinciples.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 text-pink-600">
                  {principle.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{principle.title}</h3>
                <p className="text-sm text-gray-600">{principle.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Comparación con Competencia
              </CardTitle>
              <CardDescription>
                Por qué nuestro modelo es diferente y mejor para ti
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Ocultar' : 'Ver'} Comparación
            </Button>
          </div>
        </CardHeader>
        {showComparison && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Característica</th>
                    <th className="text-center py-3 px-4">FaceYoga AI+</th>
                    <th className="text-center py-3 px-4">Competencia</th>
                    <th className="text-left py-3 px-4">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{item.feature}</td>
                      <td className="py-3 px-4 text-center">{item.faceyoga}</td>
                      <td className="py-3 px-4 text-center">{item.competitors}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Trust Indicators */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Garantía de Satisfacción</h3>
            <p className="text-sm text-gray-600">
              14 días de garantía de devolución. Si no estás satisfecho, te devolvemos tu dinero.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Cancelación Instantánea</h3>
            <p className="text-sm text-gray-600">
              Cancela tu suscripción en cualquier momento con 2 clics. Sin complicaciones.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Soporte 24/7</h3>
            <p className="text-sm text-gray-600">
              Equipo de soporte disponible siempre que necesites ayuda con tu cuenta.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Lista para transformar tu rutina de cuidado facial?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están disfrutando de los beneficios del yoga facial con IA. 
            Comienza gratis y upgrade cuando quieras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
              <Gift className="w-4 h-4 mr-2" />
              Comenzar Gratis
            </Button>
            <Button size="lg" variant="outline">
              <Info className="w-4 h-4 mr-2" />
              Conocer Más
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> FaceYoga AI+ utiliza exclusivamente tecnologías gratuitas y abiertas. 
          Nunca cobraremos por características que deberían ser gratuitas, y nuestro modelo gratuito 
          siempre ofrecerá valor real sin limitaciones artificiales.
        </AlertDescription>
      </Alert>
    </div>
  );
}