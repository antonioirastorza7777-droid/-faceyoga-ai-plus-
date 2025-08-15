// src/components/FacialTracking.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceMesh from '@mediapipe/face_mesh';
import * as cameraUtils from '@mediapipe/camera_utils';

interface FacialTrackingProps {
  onFaceDetected?: (landmarks: faceMesh.NormalizedLandmark[]) => void;
  isActive?: boolean;
}

export default function FacialTracking({ onFaceDetected, isActive = true }: FacialTrackingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const faceMeshInstance = new faceMesh.FaceMesh({
      locateFile: (file) => {
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

    let camera: cameraUtils.Camera | null = null;

    const initializeCamera = async () => {
      try {
        if (!videoRef.current) return;

        camera = new cameraUtils.Camera(videoRef.current, {
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

    initializeCamera();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [isActive]);

  const onResults = (results: faceMesh.Results) => {
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
      drawConnectors(canvasCtx, landmarks, faceMesh.FACEMESH_TESSELATION, {
        color: '#C0C0C070',
        lineWidth: 1
      });
    }

    canvasCtx.restore();
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: faceMesh.NormalizedLandmark[],
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
    landmarks: faceMesh.NormalizedLandmark[],
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Iniciando cámara...</p>
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