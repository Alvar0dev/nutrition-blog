# Hoja de Ruta de Optimizaciones y Mejoras de Postproducción

Documento de diagnóstico técnico, decisiones de producto y registro de mejoras implementadas en la fase de postproducción sobre **Astro 7** (`v1.1.0`), junto con la planificación de la siguiente fase evolutiva.

---

## 1. Resumen de Estado (`v1.1.0`)

| Prioridad | Área | Hallazgo original | Estado | Solución aplicada |
|---|---|---|---|---|
| **Alta (P1)** | **Funnels de Conversión** | Todos los servicios apuntaban genéricamente a `/contacto` o a un enlace antiguo. | **Completado** | Segmentación estratégica de CTAs hacia Google Forms (evaluación clínica/objetivos) y WhatsApp directo `+34 655 397 061` (asesoramiento y educación). |
| **Alta (P1)** | **UX & Accesibilidad Móvil** | Enlaces de navegación ocultos en móvil (`hidden md:flex`) sin menú hamburguesa. | **Completado** | Menú desplegable móvil accesible (`aria-expanded`, `aria-controls`) e indicador de ruta activa (`aria-current="page"`) en `Navbar.jsx` + enlace *skip-to-content* en `Layout.astro`. |
| **Alta (P1)** | **Identidad & Branding** | El favicon del sitio apuntaba al logo por defecto de Vite (`/vite.svg`). | **Completado** | Nuevo isotipo vectorial corporativo `public/favicon.svg` enlazado en `BaseHead.astro` y eliminación de `public/vite.svg`. |
| **Media (P2)** | **SEO Técnico** | Falta de Sitemap XML dinámico y de datos estructurados Schema.org (JSON-LD). | **Completado** | Endpoint estático `src/pages/sitemap.xml.js`, directiva `Sitemap` en `public/robots.txt` y grafo JSON-LD (`HealthAndBeautyBusiness` + `Person` + `WebSite`) en `BaseHead.astro`. |
| **Media (P2)** | **Arquitectura de Islas** | `AuthPlaceholder.jsx` se hidrataba con `client:load` para renderizar un `<div>` vacío. | **Completado** | Renderizado estático (0 JS en cliente) de `AuthPlaceholder.jsx` en `/contacto` y `/login` hasta que se habilite Firebase Auth. |
| **Media (P2)** | **Conversión & Formularios** | `ContactForm.jsx` prevenía el envío (`e.preventDefault()`) sin feedback ni canal de salida. | **Completado** | Validación de campos, estado de confirmación accesible (`role="status"`, `aria-live="polite"`) y despacho directo pre-formateado por WhatsApp o Email. |
| **Media (P2)** | **Pie de Página & Tipografía** | Logo duplicado en `Footer.astro`, salto de jerarquía `<h4>` y peso único 400 en Poppins. | **Completado** | Jerarquía semántica `<h2>` en `Footer.astro`, enlace directo a WhatsApp, eliminación de logo redundante e importación de pesos `400`, `600` y `700` de `@fontsource/poppins`. |
| **Baja (P3)** | **Higiene de Dependencias** | Paquetes y activos huérfanos del boilerplate anterior (`@heroicons/react`, `react.svg`, etc.). | **Completado** | Limpieza de `package.json`, `eslint.config.js`, `tailwind.config.js` y eliminación de activos fantasma en `src/assets/`. |

---

## 2. Por qué se construyó así: Justificación Arquitectónica y de Producto

### 2.1. Estrategia Dual de Conversión (Google Forms vs. WhatsApp Directo)
- **Por qué:** No todos los servicios nutricionales tienen la misma fricción de entrada.
  - Los programas técnicos (**Mejora de Hábitos**, **Objetivos/Competición**, **Composición Corporal** y **Recuperación de Salud**) requieren recopilar anamnesis previa y contexto del cliente antes de la primera toma de contacto; por ello sus CTAs dirigen al cuestionario estructurado en **Google Forms**.
  - Los servicios consultivos y formativos (**Asesoramiento Personalizado** y **Educación Nutricional**) convierten mejor mediante resolución ágil de dudas; por ello sus CTAs abren chat directo en **WhatsApp (`https://wa.me/34655397061`)**.

### 2.2. Navegación Móvil y Accesibilidad WCAG 2.1
- **Por qué:** Más del 70% del tráfico hacia servicios de coaching nutricional proviene de dispositivos móviles. En la versión previa, la clase `hidden md:flex` ocultaba los enlaces en pantallas menores a `768px` sin alternativa de navegación.
- **Cómo se resolvió:** Se dotó a `src/components/Navbar.jsx` de estado real (`useState`) con un botón hamburguesa accesible (`aria-expanded`, `aria-controls="mobile-navigation"`), justificando así su hidratación como isla (`client:visible`), y se añadió el enlace *skip-to-content* (`#main-content`) en `src/layouts/Layout.astro`.

### 2.3. Despacho Sin Servidor en `ContactForm.jsx`
- **Por qué:** En una arquitectura 100% estática (SSG) desplegada en CDN, depender de un servidor SMTP propio añade costes de mantenimiento y puntos de fallo, mientras que dejar un `e.preventDefault()` mudo provoca pérdida de clientes potenciales.
- **Cómo se resolvió:** Al enviar el formulario en `/contacto`, la isla valida y sanea los campos, muestra una tarjeta de confirmación accesible (`role="status"`, `aria-live="polite"`) y genera dinámicamente los enlaces codificados (`encodeURIComponent`) para despachar la consulta con un clic tanto por **WhatsApp** como por **cliente de correo (`mailto:`)**, garantizando cero leads perdidos sin backend intermedio.

### 2.4. Endpoint Nativo `sitemap.xml.js` y Exclusión de `/login`
- **Por qué:** Añadir plugins externos para un sitio de 11 rutas introduce dependencias innecesarias y puede indexar por error páginas privadas o en construcción como `/login`.
- **Cómo se resolvió:** Se implementó `src/pages/sitemap.xml.js` utilizando endpoints estáticos nativos de Astro. En tiempo de compilación genera `/sitemap.xml` únicamente con las 10 rutas públicas canónicas, asignando prioridades semánticas (`1.0` portada, `0.9` catálogo de servicios, `0.8` especialidades y blog, `0.7` contacto), mientras `/login` se protege con `<meta name="robots" content="noindex, nofollow">` y `Disallow: /login` en `public/robots.txt`.

### 2.5. Deshidratación Preventiva de `AuthPlaceholder.jsx`
- **Por qué:** Hidratar en cliente un componente que aún no tiene SDK de autenticación conectado obliga al navegador a descargar y ejecutar código de hidratación para un `<div>` vacío.
- **Cómo se resolvió:** Se mantuvo `AuthPlaceholder.jsx` montado en `contacto.astro` y `login.astro` pero renderizado de forma 100% estática en el servidor. Cuando se instale `firebase/auth`, bastará con restaurar la directiva `client:load`.

---

## 3. Próximos Pasos (Backlog para la Siguiente Sesión)

1. **Despliegue en Producción (Hosting & CDN):**
   - Conectar el repositorio GitHub con **Vercel**, **Cloudflare Pages** o **Netlify** (comando de build: `npm run build`, directorio de salida: `dist`).
   - Configurar dominio personalizado (`nutricionalcoach.com`) y certificados SSL.
2. **Contenido Propio en el Blog (Astro Content Collections):**
   - Actualmente las tarjetas de `/blog` enlazan a artículos externos de divulgación. Si se desea publicar artículos propios dentro del dominio para captar tráfico orgánico por *long-tail keywords*, migrar los artículos a `src/content/blog/*.md` con rutas dinámicas `src/pages/blog/[slug].astro`.
3. **Personalización de Perfiles Sociales:**
   - Actualizar las URLs definitivas de Instagram y LinkedIn de Álvaro Aguilar en `src/components/Footer.astro` y en el array `sameAs` del bloque Schema.org JSON-LD en `src/components/BaseHead.astro`.
4. **Activación Opcional del Área de Clientes (Firebase Auth):**
   - Cuando se requiera habilitar el portal privado en `/login`, instalar `firebase`, crear `src/lib/firebase.js` y activar `client:load` sobre `AuthPlaceholder.jsx`.

*(Para el detalle técnico paso a paso de cada una de estas tareas, consultar [`docs/PLAN_FASE_2_EJECUCION.md`](PLAN_FASE_2_EJECUCION.md)).*
