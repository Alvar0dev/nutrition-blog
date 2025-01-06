import { useState } from 'react';
import profileImage from '../assets/yo.png';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
  };

  return (
    <div className="bg-accent py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-5xl text-secondary mb-12 text-center">CONTACTO</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Información de Contacto */}
          <div>
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto mb-6 overflow-hidden rounded-full shadow-xl border-4 border-silver">
                <img 
                  src={profileImage} 
                  alt="Álvaro Aguilar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-display text-3xl text-secondary mb-4 text-center">Álvaro Aguilar</h2>
              <p className="text-gray-600 mb-6 font-body">
                Especialista en nutrición deportiva y coach nutricional con más de 15 años de experiencia
                diseñando planes nutricionales y de entrenamiento personalizados. Mi enfoque integral 
                combina nutrición científica con estrategias prácticas para ayudarte a alcanzar tus 
                objetivos de salud y rendimiento.
              </p>
              <div className="bg-silver/10 p-6 rounded-xl mb-6">
                <h3 className="font-display text-xl text-secondary mb-4">ESPECIALIDADES:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Nutrición Deportiva Avanzada</li>
                  <li>• Planes de Entrenamiento Personalizados</li>
                  <li>• Preparación para Competiciones</li>
                  <li>• Rehabilitación Nutricional</li>
                  <li>• Pérdida de Grasa y Ganancia Muscular</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl text-secondary mb-4">INFORMACIÓN DE CONTACTO</h3>
              <div className="space-y-2">
                <a href="mailto:alvaroaguilarcejas@hotmail.com" 
                   className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <span className="font-body">alvaroaguilarcejas@hotmail.com</span>
                </a>
                <a href="mailto:info@nutricionalcoach.com"
                   className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <span className="font-body">info@nutricionalcoach.com</span>
                </a>
                <a href="tel:+34655397061"
                   className="flex items-center text-gray-600 hover:text-primary transition-colors">
                  <span className="font-body">655 397 061</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-secondary p-8 rounded-xl shadow-lg">
            <h3 className="font-display text-2xl text-silver mb-6">ENVÍAME UN MENSAJE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-silver mb-2 font-body">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-silver mb-2 font-body">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-silver mb-2 font-body">Mensaje</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-accent py-3 rounded-lg font-display
                         hover:bg-opacity-90 transition-colors"
              >
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
