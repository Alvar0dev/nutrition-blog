import React from 'react';
import { Link } from 'react-router-dom';

export default function EducacionPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/4397833/pexels-photo-4397833.jpeg",
      title: "Nutrición Básica",
      description: "Fundamentos de una alimentación saludable"
    },
    {
      url: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
      title: "Cocina Práctica",
      description: "Aprende a preparar comidas nutritivas"
    },
    {
      url: "https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg",
      title: "Planificación",
      description: "Organización y preparación de menús"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">EDUCACIÓN NUTRICIONAL</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Aprende los fundamentos de una nutrición saludable y sostenible. Te enseñamos
            a tomar mejores decisiones sobre tu alimentación y a desarrollar hábitos que
            durarán toda la vida.
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
            <h2 className="font-display text-3xl mb-6 text-silver">Formación Nutricional</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Principios básicos de nutrición
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Macronutrientes y micronutrientes
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Lectura de etiquetas nutricionales
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Mitos y realidades de la nutrición
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">•</span>
                Suplementación básica
              </li>
            </ul>
          </div>

          <div className="bg-primary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6">Talleres Prácticos</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Planificación de menús semanales
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Preparación de comidas saludables
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Técnicas de batch cooking
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Compra inteligente de alimentos
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Gestión de la alimentación diaria
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
            COMIENZA A APRENDER
          </Link>
        </div>
      </div>
    </div>
  );
}
