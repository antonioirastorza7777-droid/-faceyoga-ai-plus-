// src/components/FacialTracking.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface FacialTrackingProps {
  onFaceDetected?: (landmarks: any[]) => void;
  isActive?: boolean;
}

export default function FacialTracking({ onFaceDetected, isActive = true }: FacialTrackingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        setDebugInfo('Cargando MediaPipe...');
        console.log('Iniciando carga de MediaPipe');
        
        // @ts-ignore - MediaPipe se carga dinámicamente
        const faceMeshModule = await import('@mediapipe/face_mesh');
        // @ts-ignore - MediaPipe se carga dinámicamente
        const cameraUtilsModule = await import('@mediapipe/camera_utils');
        
        console.log('MediaPipe cargado correctamente');
        
        // Guardar las funciones en el window para uso posterior
        (window as any).FaceMesh = faceMeshModule.FaceMesh;
        (window as any).CameraUtils = cameraUtilsModule.CameraUtils;
        (window as any).FACEMESH_TESSELATION = faceMeshModule.FACEMESH_TESSELATION;
        
        setIsLoaded(true);
        setDebugInfo('MediaPipe cargado - Listo para iniciar cámara');
      } catch (err) {
        console.error('Error al cargar MediaPipe:', err);
        setDebugInfo('Error al cargar MediaPipe');
      }
    };

    loadMediaPipe();
  }, []);

  const startCamera = async () => {
    console.log('Botón de iniciar cámara presionado');
    setDebugInfo('Iniciando cámara...');
    
    try {
      // @ts-ignore - Usar FaceMesh desde window
      const FaceMesh = (window as any).FaceMesh;

      const faceMeshInstance = new FaceMesh({
        locateFile: (file: string) => {
          console.log(`Cargando archivo: ${file}`);
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMeshInstance.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMeshInstance.onResults((results: any) => {
        console.log('Resultados recibidos:', results.multiFaceLandmarks?.length || 0, 'caras detectadas');
        onResults(results);
      });

      if (!videoRef.current) {
        console.error('Elemento de video no encontrado');
        return;
      }

      console.log('Iniciando cámara...');
      setDebugInfo('Solicitando permisos de cámara...');

      // Solicitar acceso a la cámara directamente
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      console.log('Permisos de cámara concedidos');
      setDebugInfo('Permisos concedidos - Iniciando seguimiento...');

      // Asignar el stream al video
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // Configurar el bucle de procesamiento
      const processFrame = async () => {
        if (videoRef.current && faceMeshInstance) {
          await faceMeshInstance.send({ image: videoRef.current });
        }
        if (isTracking) {
          requestAnimationFrame(processFrame);
        }
      };

      setIsTracking(true);
      setDebugInfo('Seguimiento facial activo');
      
      // Iniciar el procesamiento de frames
      processFrame();

    } catch (err: any) {
      console.error('Error al inicializar la cámara:', err);
      setDebugInfo(`Error: ${err.message}`);
      setIsTracking(false);
    }
  };

  const stopCamera = () => {
    console.log('Deteniendo cámara');
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsTracking(false);
    setDebugInfo('Cámara detenida');
  };

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];

      // Dibujar los puntos faciales
      drawLandmarks(canvasCtx, landmarks, {
        color: '#FF3030',
        lineWidth: 1,
        radius: 2
      });

      // Dibujar conexiones (contorno facial)
      // @ts-ignore - Usar FACEMESH_TESSELATION desde window
      const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
        color: '#C0C0C070',
        lineWidth: 1
      });
    }

    canvasCtx.restore();
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options: { color: string; lineWidth: number; radius: number }
  ) => {
    ctx.fillStyle = options.color;
    for (const landmark of landmarks) {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, options.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawConnectors = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: number[][],
    options: { color: string; lineWidth: number }
  ) => {
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.lineWidth;
    
    for (const connection of connections) {
      const start = landmarks[connection[0]];
      const end = landmarks[connection[1]];
      
      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height);
        ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height);
        ctx.stroke();
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Información de depuración */}
      {debugInfo && (
        <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded mb-4 text-sm">
          <strong>Depuración:</strong> {debugInfo}
        </div>
      )}
      
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-auto transform scale-x-[-1]"
          playsInline
          muted
          style={{ display: isTracking ? 'block' : 'none' }}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
          width="640"
          height="480"
        />
        
        {!isTracking && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center p-8">
              {isLoaded ? (
                <div className="space-y-6">
                  <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none, viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Seguimiento Facial IA</h3>
                    <p className="text-gray-300 mb-6">
                      Haz clic en el botón para iniciar la cámara y comenzar el seguimiento facial
                    </p>
                    <button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Iniciar Cámara
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  <p>Cargando tecnología de IA...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        {isTracking && (
          <button
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Detener Cámara
          </button>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        {isTracking && (
          <p className="text-green-600">
            ✓ Seguimiento facial activo - Detectando {468} puntos faciales
          </p>
        )}
      </div>
    </div>
  );
}