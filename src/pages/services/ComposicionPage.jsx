import React from 'react';
import { Link } from 'react-router-dom';

export default function ComposicionPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg",
      title: "Masa Muscular",
      description: "Desarrollo muscular óptimo y sostenible"
    },
    {
      url: "https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg",
      title: "Definición",
      description: "Reducción de grasa y mejora de la definición muscular"
    },
    {
      url: "https://images.pexels.com/photos/4498603/pexels-photo-4498603.jpeg",
      title: "Rendimiento",
      description: "Optimización de la composición corporal para el rendimiento"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">COMPOSICIÓN CORPORAL</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Transforma tu cuerpo de manera efectiva y saludable. Nuestro enfoque se centra en mejorar
            tu composición corporal a través de estrategias nutricionales personalizadas y basadas en evidencia.
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
            <h2 className="font-display text-3xl mb-6 text-silver">Aumento de Masa Muscular</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Optimización de la ingesta proteica
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Distribución de macronutrientes
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Nutrición periworkout
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Suplementación específica
              </li>
            </ul>
          </div>

          <div className="bg-primary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6">Reducción de Grasa</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Déficit calórico sostenible
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Preservación de masa muscular
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Gestión del hambre y antojos
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Estrategias de adherencia
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
            TRANSFORMA TU CUERPO
          </Link>
        </div>
      </div>
    </div>
  );
}
