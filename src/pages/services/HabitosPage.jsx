import React from 'react';
import { Link } from 'react-router-dom';

export default function HabitosPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg",
      title: "Ciclo del Sueño",
      description: "Optimiza tu descanso para una mejor recuperación"
    },
    {
      url: "https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg",
      title: "Control de Ansiedad",
      description: "Técnicas para manejar la ansiedad alimentaria"
    },
    {
      url: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
      title: "Hábitos Saludables",
      description: "Desarrollo de rutinas sostenibles"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">MEJORA TUS HÁBITOS</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Un programa completo diseñado para transformar tus hábitos y mejorar tu calidad de vida,
            enfocándonos en los aspectos fundamentales del bienestar: sueño, alimentación y gestión del estrés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                width="400"
                height="300"
              />
              <div className="p-6 bg-secondary">
                <h3 className="font-display text-xl text-silver mb-2">{image.title}</h3>
                <p className="text-accent">{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary text-accent p-8 rounded-xl">
          <h2 className="font-display text-3xl mb-6 text-silver">¿Qué incluye este servicio?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl mb-4">Optimización del Sueño</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Análisis de patrones de sueño
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Estrategias para mejorar la calidad del descanso
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Rutinas pre-sueño personalizadas
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl mb-4">Control de Ansiedad</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Técnicas de mindful eating
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Gestión de antojos y compulsiones
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Estrategias de regulación emocional
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://forms.gle/1PnXermhG98u8NZq6"
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-block bg-primary text-accent px-8 py-3 rounded-lg font-display
                     hover:bg-opacity-90 transition-colors"
          >
            EMPIEZA AHORA
          </a>
        </div>
      </div>
    </div>
  );
}
