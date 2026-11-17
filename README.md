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
4. **Ejecutar pruebas unitarias y linter:**
   ```bash
   npm test
   npm run lint
   ```
5. **Configurar variables de Firebase Auth (opcional en local hasta activar el portal):**
   Copiar `.env.example` a `.env` y rellenar las claves `PUBLIC_FIREBASE_*` del proyecto Firebase.

---

## Arquitectura y Decisiones Técnicas

| Área | Implementación | Referencia |
|---|---|---|
| **Renderizado** | Generación estática (SSG) con **Arquitectura de Islas**. El HTML se entrega pre-renderizado y solo se hidratan los componentes con estado o interactividad. | [`docs/ADR-001-migracion-arquitectura-islas.md`](docs/ADR-001-migracion-arquitectura-islas.md) |
| **Enrutamiento y Contenidos** | Enrutamiento nativo basado en archivos bajo `src/pages/` y artículos gestionados con **Astro Content Layer API** (`src/content.config.ts` + Markdown tipado con Zod). | `src/pages/`, `src/content/blog/` |
| **Imágenes (`astro:assets`)** | Todas las imágenes locales y remotas (`images.pexels.com`) se redimensionan y codifican a **WebP** en tiempo de compilación con `width` y `height` explícitos (CLS ≈ 0). | [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md) |
| **Tipografías locales** | `Poppins` (`400`, `600`, `700`) y `Permanent Marker` auto-hospedadas mediante `@fontsource` en `/_astro/*.woff2` (`font-display: swap`), con cero peticiones externas a Google Fonts. | [`src/styles/global.css`](src/styles/global.css) |
| **SEO y Datos Estructurados** | `<html lang="es">`, URLs canónicas, Open Graph (`es_ES`), Twitter Cards, Schema.org JSON-LD (`HealthAndBeautyBusiness` + `Person`), `sitemap.xml` dinámico y `robots.txt`. | [`src/components/BaseHead.astro`](src/components/BaseHead.astro) |
| **Portal Clientes (Auth)** | Isla `AuthIsland.jsx` (`client:load`) con Firebase Auth aislada en `/login` (`noindex`), manteniendo `AuthPlaceholder.jsx` estático (0 KB JS) en `/contacto`. | [`src/components/AuthIsland.jsx`](src/components/AuthIsland.jsx), [`src/lib/firebase.js`](src/lib/firebase.js) |
| **Pruebas Unitarias** | Validación de formularios, detección de placeholders y mapeo de errores Firebase en español ejecutados con el runner nativo `node --test`. | [`tests/auth.test.js`](tests/auth.test.js), [`src/lib/authHelpers.js`](src/lib/authHelpers.js) |
| **Caché CDN Inmutable** | Reglas multi-proveedor (`public/_headers` para Cloudflare Pages y `vercel.json` para Vercel) con caché inmutable de 1 año en `/_astro/*` y revalidación inmediata en HTML y sitemap. | `public/_headers`, `vercel.json` |
| **Control de Calidad (QA)** | Auditoría técnica y visual sobre las 21 rutas estáticas (escritorio `1280×800` y móvil `375×812`), corrección de proporciones del logo, navegación fluida y WCAG 2.1 AA. | [`docs/QA_AUDIT.md`](docs/QA_AUDIT.md) |

---

## Estructura del Proyecto

```text
nutrition-blog/
├── .env.example                     # Plantilla de variables públicas PUBLIC_FIREBASE_*
├── astro.config.mjs                 # Configuración de Astro 7, React y dominios de imágenes
├── tailwind.config.js               # Tema visual (colores corporativos y familias tipográficas)
├── postcss.config.js                # Pipeline PostCSS (Tailwind CSS + Autoprefixer)
├── vercel.json                      # Cabeceras HTTP de caché inmutable y revalidación para Vercel
├── docs/
│   ├── ADR-001-migracion-arquitectura-islas.md
│   ├── PERFORMANCE_AUDIT.md
│   ├── POST_PRODUCTION_ROADMAP.md
│   ├── PLAN_FASE_2_EJECUCION.md
│   └── QA_AUDIT.md
├── public/
│   ├── _headers                     # Cabeceras HTTP de caché inmutable para Cloudflare Pages
│   ├── favicon.svg
│   └── robots.txt
├── tests/
│   └── auth.test.js                 # Pruebas unitarias nativas (node --test) para helpers y SSR Auth
└── src/
    ├── content.config.ts            # Colección de contenidos (Astro 7 Content Layer + Zod)
    ├── assets/                      # Activos gráficos originales procesados por astro:assets
    ├── content/
    │   └── blog/                    # 9 artículos de divulgación nutricional en Markdown
    ├── lib/
    │   ├── authHelpers.js           # Validación de credenciales, config y errores Firebase en español
    │   ├── firebase.js              # Inicialización segura de Firebase Auth (solo navegador)
    │   └── posts.js                 # Fuente única de verdad (filtrado, ordenación y tiempo de lectura)
    ├── components/
    │   ├── BaseHead.astro           # Metadatos SEO, JSON-LD, canonical, Open Graph y Twitter Cards
    │   ├── Footer.astro             # Pie de página estático con logotipo WebP y contacto
    │   ├── ServiceCard.astro        # Tarjeta reutilizable de servicios (0 JS)
    │   ├── Navbar.jsx               # Isla React (client:visible) con menú móvil accesible
    │   ├── ContactForm.jsx          # Isla React (client:load) con envío por WhatsApp y Email
    │   ├── AuthIsland.jsx           # Isla React (client:load) con Firebase Auth exclusiva en /login
    │   └── AuthPlaceholder.jsx      # Marcador estático (0 JS) en /contacto
    ├── layouts/
    │   └── Layout.astro             # Layout maestro con <html lang="es"> y skip-to-content
    ├── pages/
    │   ├── index.astro              # Portada (Hero + resumen de servicios)
    │   ├── 404.astro                # Vista de error 404 personalizada (noindex y recuperación)
    │   ├── blog/                    # Catálogo general (index.astro) y artículos dinámicos ([slug].astro)
    │   ├── contacto.astro           # Perfil profesional y formulario de contacto
    │   ├── login.astro              # Área de acceso de clientes con AuthIsland (noindex)
    │   ├── sitemap.xml.js           # Generador estático de Sitemap XML (19 URLs públicas)
    │   └── servicios/               # Catálogo general y 6 páginas de especialidad
    └── styles/
        └── global.css               # Fuentes @fontsource, estilos prose-article y Tailwind CSS
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

Para ver el detalle completo de compresión de imágenes consulta [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md), el informe de calidad y maquetación en [`docs/QA_AUDIT.md`](docs/QA_AUDIT.md), la hoja de ruta en [`docs/POST_PRODUCTION_ROADMAP.md`](docs/POST_PRODUCTION_ROADMAP.md), el plan operativo de trabajo en [`docs/PLAN_FASE_2_EJECUCION.md`](docs/PLAN_FASE_2_EJECUCION.md) y el historial de versiones en [`CHANGELOG.md`](CHANGELOG.md).
