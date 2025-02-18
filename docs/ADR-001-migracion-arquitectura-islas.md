# ADR-001: Migración de SPA (React + Vite) a Arquitectura de Islas con Astro

- **Estado:** Aceptado e implementado
- **Fecha inicial:** 2025-02-18
- **Última revisión:** 2026-10-18
- **Responsable:** Álvaro Aguilar

---

## Resumen ejecutivo

Se decidió migrar el portal web de **Nutricional Coach** desde una Single Page Application (React 18 + Vite 6 + React Router DOM 7) hacia una arquitectura estática de islas con **Astro 7**, **React 18** (hidratación selectiva) y **Tailwind CSS 3** vía PostCSS. El cambio eliminó el bloqueo de renderizado en cliente, redujo el peso de activos críticos en un **99.9%** (`yo.png` pasó de 17 MB a 16.3 KB WebP) y llevó todas las rutas principales a **100/100 en Lighthouse Performance y SEO**.

---

## 1. Contexto y problemática detectada

Durante la auditoría técnica inicial sobre la primera versión en React + Vite se identificaron seis cuellos de botella estructurales:

| Área | Problema técnico en la SPA original | Impacto medido |
|---|---|---|
| **Renderizado (CSR)** | Todo el contenido dependía de `BrowserRouter` y `React.lazy()` en el cliente. | HTML inicial vacío (`<div id="root"></div>`), penalizando indexación y FCP. |
| **SEO y metadatos** | Único `index.html` con `<html lang="en">`, `<title>Vite + React</title>` y sin etiquetas Open Graph ni `canonical`. | Nula visibilidad semántica por ruta para buscadores y redes sociales. |
| **Activos locales sobredimensionados** | `src/assets/yo.png` se servía en crudo con **17.45 MB** y `src/assets/cachas.png` con **532 KB**. | Tiempo de descarga inaceptable en conexiones móviles en `/contacto` y `/`. |
| **Imágenes externas sin dimensiones** | 29 fotografías servidas directamente desde `images.pexels.com` (entre 544 KB y 6.2 MB por archivo) sin `width`/`height` uniformes. | Desplazamiento acumulativo del diseño (CLS) y elevado LCP en `/blog` y `/servicios`. |
| **Tipografías en red** | Dependencia de hojas de estilo externas para `Permanent Marker` y `Poppins`. | Peticiones bloqueantes de renderizado hacia servidores de terceros. |
| **JavaScript innecesario** | Páginas 100% informativas (Home, Blog, Servicios y subpáginas) descargaban el runtime completo de React y React Router. | Mayor Total Blocking Time (TBT) sin interactividad real que lo justificara. |

---

## 2. Alternativas evaluadas

| Opción | Ventajas | Desventajas | Decisión |
|---|---|---|---|
| **1. Optimizar la SPA actual (Vite + React Helmet + compresión manual)** | Menor cambio estructural inicial. | Mantiene CSR, requiere hidratar todo el árbol DOM y no resuelve la indexación nativa sin prerender complejo. | Descartada |
| **2. Migrar a Next.js (App Router)** | Buen soporte SSR/SSG e imágenes. | Sobrecarga de runtime de React en todas las rutas para un sitio predominantemente de contenido estático. | Descartada |
| **3. Migrar a Astro con Arquitectura de Islas (React selectivo)** | Cero JS por defecto en rutas estáticas, pipeline nativo `astro:assets` (WebP) y reutilización directa de componentes React interactivos. | Requiere convertir plantillas `.jsx` estáticas a `.astro`. | **Seleccionada** |

---

## 3. Decisiones técnicas clave

### 3.1. Enrutamiento basado en archivos y eliminación de `react-router-dom`
- Se reemplazaron las rutas dinámicas en cliente (`<Routes>`, `<Route>`, `<Link>`) por el sistema de archivos estático en `src/pages/` y enlaces nativos `<a href="...">`.
- **Resolución de conflicto de dependencias (`cookie`):** `react-router-dom@7.1.1` elevaba a la raíz `cookie@1.0.2` (CommonJS sin export nombrado `parseCookie`), mientras que el prerenderizador de Astro 7 requiere `cookie@^2.0.1`. La desinstalación definitiva de `react-router-dom` dejó un árbol de dependencias limpio con una única versión `cookie@2.0.1`.

### 3.2. Tailwind CSS 3 sobre el pipeline PostCSS nativo de Vite
- La integración `@astrojs/tailwind@6` quedó deprecada para versiones superiores a Astro 5 (conflicto de `peerDependencies`).
- Se optó por mantener **Astro 7** y procesar **Tailwind CSS 3.4.17** directamente a través del pipeline PostCSS nativo de Vite (`postcss.config.js` con `tailwindcss` y `autoprefixer`), preservando intacta la paleta de colores (`primary`, `secondary`, `silver`, `accent`) y las familias tipográficas en `tailwind.config.js`.

### 3.3. Hidratación selectiva en Islas
Solo permanecen como componentes `.jsx` aquellos con interactividad o puntos de extensión en cliente:
1. `src/components/Navbar.jsx` (`client:visible`): barra de navegación superior que recibe el logotipo pre-optimizado por Astro mediante composición (`children`).
2. `src/components/ContactForm.jsx` (`client:load`): formulario controlado con `useState` en `/contacto`.
3. `src/components/AuthPlaceholder.jsx` (`client:load`): punto de montaje desacoplado para la futura integración de autenticación de clientes (`firebase/auth`) en `/contacto` y `/login`.

### 3.4. Pipeline de imágenes (`astro:assets`) y fuentes auto-hospedadas (`@fontsource`)
- Todas las imágenes locales y las 29 fotografías remotas de Pexels (autorizadas mediante `image.domains: ['images.pexels.com']` en `astro.config.mjs`) se procesan en tiempo de compilación a formato **WebP** con dimensiones `width` y `height` explícitas.
- Las fuentes `Poppins` y `Permanent Marker` se sirven desde paquetes locales `@fontsource/*` compilados en `/_astro/*.woff2` con `font-display: swap`.
