// src/app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  const handleStartFree = () => {
    router.push('/welcome');
  };

  const handleViewDemo = () => {
    setShowDemo(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header con navegación básica */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">FY</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FaceYoga AI+</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Características</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Ejercicios</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Testimonios</a></li>
            <li><a href="#" className="text-gray-600 hover:text-purple-600">Precios</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            Transforma tu rostro con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Yoga Facial IA
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            La aplicación revolucionaria que utiliza inteligencia artificial para guiarte en ejercicios de yoga facial, 
            ayudándote a rejuvenecer tu piel y tonificar tus músculos faciales.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <button 
              onClick={handleStartFree}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Comenzar Gratis
            </button>
            
            <button 
              onClick={handleViewDemo}
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-full font-medium text-lg hover:bg-purple-50 transition-all duration-300"
            >
              Ver Demo
            </button>
          </div>

          {/* Enlace a seguimiento facial */}
          <div className="mt-6">
            <Link 
              href="/tracking"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Probar Seguimiento Facial
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Demo de FaceYoga AI+</h3>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-purple-600 mb-2" fill="none, viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Video de demostración</p>
                  <p className="text-sm text-gray-400 mt-1">(Próximamente disponible)</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Esta demostración mostrará cómo FaceYoga AI+ utiliza la inteligencia artificial para guiarte en 
                ejercicios de yoga facial personalizados.
              </p>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowDemo(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer simple */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FY</span>
            </div>
            <h2 className="text-xl font-bold">FaceYoga AI+</h2>
          </div>
          <p className="text-gray-400">
            © {new Date().getFullYear()} FaceYoga AI+. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}