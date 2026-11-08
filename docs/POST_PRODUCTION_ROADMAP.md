# Hoja de Ruta de Optimizaciones y Mejoras de Postproducción

Documento de diagnóstico técnico y registro de mejoras implementadas en la fase de postproducción sobre **Astro 7** (`v1.1.0`). Recoge los puntos de fricción detectados en la auditoría posterior a la migración, su justificación arquitectónica y la solución aplicada.

---

## 1. Resumen de Estado (`v1.1.0`)

| Prioridad | Área | Hallazgo original | Estado | Solución aplicada |
|---|---|---|---|---|
| **Alta (P1)** | **UX & Accesibilidad Móvil** | Enlaces de navegación ocultos en móvil (`hidden md:flex`) sin menú hamburguesa. | **Completado** | Menú desplegable móvil accesible (`aria-expanded`, `aria-controls`) e indicador de ruta activa (`aria-current="page"`) en `Navbar.jsx` + enlace *skip-to-content* en `Layout.astro`. |
| **Alta (P1)** | **Identidad & Branding** | El favicon del sitio apuntaba al logo por defecto de Vite (`/vite.svg`). | **Completado** | Nuevo isotipo vectorial corporativo `public/favicon.svg` enlazado en `BaseHead.astro` y eliminación de `public/vite.svg`. |
| **Media (P2)** | **SEO Técnico** | Falta de Sitemap XML dinámico y de datos estructurados Schema.org (JSON-LD). | **Completado** | Endpoint estático `src/pages/sitemap.xml.js`, directiva `Sitemap` en `public/robots.txt` y grafo JSON-LD (`HealthAndBeautyBusiness` + `Person` + `WebSite`) en `BaseHead.astro`. |
| **Media (P2)** | **Arquitectura de Islas** | `AuthPlaceholder.jsx` se hidrataba con `client:load` para renderizar un `<div>` vacío. | **Completado** | Renderizado estático (0 JS en cliente) de `AuthPlaceholder.jsx` en `/contacto` y `/login` hasta que se habilite Firebase Auth. |
| **Media (P2)** | **Conversión & Formularios** | `ContactForm.jsx` prevenía el envío (`e.preventDefault()`) sin feedback ni canal de salida. | **Completado** | Validación de campos, estado de confirmación accesible (`role="status"`, `aria-live="polite"`) y despacho directo pre-formateado por WhatsApp o Email. |
| **Media (P2)** | **Pie de Página & Tipografía** | Logo duplicado en `Footer.astro`, salto de jerarquía `<h4>` y peso único 400 en Poppins. | **Completado** | Jerarquía semántica `<h2>` en `Footer.astro`, enlace directo a WhatsApp, eliminación de logo redundante e importación de pesos `400`, `600` y `700` de `@fontsource/poppins`. |
| **Baja (P3)** | **Higiene de Dependencias** | Paquetes y activos huérfanos del boilerplate anterior (`@heroicons/react`, `react.svg`, etc.). | **Completado** | Limpieza de `package.json`, `eslint.config.js`, `tailwind.config.js` y eliminación de activos fantasma en `src/assets/`. |

---

## 2. Detalle Técnico de las Mejoras Implementadas

### 2.1. Navegación Móvil y Accesibilidad WCAG 2.1 (P1)

- **Problema:** En `src/components/Navbar.jsx`, los enlaces se ocultaban por debajo de `768px` (`hidden md:flex`) sin botón de apertura, impidiendo navegar en teléfonos móviles.
- **Implementación:**
  1. Se añadió estado `isOpen` en `src/components/Navbar.jsx` junto con un botón hamburguesa accesible (`aria-expanded`, `aria-controls="mobile-navigation"`, `aria-label` dinámico).
  2. Se incorporó detección de ruta activa mediante `pathname` (`aria-current="page"`) tanto en escritorio como en móvil.
  3. En `src/layouts/Layout.astro`, se añadió el enlace `<a href="#main-content" class="sr-only focus:not-sr-only ...">Saltar al contenido principal</a>` y el atributo `id="main-content"` en `<main>`.

### 2.2. Identidad Visual y Favicon Corporativo (P1)

- **Problema:** `src/components/BaseHead.astro` referenciaba `/vite.svg`.
- **Implementación:**
  1. Se diseñó `public/favicon.svg` con el monograma **NC** y la paleta corporativa (`#111111`, `#8B0000`, `#C0C0C0`, `#FFFFFF`).
  2. Se actualizó `src/components/BaseHead.astro` con `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` y `<meta name="theme-color" content="#111111" />`.
  3. Se eliminó `public/vite.svg`.

### 2.3. SEO Técnico: Sitemap XML y Schema.org JSON-LD (P2)

- **Problema:** Ausencia de mapa del sitio XML y de microdatos estructurados para buscadores.
- **Implementación:**
  1. Se creó el endpoint estático nativo `src/pages/sitemap.xml.js` que genera `/sitemap.xml` en tiempo de build con las 10 rutas públicas indexables, prioridades y fecha `lastmod`.
  2. Se actualizó `public/robots.txt` añadiendo `Disallow: /login` y `Sitemap: https://nutricionalcoach.com/sitemap.xml`.
  3. Se configuró `noindex={true}` en `src/pages/login.astro` para evitar indexar la pantalla de acceso en construcción.
  4. Se inyectó un bloque `<script type="application/ld+json">` en `src/components/BaseHead.astro` con las entidades `HealthAndBeautyBusiness`, `Person` (Álvaro Aguilar) y `WebSite`.

### 2.4. Optimización de Islas y Formulario de Contacto (P2)

- **Problema:** `AuthPlaceholder.jsx` hidrataba React innecesariamente en un contenedor vacío, y `ContactForm.jsx` no daba respuesta al usuario tras enviar el formulario.
- **Implementación:**
  1. Se retiró `client:load` de `<AuthPlaceholder />` en `src/pages/contacto.astro` y `src/pages/login.astro`, manteniéndolo como punto de extensión estático con 0 KB de JS hasta activar Firebase Auth.
  2. Se rediseñó `src/components/ContactForm.jsx` con validación de campos, estado de confirmación accesible (`role="status"`, `aria-live="polite"`) y botones de envío inmediato con el mensaje pre-rellenado hacia WhatsApp (`https://wa.me/34655397061?text=...`) o correo electrónico (`mailto:info@nutricionalcoach.com`).

### 2.5. Saneamiento de Dependencias y Activos (P3)

- **Problema:** Dependencias sin uso heredadas de Vite y archivos placeholder de 30 bytes en `src/assets/`.
- **Implementación:**
  1. Se eliminaron `@heroicons/react`, `@vitejs/plugin-react`, `eslint-plugin-react-refresh` y `vite` de `package.json`.
  2. Se actualizaron `eslint.config.js` y `tailwind.config.js`.
  3. Se eliminaron `alvaro-profile.jpg`, `muscles.jpg`, `logo-completo.svg` y `react.svg` de `src/assets/`.
