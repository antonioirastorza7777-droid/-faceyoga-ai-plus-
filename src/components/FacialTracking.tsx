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
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar MediaPipe dinámicamente solo en el cliente
    const loadMediaPipe = async () => {
      try {
        // @ts-ignore - MediaPipe se carga dinámicamente
        const faceMeshModule = await import('@mediapipe/face_mesh');
        // @ts-ignore - MediaPipe se carga dinámicamente
        const cameraUtilsModule = await import('@mediapipe/camera_utils');
        
        // Guardar las funciones en el window para uso posterior
        (window as any).FaceMesh = faceMeshModule.FaceMesh;
        (window as any).CameraUtils = cameraUtilsModule.CameraUtils;
        (window as any).FACEMESH_TESSELATION = faceMeshModule.FACEMESH_TESSELATION;
        
        setIsLoaded(true);
      } catch (err) {
        console.error('Error al cargar MediaPipe:', err);
        setError('Error al cargar la librería de seguimiento facial');
      }
    };

    loadMediaPipe();
  }, []);

  useEffect(() => {
    if (!isActive || !isLoaded) return;

    let faceMeshInstance: any;
    let camera: any;

    const initializeTracking = async () => {
      try {
        // @ts-ignore - Usar FaceMesh desde window
        const FaceMesh = (window as any).FaceMesh;
        // @ts-ignore - Usar CameraUtils desde window
        const CameraUtils = (window as any).CameraUtils;

        faceMeshInstance = new FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMeshInstance.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMeshInstance.onResults(onResults);

        if (!videoRef.current) return;

        camera = new CameraUtils(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await faceMeshInstance.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        setIsTracking(true);
        setError(null);
      } catch (err) {
        console.error('Error al inicializar la cámara:', err);
        setError('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
        setIsTracking(false);
      }
    };

    initializeTracking();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [isActive, isLoaded]);

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      // Llamar al callback con los puntos faciales
      if (onFaceDetected) {
        onFaceDetected(landmarks);
      }

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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isLoaded && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Cargando librería de seguimiento facial...
        </div>
      )}
      
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-auto transform scale-x-[-1]"
          playsInline
          muted
          autoPlay
          style={{ display: isTracking ? 'block' : 'none' }}
        />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full transform scale-x-[-1]"
          width="640"
          height="480"
        />
        
        {!isTracking && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              {isLoaded ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Iniciando cámara...</p>
                </>
              ) : (
                <p>Cargando tecnología de IA...</p>
              )}
            </div>
          </div>
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