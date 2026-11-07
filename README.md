# Nutricional Coach — Plataforma Web (Astro Islands)

Sitio web corporativo y blog de divulgación de **Nutricional Coach (Álvaro Aguilar)**, construido sobre **Astro 7**, **React 18** (arquitectura de islas) y **Tailwind CSS 3**. Diseñado para ofrecer carga instantánea (cero JavaScript por defecto en vistas de contenido), SEO técnico completo en español y **100/100 en Lighthouse Performance y SEO**.

---

## Ruta rápida (Quick Start)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Levantar entorno de desarrollo (`http://localhost:4321`):**
   ```bash
   npm run dev
   ```
3. **Generar y previsualizar el build estático de producción:**
   ```bash
   npm run build
   npm run preview
   ```

---

## Arquitectura y Decisiones Técnicas

| Área | Implementación | Referencia |
|---|---|---|
| **Renderizado** | Generación estática (SSG) con **Arquitectura de Islas**. El HTML se entrega pre-renderizado y solo se hidratan los componentes con estado o interactividad. | [`docs/ADR-001-migracion-arquitectura-islas.md`](docs/ADR-001-migracion-arquitectura-islas.md) |
| **Enrutamiento** | Enrutamiento nativo basado en archivos bajo `src/pages/` con enlaces HTML estándar (`<a>`), sin dependencias de enrutamiento en cliente. | `src/pages/` |
| **Imágenes (`astro:assets`)** | Todas las imágenes locales y remotas (`images.pexels.com`) se redimensionan y codifican a **WebP** en tiempo de compilación con `width` y `height` explícitos (CLS ≈ 0). | [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md) |
| **Tipografías locales** | `Poppins` y `Permanent Marker` auto-hospedadas mediante `@fontsource` en `/_astro/*.woff2` (`font-display: swap`), con cero peticiones externas a Google Fonts. | [`src/styles/global.css`](src/styles/global.css) |
| **SEO y Metadatos** | `<html lang="es">`, URLs canónicas, Open Graph (`es_ES`), Twitter Cards y `robots.txt` gestionados de forma centralizada. | [`src/components/BaseHead.astro`](src/components/BaseHead.astro) |
| **Extensibilidad Auth** | Isla `AuthPlaceholder.jsx` (`client:load`) lista para conectar `firebase/auth` en `/login` y `/contacto` sin penalizar el bundle actual. | [`src/components/AuthPlaceholder.jsx`](src/components/AuthPlaceholder.jsx) |

---

## Estructura del Proyecto

```text
nutrition-blog/
├── astro.config.mjs                 # Configuración de Astro 7, React y dominios de imágenes
├── tailwind.config.js               # Tema visual (colores corporativos y familias tipográficas)
├── postcss.config.js                # Pipeline PostCSS (Tailwind CSS + Autoprefixer)
├── docs/
│   ├── ADR-001-migracion-arquitectura-islas.md
│   ├── PERFORMANCE_AUDIT.md
│   └── POST_PRODUCTION_ROADMAP.md
├── public/
│   ├── robots.txt
│   └── vite.svg
└── src/
    ├── assets/                      # Activos gráficos originales procesados por astro:assets
    ├── components/
    │   ├── BaseHead.astro           # Metadatos SEO, canonical, Open Graph y Twitter Cards
    │   ├── Footer.astro             # Pie de página estático con logotipos WebP
    │   ├── ServiceCard.astro        # Tarjeta reutilizable de servicios (0 JS)
    │   ├── Navbar.jsx               # Isla React (client:visible) para navegación principal
    │   ├── ContactForm.jsx          # Isla React (client:load) con estado controlado
    │   └── AuthPlaceholder.jsx      # Isla React (client:load) para futura autenticación
    ├── layouts/
    │   └── Layout.astro             # Layout maestro con <html lang="es">
    ├── pages/
    │   ├── index.astro              # Portada (Hero + resumen de servicios)
    │   ├── blog.astro               # Artículos de nutrición
    │   ├── contacto.astro           # Perfil profesional y formulario de contacto
    │   ├── login.astro              # Área de acceso de clientes
    │   └── servicios/               # Catálogo general y 6 páginas de especialidad
    └── styles/
        └── global.css               # Fuentes @fontsource y directivas de Tailwind CSS
```

---

## Métricas de Rendimiento Verificadas (Lighthouse)

Resultados medidos sobre el build de producción (`dist/`):

| Ruta | Performance | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` | **100** | **100** | `0.2 s` | `0.5 s` | `0 ms` | `0.015` |
| `/blog` | **100** | **100** | `0.2 s` | `0.5 s` | `0 ms` | `0.000` |
| `/contacto` | **100** | **100** | `0.2 s` | `0.4 s` | `0 ms` | `0.005` |
| `/servicios` | **100** | **100** | `0.2 s` | `0.4 s` | `0 ms` | `0.001` |

Para ver el detalle completo de compresión de imágenes consulta [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md), las mejoras planificadas en [`docs/POST_PRODUCTION_ROADMAP.md`](docs/POST_PRODUCTION_ROADMAP.md) y el historial de versiones en [`CHANGELOG.md`](CHANGELOG.md).
