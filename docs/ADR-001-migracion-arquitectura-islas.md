# ADR-001: Migración de SPA (React + Vite) a Arquitectura de Islas con Astro

- **Estado:** Aceptado e implementado (`v1.2.0`)
- **Fecha inicial:** 2025-02-18
- **Última revisión:** 2026-11-12
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

## 3. Decisiones arquitectónicas y por qué se construyó así

### 3.1. Enrutamiento basado en archivos y eliminación de `react-router-dom`
- **Por qué:** Un portal corporativo y de contenidos nutricionales requiere que cada URL entregue un documento HTML completo e indexable desde el primer byte (SSG).
- **Implementación:** Se reemplazaron las rutas dinámicas en cliente (`<Routes>`, `<Route>`, `<Link>`) por el sistema de archivos estático en `src/pages/` y enlaces nativos `<a href="...">`.

### 3.2. Tailwind CSS 3 sobre el pipeline PostCSS nativo de Vite
- **Por qué:** Mantener el motor más reciente de Astro 7 sin depender de wrappers intermedios obsoletos y conservar intacto el sistema de diseño existente (`primary: #8B0000`, `secondary: #111111`, `silver: #C0C0C0`, `accent: #FFFFFF`).
- **Implementación:** Se configuró `postcss.config.js` con `tailwindcss` y `autoprefixer`, permitiendo que el compilador interno de Vite en Astro 7 purgue y minifique el CSS automáticamente.

### 3.3. Hidratación selectiva en Islas (Island Architecture)
- **Por qué:** Enviar JavaScript al navegador solo está justificado cuando existe estado mutable o eventos de usuario.
- **Implementación:**
  1. `src/components/Navbar.jsx` (`client:visible`): isla interactiva encargada de gestionar la apertura/cierre del menú móvil accesible (`isOpen`, `aria-expanded`) y resaltar la ruta activa (`aria-current="page"`).
  2. `src/components/ContactForm.jsx` (`client:load`): isla interactiva con estado controlado (`useState`), validación de entradas y despacho directo pre-formateado hacia WhatsApp o cliente de correo.
  3. `src/components/AuthPlaceholder.jsx` (renderizado estático sin directiva `client:*` por defecto): mantiene el punto de montaje `[data-auth-placeholder]` documentado en `/contacto` y `/login` con **0 KB de JavaScript** hasta que se active `firebase/auth`.

### 3.4. Pipeline de imágenes (`astro:assets`) y fuentes auto-hospedadas (`@fontsource`)
- **Por qué:** Depender de Google Fonts o de imágenes remotas sin procesar rompe la privacidad, introduce saltos visuales (CLS) y degrada el LCP en redes móviles.
- **Implementación:**
  - Todas las imágenes locales y las 29 fotografías remotas de Pexels se procesan en tiempo de compilación a formato **WebP** con dimensiones `width` y `height` explícitas.
  - Las fuentes `Poppins` (`400`, `600`, `700`) y `Permanent Marker` se sirven desde paquetes locales `@fontsource/*` compilados en `/_astro/*.woff2` con `font-display: swap` y `unicode-range`.

---

## 4. Dificultades técnicas encontradas y resolución de ingeniería

Durante la construcción y migración del proyecto surgieron seis desafíos técnicos relevantes que condicionaron el diseño final:

### 4.1. Incompatibilidad de `@astrojs/tailwind` con Astro 7 (`ERESOLVE`)
- **Problema:** Al instalar `astro@^7.4.5`, el paquete oficial `@astrojs/tailwind@6.0.2` bloqueaba la resolución de dependencias porque su `peerDependencies` solo admitía hasta Astro 5.
- **Solución:** Se descartó el uso de `--legacy-peer-deps` para no comprometer la reproducibilidad del entorno. Se desinstaló `@astrojs/tailwind` y se delegó el procesamiento de Tailwind CSS 3 directamente al pipeline PostCSS nativo de Vite (`postcss.config.js`), logrando integración nativa sin advertencias.

### 4.2. Colisión CJS/ESM en el paquete `cookie` por `react-router-dom`
- **Problema:** Al ejecutar los primeros builds estáticos en Astro 7, el compilador fallaba con `SyntaxError: Named export 'parseCookie' not found`. La causa raíz fue que `react-router-dom@7.1.1` dependía de `cookie@1.0.2` (CommonJS sin exportaciones nombradas ESM) y npm lo elevaba (`hoisting`) a la raíz de `node_modules`, eclipsando `cookie@^2.0.1` requerido por el prerenderizador de Astro 7.
- **Solución:** Una vez migradas todas las páginas a `src/pages/*.astro` y eliminados los `<Link>` de React Router, se removió `react-router-dom` del proyecto, limpiando el árbol de dependencias y resolviendo la colisión de raíz.

### 4.3. Uso de `<Image>` de Astro dentro de una isla React (`Navbar.jsx`)
- **Problema:** El componente `<Image>` de `astro:assets` se ejecuta en tiempo de compilación en el servidor de Astro y no puede importarse directamente dentro de un componente `.jsx` hidratado en el cliente.
- **Solución:** Se aplicó el patrón de **composición mediante `children` (Slot Forwarding)**. `src/layouts/Layout.astro` compila el logotipo `LOGO.png` a WebP con `<Image>` y se lo pasa como hijo a `<Navbar client:visible>`. De este modo, React hidrata únicamente la envoltura interactiva sin recomputar ni duplicar la imagen.

### 4.4. Cuello de botella en LCP (6.5 s) en `/blog` y `/servicios` por activos de Pexels
- **Problema:** Tras optimizar las imágenes locales (`yo.png` y `cachas.png`), las rutas `/blog` y `/servicios` seguían arrojando un LCP de `6.5 s` y `3.3 s` en Lighthouse. Las 29 imágenes externas de `images.pexels.com` se descargaban directamente desde el servidor remoto con su resolución original de cámara (hasta `6.2 MB` por imagen), y además las tarjetas superiores tenían `loading="lazy"`.
- **Solución:**
  1. Se añadió `image: { domains: ['images.pexels.com'] }` en `astro.config.mjs` para autorizar que el servicio de optimización de Astro descargue, redimensione (`400×300`) y codifique a WebP todas las imágenes remotas durante el build (reduciéndolas a `3 KB – 27 KB`).
  2. Se aplicó carga prioritaria (`loading="eager"`) a las 3 primeras tarjetas visibles sobre el pliegue (*above the fold*) y `loading="lazy"` al resto, reduciendo el LCP a **`0.4 s – 0.5 s`**.

### 4.5. Navegación móvil inaccesible y negritas sintéticas
- **Problema:** En la auditoría de postproducción se detectó que el `Navbar` original ocultaba los enlaces en pantallas menores a `768px` (`hidden md:flex`) sin ofrecer menú hamburguesa, bloqueando la navegación en móviles. Asimismo, la importación genérica `@import "@fontsource/poppins"` solo incluía el peso `400`, forzando al navegador a sintetizar artificialmente las negritas.
- **Solución:** Se implementó un panel desplegable móvil accesible (`aria-expanded`, `aria-controls`, cierre automático al navegar) en `Navbar.jsx` junto con un enlace *skip-to-content* en `Layout.astro`, y se declararon explícitamente las hojas `@fontsource/poppins/400.css`, `600.css` y `700.css` en `src/styles/global.css`.

### 4.6. Generación de Sitemap XML sin dependencias externas
- **Problema:** Integrar paquetes adicionales de sitemap podía introducir fricciones de dependencias o incluir rutas internas como `/login` (marcada como `noindex`).
- **Solución:** Se construyó un endpoint estático nativo de Astro en `src/pages/sitemap.xml.js` que genera `/sitemap.xml` durante `npm run build` en `2 ms`, listando exclusivamente las 10 rutas públicas canónicas con sus prioridades semánticas.

### 4.7. Migración a Content Layer API de Astro 7 y retención de tráfico orgánico (v1.2.0)
- **Problema:** En la versión original de la web, las 9 tarjetas del blog enlazaban directamente a artículos de un dominio externo (*Fitness Revolucionario*). Esto causaba una fuga total de tráfico cualificado: los visitantes abandonaban la plataforma antes de interactuar con los servicios de Álvaro Aguilar y el dominio `nutricionalcoach.com` no indexaba ninguna palabra clave *long-tail* de nutrición o entrenamiento. Además, la API clásica de colecciones (`src/content/config.ts`) acoplaba estrechamente el contenido al sistema de archivos y quedaba en desuso frente a las nuevas capacidades de Astro 5/6/7.
- **Solución:**
  1. Se implementó la nueva **Astro Content Layer API** en `src/content.config.ts` (en la raíz de `src/`), utilizando el cargador nativo `glob({ pattern: '**/*.md', base: './src/content/blog' })` junto con esquemas de validación tipados en `zod` (`title`, `description`, `pubDate`, `category`, `image`, `imageAlt`, `author`, `tags`, `draft`). Esto generó automáticamente los tipos TypeScript en `.astro/types.d.ts` y aceleró el tiempo de sincronización de contenidos a milisegundos en compilación.
  2. Se redactaron y estructuraron 9 artículos técnicos originales en Markdown bajo `src/content/blog/*.md`, abarcando áreas clave (desayuno, proteínas vegetales, desmentido de mitos, nutrición deportiva, alimentación antiinflamatoria, estrés, suplementación, nutrición estudiantil e hidratación).
  3. Se diseñó la plantilla de detalle dinámica `src/pages/blog/[slug].astro` con renderizado nativo `<Content />`, imagen hero WebP responsive (`1200×600`), migas de pan semánticas (`nav` con `aria-label="Migas de pan"`), datos estructurados Schema.org `BlogPosting` vinculados a la organización y un bloque de conversión dual al pie de cada artículo (Google Forms y WhatsApp).
  4. Se centralizó la lógica en `src/lib/posts.js` para ordenar por fecha, filtrar borradores (`draft: true`) y calcular el tiempo estimado de lectura en base al conteo de palabras (`~200 palabras/minuto`).
  5. Se actualizó `src/pages/sitemap.xml.js` para consultar `getCollection('blog')` en tiempo de compilación y registrar automáticamente las 19 URLs canónicas con su etiqueta `lastmod` sincronizada con `pubDate`.

### 4.8. Aislamiento estricto de Firebase SDK y política de despliegue en CDN con caché inmutable
- **Problema:** La integración de servicios de autenticación pesados (como Firebase Authentication) en sitios orientados a contenido estático corre el riesgo de degradar severamente el *Total Blocking Time* (TBT) y el peso del bundle inicial si el SDK se carga de forma global o en componentes que se hidratan al cargar la página. Asimismo, en arquitecturas estáticas servidas desde CDN (Cloudflare Pages / Vercel), una política de caché laxa o mal configurada puede provocar que los usuarios reciban documentos HTML desactualizados que intenten cargar fragmentos JavaScript con hashes ya purgados del servidor tras un despliegue.
- **Solución:**
  1. **Aislamiento de Auth:** El SDK de Firebase y su lógica interactiva residirán exclusivamente en la isla reactiva `AuthIsland.jsx` montada con `client:load` únicamente en la ruta `/login` (que ya cuenta con `<meta name="robots" content="noindex, nofollow">`). Todas las 19 rutas públicas del portal (`/`, `/blog`, `/blog/[slug]`, `/servicios`, `/contacto`) permanecen con **0 KB de JavaScript de Firebase**.
  2. **Estrategia de caché CDN:** Se definió la regla de cabeceras inmutables:
     - Activos generados con hash en `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable` (1 año de caché en navegador y CDN sin riesgo de colisión, pues cada cambio de código altera el hash).
     - Documentos HTML y sitemap: `Cache-Control: public, max-age=0, must-revalidate` para HTML y `max-age=3600, must-revalidate` para `sitemap.xml`, garantizando que cualquier actualización o despliegue en producción sea visible de inmediato por los usuarios y rastreadores de búsqueda.

---

## 5. Métricas consolidadas del sistema (`v1.2.0`)

| Métrica / Auditoría | Valor alcanzado | Estado |
|---|---|---|
| **Lighthouse Performance** | **100/100** (`/`, `/blog`, `/contacto`, `/servicios`) | Óptimo |
| **Lighthouse SEO** | **100/100** en todas las rutas públicas | Óptimo |
| **First Contentful Paint (FCP)** | `0.2 s` | Instantáneo |
| **Largest Contentful Paint (LCP)** | `0.4 s – 0.5 s` | Excelente |
| **Total Blocking Time (TBT)** | `0 ms` (rutas estáticas) | Sin bloqueo |
| **Cumulative Layout Shift (CLS)** | `0 – 0.015` | Sin saltos visuales |
| **Páginas estáticas compiladas** | **20 páginas** en `~2.7 s` | SSG de alta velocidad |
| **Recursos WebP optimizados** | **41 imágenes** generadas automáticamente en `dist/_astro/` | Compresión máxima |
| **URLs públicas en Sitemap** | **19 URLs** canónicas con `lastmod` dinámico | 100% indexable |

