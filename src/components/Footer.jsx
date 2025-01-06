import logo from '../assets/LOGO.png';

export default function Footer() {
  return (
    <footer className="bg-secondary text-accent">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="w-48 mb-6">
              <img 
                src={logo} 
                alt="Nutricional Coach" 
                className="w-full h-auto"
              />
            </div>
            <p className="font-body text-accent">
              Transformando vidas a través de la nutrición personalizada y consciente.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xl mb-6 text-accent">ENLACES</h4>
            <ul className="space-y-4 font-body">
              <li>
                <a href="/blog" className="text-accent hover:text-primary transition-colors">
                  BLOG
                </a>
              </li>
              <li>
                <a href="/servicios" className="text-accent hover:text-primary transition-colors">
                  SERVICIOS
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-accent hover:text-primary transition-colors">
                  CONTACTO
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xl mb-6 text-accent">CONTACTO</h4>
            <ul className="space-y-4 font-body text-accent">
              <li>
                <a href="mailto:alvaroaguilarcejas@hotmail.com" className="hover:text-primary transition-colors">
                  alvaroaguilarcejas@hotmail.com
                </a>
              </li>
              <li>
                <a href="mailto:info@nutricionalcoach.com" className="hover:text-primary transition-colors">
                  info@nutricionalcoach.com
                </a>
              </li>
              <li>
                <a href="tel:+34655397061" className="hover:text-primary transition-colors">
                  655 397 061
                </a>
              </li>
              <li>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-accent hover:text-primary transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="text-accent hover:text-primary transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="text-accent hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-accent/20 flex flex-col items-center">
          <div className="w-32 mb-4">
            <img 
              src={logo} 
              alt="Nutricional Coach" 
              className="w-full h-auto opacity-50"
            />
          </div>
          <p className="text-center text-accent font-body">
            &copy; {new Date().getFullYear()} Nutricional Coach. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
