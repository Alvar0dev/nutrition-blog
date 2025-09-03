const links = [
  { href: '/', label: 'INICIO' },
  { href: '/blog', label: 'BLOG' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/contacto', label: 'CONTACTO' },
];

export default function Navbar({ children }) {
  return (
    <nav className="bg-secondary text-accent shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <a href="/" className="flex items-center group">
            <div className="w-48 hover:scale-105 transition-transform duration-300">
              {children}
            </div>
          </a>

          <div className="hidden md:flex space-x-8">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-accent hover:text-primary transition-colors relative group font-display"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
