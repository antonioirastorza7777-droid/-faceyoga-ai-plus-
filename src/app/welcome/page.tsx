// app/(routes)/welcome/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Bienvenido a FaceYoga AI+!</h1>
        <p className="text-gray-600 mb-8">
          Estamos trabajando para crear la mejor experiencia de yoga facial con inteligencia artificial. 
          Pronto podrás registrarte y acceder a todos nuestros ejercicios personalizados.
        </p>
        
        <div className="space-y-4">
          <Link href="/" className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
            Volver al Inicio
          </Link>
          
          <button className="block w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
            Notificarme cuando esté listo
          </button>
        </div>
      </div>
    </div>
  );
}