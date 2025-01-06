import { Link } from 'react-router-dom';
import logo from '../assets/LOGO.png'; // Actualizando el nombre del archivo

export default function Navbar() {
  return (
    <nav className="bg-secondary text-accent shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center group">
            <div className="w-48 hover:scale-105 transition-transform duration-300">
              <img 
                src={logo} 
                alt="Nutricional Coach" 
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" 
                  className="text-accent hover:text-primary transition-colors relative group font-display">
              INICIO
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="/blog" 
                  className="text-accent hover:text-primary transition-colors relative group font-display">
              BLOG
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="/servicios" 
                  className="text-accent hover:text-primary transition-colors relative group font-display">
              SERVICIOS
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link to="/contacto" 
                  className="text-accent hover:text-primary transition-colors relative group font-display">
              CONTACTO
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
