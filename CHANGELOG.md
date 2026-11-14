# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [Versionado Semántico](https://semver.org/lang/es/).

---

## [1.2.2] - 2026-11-14

### Añadido
- Página 404 personalizada `src/pages/404.astro` (`/404.html`) integrada con `Layout.astro`, directiva `noindex` y botones de recuperación hacia `/`, `/servicios` y `/blog`.
- Documento técnico integral de control de calidad `docs/QA_AUDIT.md` con el registro de 7 hallazgos detectados, sus causas raíz y soluciones aplicadas en las 21 rutas estáticas.

### Corregido
- Relación de aspecto del logotipo en `src/layouts/Layout.astro` y `src/components/Footer.astro`, recalculando dimensiones a 384×95 px (proporción 4.04:1 en WebP) para eliminar el recorte cuadrado ("RICIC COACH") y el desbordamiento vertical de 96 px sobre el contenido.
- Enlaces de retorno "← Volver a Servicios" en las seis páginas de detalle (`src/pages/servicios/{habitos,objetivos,composicion,salud,asesoramiento,educacion}.astro`), redirigiendo correctamente a `/servicios` en vez de a `/`.
- Colapso a 0 px de la imagen Hero (`cachas.png`) en vista móvil (`< 768px`) en `src/pages/index.astro`, fijando `min-h-[280px] sm:min-h-[340px]` en su contenedor relative.
- Manejadores de eventos de teclado y redimensionamiento en `src/components/Navbar.jsx` para cerrar el menú desplegable móvil al pulsar `Escape` o al expandir la ventana a escritorio (`>= 768px`).
- Foco por teclado en el cuerpo principal (`<main id="main-content">`) en `src/layouts/Layout.astro` mediante `tabindex="-1"` y clase `outline-none` para el enlace de salto accesible.
- Validación reactiva en `src/components/ContactForm.jsx` para detectar entradas con solo espacios en blanco, mostrando una alerta visual y accesible (`role="alert"`).
- Normalización semántica de encabezados `H1` → `H2` → `H3` en `/servicios`, en las 6 especialidades de servicios y en `/contacto`.
- Unificación visual de la rejilla e imágenes en `src/pages/servicios/habitos.astro` a `h-64` y `md:grid-cols-3` en concordancia con el resto de servicios.
- Priorización de carga sobre el pliegue (`loading="eager"` / `fetchpriority="high"`) en imágenes principales de servicios y catálogo de blog, además de mejorar el contraste tipográfico de fechas en `src/pages/blog/index.astro` a `text-gray-400`.

---

## [1.2.1] - 2026-11-13

### Añadido
- Reglas de cabeceras HTTP en `public/_headers` (Cloudflare Pages) y `vercel.json` (Vercel) con política de caché inmutable de 1 año (`max-age=31536000, immutable`) para `/_astro/*`, revalidación inmediata (`max-age=0, must-revalidate`) para documentos HTML y `max-age=3600, must-revalidate` para `/sitemap.xml`.
- Documentación técnica ampliada sobre dificultades de portabilidad multi-CDN y justificación arquitectónica en `docs/ADR-001-migracion-arquitectura-islas.md`, `docs/PLAN_FASE_2_EJECUCION.md` y `docs/POST_PRODUCTION_ROADMAP.md`.

---

## [1.2.0] - 2026-11-10

### Añadido
- Colección de contenidos tipada `src/content.config.ts` usando la Content Layer API de Astro 7 (`glob` loader y esquema Zod).
- 9 artículos propios en Markdown bajo `src/content/blog/*.md` con frontmatter validado, tiempo de lectura estimado y etiquetas temáticas.
- Ruta dinámica `src/pages/blog/[slug].astro` con migas de pan accesibles, imagen hero en WebP (`1200×600`), datos estructurados Schema.org `BlogPosting` por artículo y bloque CTA de conversión directa (Google Forms y WhatsApp).
- Módulo de utilidades `src/lib/posts.js` como fuente única de verdad para el filtrado de borradores, ordenación cronológica y cálculo de tiempo de lectura.

### Optimizado
- Catálogo `src/pages/blog/index.astro` migrado de enlaces externos a rutas internas `/blog/[slug]`, reteniendo el tráfico y la autoridad SEO dentro del dominio `nutricionalcoach.com`.
- Generador `src/pages/sitemap.xml.js` ampliado para indexar automáticamente todos los artículos publicados con su fecha exacta `lastmod` (19 URLs públicas en total).

---

## [1.1.0] - 2026-11-08

### Añadido
- Menú de navegación móvil desplegable y accesible (`aria-expanded`, `aria-controls`, `aria-current="page"`) en `src/components/Navbar.jsx`.
- Enlace de accesibilidad *skip-to-content* (`#main-content`) en `src/layouts/Layout.astro` conforme a WCAG 2.1.
- Generador estático de mapa del sitio `src/pages/sitemap.xml.js` y referencia `Sitemap` en `public/robots.txt`.
- Datos estructurados Schema.org JSON-LD (`HealthAndBeautyBusiness`, `Person` y `WebSite`) en `src/components/BaseHead.astro`.
- Isotipo vectorial corporativo `public/favicon.svg`.
- Estado de confirmación interactivo en `src/components/ContactForm.jsx` con envío directo pre-formateado por WhatsApp y correo electrónico.

### Optimizado
- Enrutamiento de CTAs de servicios hacia el formulario de evaluación en Google Forms (`habitos`, `objetivos`, `composicion`, `salud`) y contacto directo por WhatsApp (`asesoramiento`, `educacion`).
- Deshidratación de `src/components/AuthPlaceholder.jsx` en `/contacto` y `/login` para evitar carga de JavaScript en cliente mientras Firebase Auth no esté activo.
- Importación explícita de los pesos tipográficos `400`, `600` y `700` de `@fontsource/poppins` en `src/styles/global.css`.

### Eliminado
- Dependencias sin uso en el código fuente (`@heroicons/react`, `@vitejs/plugin-react`, `eslint-plugin-react-refresh`, `vite`).
- Activos huérfanos de la plantilla inicial (`public/vite.svg`, `src/assets/alvaro-profile.jpg`, `src/assets/muscles.jpg`, `src/assets/logo-completo.svg`, `src/assets/react.svg`).

---

## [1.0.0] - 2026-11-04

### Añadido
- Documentación arquitectónica completa (`docs/ADR-001-migracion-arquitectura-islas.md` y `docs/PERFORMANCE_AUDIT.md`).
- Archivo `public/robots.txt` para directivas de indexación de motores de búsqueda.
- Ruta `/login` (`src/pages/login.astro`) e isla `src/components/AuthPlaceholder.jsx` (`client:load`) como punto de extensión preparado para futura autenticación de clientes con Firebase Auth.

### Optimizado
- Autorización del dominio `images.pexels.com` en el pipeline de imágenes de `astro.config.mjs`, compilando las 29 fotografías remotas (de 544 KB–6.2 MB a 3 KB–27 KB en WebP).
- Priorización de elementos LCP (`loading="eager"` y `fetchpriority="high"`) en las vistas principales, alcanzando **100/100 en Lighthouse Performance y SEO** en `/`, `/blog`, `/contacto` y `/servicios`.

---

## [0.8.0] - 2026-09-06

### Eliminado
- Punto de entrada de la antigua SPA en React (`src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/index.css`, `index.html` de raíz y `vite.config.js`).

---

## [0.7.0] - 2026-05-27

### Añadido
- Isla interactiva `src/components/ContactForm.jsx` (`client:load`) con estado controlado para el formulario de contacto.
- Nueva página estática `src/pages/contacto.astro` con compresión del retrato `yo.png` de **17.4 MB a 16.3 KB WebP**.

---

## [0.6.0] - 2026-04-02

### Añadido
- Migración completa del catálogo de servicios (`src/pages/servicios/index.astro`) y de las seis páginas de detalle (`habitos`, `objetivos`, `composicion`, `salud`, `asesoramiento` y `educacion`) a plantillas nativas de Astro con `<Image>` de `astro:assets`.

---

## [0.5.0] - 2025-12-14

### Añadido
- Migración de la vista de artículos `src/pages/blog.astro` y de la portada `src/pages/index.astro`.
- Extracción del componente estático reutilizable `src/components/ServiceCard.astro` con variantes de color (`dark` / `primary`).

---

## [0.4.0] - 2025-09-03

### Cambiado
- Conversión de `Footer` a componente estático `src/components/Footer.astro` con logotipos optimizados en WebP y enlaces sociales rastreables.
- Desacoplamiento de `src/components/Navbar.jsx` respecto a `react-router-dom`, utilizando enlaces estándar `<a>` e hidratación diferida (`client:visible`).

---

## [0.3.0] - 2025-07-12

### Añadido
- Componente `src/components/BaseHead.astro` con soporte para URLs canónicas, metadatos dinámicos en español (`es_ES`), Open Graph y Twitter Cards.
- Plantilla maestra `src/layouts/Layout.astro` con `<html lang="es">` y estructura semántica `<main class="flex-grow">`.

---

## [0.2.0] - 2025-05-24

### Añadido
- Configuración base de **Astro** (`astro.config.mjs`, `src/env.d.ts`) e integración `@astrojs/react`.
- Hoja de estilos global `src/styles/global.css` con tipografías auto-hospedadas (`@fontsource/poppins` y `@fontsource/permanent-marker`), eliminando las peticiones bloqueantes a Google Fonts.

---

## [0.1.0] - 2025-01-06

### Añadido
- Versión inicial del portal como Single Page Application con React 18, Vite 6, Tailwind CSS 3 y React Router DOM 7.
