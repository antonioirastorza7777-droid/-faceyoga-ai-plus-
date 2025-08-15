import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaceYoga AI+ - Yoga Facial con IA",
  description: "Primera app yoga facial con verificación IA tiempo real - 100% gratuita. Tecnologías MediaPipe, Ollama local y TensorFlow.js.",
  keywords: ["FaceYoga", "yoga facial", "IA", "inteligencia artificial", "ejercicios faciales", "anti-aging", "belleza", "salud", "bienestar"],
  authors: [{ name: "FaceYoga AI+ Team" }],
  openGraph: {
    title: "FaceYoga AI+ - Yoga Facial con IA",
    description: "Primera app yoga facial con verificación IA tiempo real - 100% gratuita",
    url: "https://faceyoga-ai.app",
    siteName: "FaceYoga AI+",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaceYoga AI+ - Yoga Facial con IA",
    description: "Primera app yoga facial con verificación IA tiempo real - 100% gratuita",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FaceYoga AI+",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FaceYoga AI+",
    "application-name": "FaceYoga AI+",
    "apple-touch-fullscreen": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#E91E63" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('Service Worker registered successfully:', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', () => {
                        const installingWorker = registration.installing;
                        installingWorker.addEventListener('statechange', () => {
                          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('Nueva versión disponible. ¿Recargar la página?')) {
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch((error) => {
                      console.log('Service Worker registration failed:', error);
                    });
                });
              }
              
              // Handle online/offline status
              window.addEventListener('online', () => {
                console.log('App is online');
                document.body.classList.remove('offline');
              });
              
              window.addEventListener('offline', () => {
                console.log('App is offline');
                document.body.classList.add('offline');
              });
              
              // Initial offline check
              if (!navigator.onLine) {
                document.body.classList.add('offline');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
