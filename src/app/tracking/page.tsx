// src/app/tracking/page.tsx
'use client';

import { useState } from 'react';
import FacialTracking from '@/components/FacialTracking';
import Link from 'next/link';

export default function TrackingPage() {
  const [landmarksCount, setLandmarksCount] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleFaceDetected = (landmarks: any[]) => {
    setLandmarksCount(landmarks.length);
  };

  const toggleTracking = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">FY</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FaceYoga AI+</h1>
        </Link>
        <nav>
          <Link href="/" className="text-purple-600 hover:text-purple-800">
            ← Volver al Inicio
          </Link>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Seguimiento Facial con IA
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Nuestra tecnología detecta y analiza 468 puntos faciales en tiempo real
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-purple-600">{landmarksCount}</div>
                  <div className="text-sm text-gray-600">Puntos Faciales</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-pink-600">30 FPS</div>
                  <div className="text-sm text-gray-600">Velocidad</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-indigo-600">98%</div>
                  <div className="text-sm text-gray-600">Precisión</div>
                </div>
              </div>
            </div>

            <button
              onClick={toggleTracking}
              className={`px-6 py-3 rounded-lg font-medium mb-6 ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isActive ? 'Pausar Seguimiento' : 'Iniciar Seguimiento'}
            </button>
          </div>

          {/* Componente de Seguimiento Facial */}
          <FacialTracking
            onFaceDetected={handleFaceDetected}
            isActive={isActive}
          />

          {/* Información Adicional */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Tecnología MediaPipe</h3>
                <p className="text-gray-600">
                  Utilizamos MediaPipe de Google, una tecnología de vanguardia que permite el seguimiento facial 
                  en tiempo real directamente en tu navegador, sin necesidad de servidores externos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-600 mb-2">468 Puntos de Referencia</h3>
                <p className="text-gray-600">
                  Nuestro sistema analiza 468 puntos faciales únicos, permitiendo una precisión milimétrica 
                  para guiar tus ejercicios de yoga facial con máxima efectividad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}