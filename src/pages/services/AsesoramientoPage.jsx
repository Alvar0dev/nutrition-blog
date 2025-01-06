import React from 'react';
import { Link } from 'react-router-dom';

export default function AsesoramientoPage() {
  const images = [
    {
      url: "https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg",
      title: "Planes Personalizados",
      description: "Nutrición adaptada a tus necesidades específicas"
    },
    {
      url: "https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg",
      title: "Seguimiento Continuo",
      description: "Apoyo y ajustes constantes en tu proceso"
    },
    {
      url: "https://images.pexels.com/photos/5473302/pexels-photo-5473302.jpeg",
      title: "Resultados Medibles",
      description: "Control y seguimiento de tu progreso"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-primary hover:text-opacity-80 mb-8 inline-block">
          ← Volver a Servicios
        </Link>
        
        <h1 className="font-display text-5xl text-secondary mb-8">ASESORAMIENTO PERSONALIZADO</h1>
        
        <div className="prose max-w-none mb-12">
          <p className="text-xl text-gray-600">
            Un servicio completamente personalizado que se adapta a tus necesidades específicas,
            estilo de vida y objetivos. Más de 15 años de experiencia respaldan nuestro método
            de trabajo individualizado.
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
            <h2 className="font-display text-3xl mb-6 text-silver">El Proceso</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-primary mr-2">1.</span>
                Evaluación inicial detallada
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">2.</span>
                Diseño de plan personalizado
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">3.</span>
                Seguimiento semanal
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">4.</span>
                Ajustes basados en resultados
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">5.</span>
                Soporte continuo
              </li>
            </ul>
          </div>

          <div className="bg-primary text-accent p-8 rounded-xl">
            <h2 className="font-display text-3xl mb-6">Incluye</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Plan nutricional detallado
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Guía de suplementación
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Recetas y alternativas
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Seguimiento por WhatsApp
              </li>
              <li className="flex items-center">
                <span className="text-silver mr-2">•</span>
                Revisiones periódicas
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
            SOLICITA TU CONSULTA
          </Link>
        </div>
      </div>
    </div>
  );
}
