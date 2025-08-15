'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  CameraOff, 
  Video, 
  VideoOff, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Target,
  Brain,
  Activity
} from 'lucide-react';

interface FacialLandmark {
  x: number;
  y: number;
  z?: number;
}

interface TrackingResult {
  landmarks: FacialLandmark[];
  confidence: number;
  exerciseScore?: number;
  feedback?: string;
  detectedEmotions?: string[];
}

interface FacialTrackingCameraProps {
  exerciseId?: string;
  onTrackingResult?: (result: TrackingResult) => void;
  isActive?: boolean;
  width?: number;
  height?: number;
}

export default function FacialTrackingCamera({
  exerciseId,
  onTrackingResult,
  isActive = false,
  width = 640,
  height = 480
}: FacialTrackingCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [trackingActive, setTrackingActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const animationRef = useRef<number>();

  // MediaPipe Face Mesh simulation (since we can't load actual MediaPipe in this environment)
  const simulateMediaPipeDetection = (videoElement: HTMLVideoElement): TrackingResult => {
    // Simulate facial landmarks detection
    const landmarks: FacialLandmark[] = [];
    for (let i = 0; i < 468; i++) {
      landmarks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 100 - 50
      });
    }

    // Simulate exercise-specific validation
    let exerciseScore = 0;
    let feedback = '';
    
    if (exerciseId === 'cheek_lifter') {
      exerciseScore = Math.random() * 40 + 60; // 60-100 score
      feedback = exerciseScore > 80 ? 'Excelente técnica! Mantén la elevación de mejillas.' :
                 exerciseScore > 70 ? 'Buena técnica. Intenta elevar más las mejillas.' :
                 'Ajusta la forma de tus labios y eleva más las mejillas.';
    } else if (exerciseId === 'eyebrow_lifter') {
      exerciseScore = Math.random() * 35 + 65; // 65-100 score
      feedback = exerciseScore > 85 ? 'Perfecto! Máxima activación frontal.' :
                 exerciseScore > 75 ? 'Buena resistencia. Mantén la presión.' :
                 'Aplica más presión con los dedos y eleva más.';
    } else {
      exerciseScore = Math.random() * 30 + 70; // 70-100 score
      feedback = 'Técnica correcta. Continúa así.';
    }

    return {
      landmarks,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
      exerciseScore,
      feedback,
      detectedEmotions: ['neutral', 'focused']
    };
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: FacialLandmark[]) => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw facial landmarks
    ctx.fillStyle = '#ff1493';
    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 1;

    // Draw key facial points
    landmarks.forEach((landmark, index) => {
      if (index % 10 === 0) { // Draw every 10th point to avoid clutter
        ctx.beginPath();
        ctx.arc(landmark.x, landmark.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw facial outline (simplified)
    if (landmarks.length > 100) {
      ctx.beginPath();
      ctx.moveTo(landmarks[10].x, landmarks[10].y);
      for (let i = 11; i < 50; i++) {
        ctx.lineTo(landmarks[i].x, landmarks[i].y);
      }
      ctx.stroke();
    }

    // Draw exercise-specific indicators
    if (exerciseId === 'cheek_lifter') {
      // Draw cheek area indicators
      ctx.fillStyle = 'rgba(255, 20, 147, 0.2)';
      ctx.fillRect(landmarks[50]?.x - 30 || 150, landmarks[50]?.y - 30 || 200, 60, 60);
      ctx.fillRect(landmarks[280]?.x - 30 || 450, landmarks[280]?.y - 30 || 200, 60, 60);
    } else if (exerciseId === 'eyebrow_lifter') {
      // Draw eyebrow area indicators
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(landmarks[70]?.x - 40 || 200, landmarks[70]?.y - 20 || 100, 80, 40);
      ctx.fillRect(landmarks[300]?.x - 40 || 400, landmarks[300]?.y - 20 || 100, 80, 40);
    }
  };

  const initializeCamera = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTrackingActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const startTracking = () => {
    if (!cameraActive) return;
    setTrackingActive(true);
    setLastTime(performance.now());
    setFrameCount(0);
    processVideo();
  };

  const stopTracking = () => {
    setTrackingActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const processVideo = () => {
    if (!trackingActive || !videoRef.current || !canvasRef.current) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    // Calculate FPS
    setFrameCount(prev => {
      const newCount = prev + 1;
      if (deltaTime >= 1000) {
        setFps(Math.round((newCount * 1000) / deltaTime));
        setLastTime(currentTime);
        return 0;
      }
      return newCount;
    });

    // Simulate MediaPipe detection
    const result = simulateMediaPipeDetection(videoRef.current);
    setTrackingResult(result);
    
    // Draw landmarks on canvas
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      drawLandmarks(ctx, result.landmarks);
    }

    // Call parent callback
    if (onTrackingResult) {
      onTrackingResult(result);
    }

    animationRef.current = requestAnimationFrame(processVideo);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Cámara de Seguimiento Facial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {!cameraActive ? (
              <Button
                onClick={initializeCamera}
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                Iniciar Cámara
              </Button>
            ) : (
              <Button
                onClick={stopCamera}
                variant="destructive"
              >
                <CameraOff className="w-4 h-4 mr-2" />
                Detener Cámara
              </Button>
            )}
            
            {cameraActive && !trackingActive && (
              <Button
                onClick={startTracking}
                className="bg-green-600 hover:bg-green-700"
              >
                <Video className="w-4 h-4 mr-2" />
                Iniciar Seguimiento
              </Button>
            )}
            
            {trackingActive && (
              <Button
                onClick={stopTracking}
                variant="outline"
              >
                <VideoOff className="w-4 h-4 mr-2" />
                Detener Seguimiento
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={cameraActive ? "default" : "secondary"}>
              {cameraActive ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              Cámara {cameraActive ? "Activa" : "Inactiva"}
            </Badge>
            
            <Badge variant={trackingActive ? "default" : "secondary"}>
              {trackingActive ? (
                <Brain className="w-3 h-3 mr-1" />
              ) : (
                <Activity className="w-3 h-3 mr-1" />
              )}
              Seguimiento {trackingActive ? "Activo" : "Inactivo"}
            </Badge>

            {trackingActive && (
              <Badge variant="outline">
                <Target className="w-3 h-3 mr-1" />
                {fps} FPS
              </Badge>
            )}

            {exerciseId && (
              <Badge variant="outline">
                Ejercicio: {exerciseId}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video and Canvas Container */}
      <div className="relative">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ width, height }}>
          <video
            ref={videoRef}
            width={width}
            height={height}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 object-cover mirror-x"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="absolute inset-0"
            style={{ transform: 'scaleX(-1)' }}
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <div className="text-center">
                <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Cámara desactivada</p>
                <p className="text-sm opacity-75">Haz clic en "Iniciar Cámara" para comenzar</p>
              </div>
            </div>
          )}

          {cameraActive && !trackingActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-75" />
                <p className="text-lg">Cámara lista</p>
                <p className="text-sm opacity-75">Haz clic en "Iniciar Seguimiento" para comenzar el análisis</p>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Feedback Overlay */}
        {trackingResult && trackingActive && (
          <div className="absolute top-4 left-4 right-4">
            <Card className="bg-white bg-opacity-95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">Análisis en Tiempo Real</span>
                  </div>
                  <Badge variant={trackingResult.confidence > 0.8 ? "default" : "secondary"}>
                    Confianza: {Math.round(trackingResult.confidence * 100)}%
                  </Badge>
                </div>
                
                {trackingResult.exerciseScore !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Puntuación Técnica:</span>
                      <span className="text-sm font-bold text-pink-600">
                        {Math.round(trackingResult.exerciseScore)}%
                      </span>
                    </div>
                    <Progress 
                      value={trackingResult.exerciseScore} 
                      className="h-2"
                    />
                  </div>
                )}

                {trackingResult.feedback && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">{trackingResult.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tracking Details */}
      {trackingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles del Seguimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {trackingResult.landmarks.length}
                </div>
                <div className="text-sm text-gray-600">Puntos Faciales</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(trackingResult.confidence * 100)}%
                </div>
                <div className="text-sm text-gray-600">Confianza</div>
              </div>
              
              {trackingResult.exerciseScore !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(trackingResult.exerciseScore)}%
                  </div>
                  <div className="text-sm text-gray-600">Precisión Ejercicio</div>
                </div>
              )}
            </div>

            {trackingResult.detectedEmotions && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Emociones Detectadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {trackingResult.detectedEmotions.map((emotion, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}