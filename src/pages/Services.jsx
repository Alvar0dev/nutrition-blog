import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      title: "MEJORA TUS HÁBITOS",
      description: "Desarrolla hábitos saludables que transformen tu vida",
      image: "https://images.pexels.com/photos/4098365/pexels-photo-4098365.jpeg",
      link: "/servicios/habitos"
    },
    {
      title: "CONSIGUE TUS OBJETIVOS",
      description: "Alcanza tus metas de forma efectiva y sostenible",
      image: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg",
      link: "/servicios/objetivos"
    },
    {
      title: "COMPOSICIÓN CORPORAL",
      description: "Optimiza tu composición corporal de manera saludable",
      image: "https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg",
      link: "/servicios/composicion"
    },
    {
      title: "RECUPERA TU SALUD",
      description: "Mejora tu salud y calidad de vida",
      image: "https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg",
      link: "/servicios/salud"
    },
    {
      title: "ASESORAMIENTO PERSONALIZADO",
      description: "Recibe atención personalizada para tus necesidades",
      image: "https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg",
      link: "/servicios/asesoramiento"
    },
    {
      title: "EDUCACIÓN NUTRICIONAL",
      description: "Aprende los fundamentos de una nutrición saludable",
      image: "https://images.pexels.com/photos/4397833/pexels-photo-4397833.jpeg",
      link: "/servicios/educacion"
    }
  ];

  return (
    <div className="bg-accent min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-5xl text-secondary mb-12 text-center">SERVICIOS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link 
              to={service.link}
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-black opacity-40 transition-opacity group-hover:opacity-30"></div>
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-display text-2xl text-white mb-2">{service.title}</h3>
                <p className="text-gray-200 text-sm">{service.description}</p>
              </div>
            </Link>
          ))}
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
