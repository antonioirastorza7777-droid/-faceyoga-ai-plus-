// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para MediaPipe
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Habilitar imágenes externas
  images: {
    domains: ['cdn.jsdelivr.net'],
  },
  // Configuración experimental
  experimental: {
    // Permitir módulos externos
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;