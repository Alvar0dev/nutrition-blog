import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading de componentes
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const HabitosPage = lazy(() => import('./pages/services/HabitosPage'));
const ObjetivosPage = lazy(() => import('./pages/services/ObjetivosPage'));
const ComposicionPage = lazy(() => import('./pages/services/ComposicionPage'));
const SaludPage = lazy(() => import('./pages/services/SaludPage'));
const AsesoramientoPage = lazy(() => import('./pages/services/AsesoramientoPage'));
const EducacionPage = lazy(() => import('./pages/services/EducacionPage'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/servicios/habitos" element={<HabitosPage />} />
              <Route path="/servicios/objetivos" element={<ObjetivosPage />} />
              <Route path="/servicios/composicion" element={<ComposicionPage />} />
              <Route path="/servicios/salud" element={<SaludPage />} />
              <Route path="/servicios/asesoramiento" element={<AsesoramientoPage />} />
              <Route path="/servicios/educacion" element={<EducacionPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
