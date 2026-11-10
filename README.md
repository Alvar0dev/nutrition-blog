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
| **Enrutamiento y Contenidos** | Enrutamiento nativo basado en archivos bajo `src/pages/` y artículos gestionados con **Astro Content Layer API** (`src/content.config.ts` + Markdown tipado con Zod). | `src/pages/`, `src/content/blog/` |
| **Imágenes (`astro:assets`)** | Todas las imágenes locales y remotas (`images.pexels.com`) se redimensionan y codifican a **WebP** en tiempo de compilación con `width` y `height` explícitos (CLS ≈ 0). | [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md) |
| **Tipografías locales** | `Poppins` (`400`, `600`, `700`) y `Permanent Marker` auto-hospedadas mediante `@fontsource` en `/_astro/*.woff2` (`font-display: swap`), con cero peticiones externas a Google Fonts. | [`src/styles/global.css`](src/styles/global.css) |
| **SEO y Datos Estructurados** | `<html lang="es">`, URLs canónicas, Open Graph (`es_ES`), Twitter Cards, Schema.org JSON-LD (`HealthAndBeautyBusiness` + `Person`), `sitemap.xml` dinámico y `robots.txt`. | [`src/components/BaseHead.astro`](src/components/BaseHead.astro) |
| **Extensibilidad Auth** | Punto de extensión `AuthPlaceholder.jsx` renderizado sin sobrecarga de JS en `/login` y `/contacto`, listo para conectar `firebase/auth` cuando se active el portal de clientes. | [`src/components/AuthPlaceholder.jsx`](src/components/AuthPlaceholder.jsx) |

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
│   ├── POST_PRODUCTION_ROADMAP.md
│   └── PLAN_FASE_2_EJECUCION.md
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── content.config.ts            # Colección de contenidos (Astro 7 Content Layer + Zod)
    ├── assets/                      # Activos gráficos originales procesados por astro:assets
    ├── content/
    │   └── blog/                    # 9 artículos de divulgación nutricional en Markdown
    ├── lib/
    │   └── posts.js                 # Fuente única de verdad (filtrado, ordenación y tiempo de lectura)
    ├── components/
    │   ├── BaseHead.astro           # Metadatos SEO, JSON-LD, canonical, Open Graph y Twitter Cards
    │   ├── Footer.astro             # Pie de página estático con logotipo WebP y contacto
    │   ├── ServiceCard.astro        # Tarjeta reutilizable de servicios (0 JS)
    │   ├── Navbar.jsx               # Isla React (client:visible) con menú móvil accesible
    │   ├── ContactForm.jsx          # Isla React (client:load) con envío por WhatsApp y Email
    │   └── AuthPlaceholder.jsx      # Punto de extensión para futura autenticación Firebase
    ├── layouts/
    │   └── Layout.astro             # Layout maestro con <html lang="es"> y skip-to-content
    ├── pages/
    │   ├── index.astro              # Portada (Hero + resumen de servicios)
    │   ├── blog/                    # Catálogo general (index.astro) y artículos dinámicos ([slug].astro)
    │   ├── contacto.astro           # Perfil profesional y formulario de contacto
    │   ├── login.astro              # Área de acceso de clientes (noindex)
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

Para ver el detalle completo de compresión de imágenes consulta [`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md), la hoja de ruta en [`docs/POST_PRODUCTION_ROADMAP.md`](docs/POST_PRODUCTION_ROADMAP.md), el plan operativo de trabajo en [`docs/PLAN_FASE_2_EJECUCION.md`](docs/PLAN_FASE_2_EJECUCION.md) y el historial de versiones en [`CHANGELOG.md`](CHANGELOG.md).
