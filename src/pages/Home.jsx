import { Link } from 'react-router-dom';
import cachas from '../assets/cachas.png';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-accent py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary transform skew-x-12 -mr-32 opacity-80" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-6xl md:text-7xl mb-8 text-silver">
                DISEÑA TU CUERPO
              </h1>
              <p className="text-xl mb-8 font-body text-gray-300">
                Descubre el poder de una alimentación consciente y personalizada para alcanzar tus objetivos de salud y rendimiento.
              </p>
              <a 
                href="https://forms.gle/1PnXermhG98u8NZq6"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-3 font-display text-lg
                          bg-primary text-accent rounded-lg hover:bg-opacity-90 transition-colors"
              >
                EMPIEZA AHORA
              </a>
            </div>
            <div className="relative h-full">
              <div className="absolute right-0 top-0 bottom-0 w-full">
                <img
                  src={cachas}
                  alt="Transformación física"
                  className="absolute right-0 h-[140%] w-auto object-cover -rotate-90 transform 
                           origin-center scale-150"
                  style={{ marginRight: '-1px' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl text-secondary text-center mb-12">SERVICIOS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mejora tus Hábitos */}
            <Link to="/servicios/habitos" className="group">
              <div className="bg-secondary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg"
                    alt="Mejora tus hábitos"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4 text-silver">MEJORA TUS HÁBITOS</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Optimización del ciclo del sueño
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Control de la ansiedad alimentaria
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Desarrollo de hábitos saludables
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Consigue tus Objetivos */}
            <Link to="/servicios/objetivos" className="group">
              <div className="bg-primary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg"
                    alt="Consigue tus objetivos"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4">CONSIGUE TUS OBJETIVOS</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Preparación para oposiciones
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Competiciones deportivas
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Objetivos deportivos personalizados
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Composición Corporal */}
            <Link to="/servicios/composicion" className="group">
              <div className="bg-secondary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg"
                    alt="Composición corporal"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4 text-silver">COMPOSICIÓN CORPORAL</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Aumento de masa muscular
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Reducción de porcentaje graso
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Optimización del rendimiento físico
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Recupera tu Salud */}
            <Link to="/servicios/salud" className="group">
              <div className="bg-primary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg"
                    alt="Recupera tu salud"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4">RECUPERA TU SALUD</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Optimización hormonal
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Recuperación de marcadores
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Aumento de energía y vitalidad
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Asesoramiento Personalizado */}
            <Link to="/servicios/asesoramiento" className="group">
              <div className="bg-secondary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/4098228/pexels-photo-4098228.jpeg"
                    alt="Asesoramiento personalizado"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4 text-silver">ASESORAMIENTO PERSONALIZADO</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Planes nutricionales a medida
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Seguimiento continuo
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      Soporte nutricional personalizado
                    </li>
                  </ul>
                </div>
              </div>
            </Link>

            {/* Educación Nutricional */}
            <Link to="/servicios/educacion" className="group">
              <div className="bg-primary text-accent rounded-xl overflow-hidden transform hover:-translate-y-2 transition-transform">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/4397833/pexels-photo-4397833.jpeg"
                    alt="Educación nutricional"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity" />
                  <h3 className="font-display text-2xl absolute bottom-4 left-4">EDUCACIÓN NUTRICIONAL</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 font-body">
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Formación en nutrición básica
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Talleres prácticos de cocina
                    </li>
                    <li className="flex items-center">
                      <span className="text-silver mr-2">•</span>
                      Gestión de la alimentación diaria
                    </li>
                  </ul>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
