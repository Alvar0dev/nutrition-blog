import React from 'react';
import { Link } from 'react-router-dom';

export default function ObjetivosPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg",
      title: "Preparación Física",
      description: "Optimización del rendimiento para pruebas específicas"
    },
    {
      url: "https://images.pexels.com/photos/3822719/pexels-photo-3822719.jpeg",
      title: "Competiciones",
      description: "Preparación nutricional para eventos deportivos"
    },
    {
      url: "https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg",
      title: "Oposiciones",
      description: "Nutrición para máximo rendimiento mental y físico"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">CONSIGUE TUS OBJETIVOS</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Programa especializado para alcanzar tus metas específicas, ya sea una oposición,
            una competición deportiva o cualquier otro desafío que requiera un rendimiento óptimo.
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
            <h2 className="font-display text-3xl mb-6 text-silver">Preparación para Oposiciones</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Nutrición para optimizar el rendimiento cognitivo
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Gestión del estrés a través de la alimentación
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Mejora de la concentración y memoria
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Preparación para pruebas físicas
              </li>
            </ul>
          </div>

          <div className="bg-primary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6">Competiciones Deportivas</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Periodización nutricional
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Nutrición pre y post competición
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Hidratación y suplementación específica
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Optimización del peso para la categoría
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
            EMPIEZA TU PREPARACIÓN
          </Link>
        </div>
      </div>
    </div>
  );
}
