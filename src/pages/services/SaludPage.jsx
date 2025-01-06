import React from 'react';
import { Link } from 'react-router-dom';

export default function SaludPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg",
      title: "Optimización Hormonal",
      description: "Recupera tu equilibrio hormonal natural"
    },
    {
      url: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
      title: "Energía y Vitalidad",
      description: "Mejora tus niveles de energía diarios"
    },
    {
      url: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
      title: "Bienestar General",
      description: "Recupera tu salud y calidad de vida"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">RECUPERA TU SALUD</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Programa integral diseñado para recuperar tu vitalidad y bienestar. Nos enfocamos en
            optimizar tus marcadores de salud y equilibrio hormonal para que vuelvas a sentirte
            en tu mejor versión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-secondary">
                <h3 className="font-display text-xl text-silver mb-2">{image.title}</h3>
                <p className="text-accent">{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-secondary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6 text-silver">Optimización Hormonal</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Mejora de niveles de testosterona
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Balance hormonal natural
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Optimización del cortisol
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Regulación del metabolismo
              </li>
            </ul>
          </div>

          <div className="bg-primary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6">Recuperación de la Salud</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Mejora de marcadores sanguíneos
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Aumento de energía y vitalidad
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Optimización del descanso
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Mejora del estado de ánimo
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/contacto" 
            className="inline-block bg-primary text-accent px-8 py-3 rounded-lg font-display
                     hover:bg-opacity-90 transition-colors"
          >
            RECUPERA TU BIENESTAR
          </Link>
        </div>
      </div>
    </div>
  );
}
