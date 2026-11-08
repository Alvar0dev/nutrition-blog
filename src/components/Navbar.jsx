import { useState } from 'react';

const links = [
  { href: '/', label: 'INICIO' },
  { href: '/blog', label: 'BLOG' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/contacto', label: 'CONTACTO' },
];

export default function Navbar({ children, pathname = '/' }) {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav aria-label="Navegación principal" className="bg-secondary text-accent shadow-md relative z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <a href="/" className="flex items-center group" aria-label="Nutricional Coach - Ir al inicio">
            <div className="w-40 sm:w-48 hover:scale-105 transition-transform duration-300">
              {children}
            </div>
          </a>

          {/* Navegación de escritorio */}
          <div className="hidden md:flex space-x-8">
            {links.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`transition-colors relative group font-display py-1 ${
                    active ? 'text-primary' : 'text-accent hover:text-primary'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  ></span>
                </a>
              );
            })}
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-accent hover:text-primary hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panel desplegable móvil */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden bg-secondary border-t border-accent/10 px-4 pt-2 pb-6 space-y-2 shadow-xl"
        >
          {links.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <a
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-display text-lg transition-colors ${
                  active
                    ? 'bg-primary/15 text-primary border-l-4 border-primary'
                    : 'text-accent hover:bg-white/5 hover:text-primary'
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
