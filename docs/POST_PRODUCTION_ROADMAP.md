# Hoja de Ruta de Optimizaciones y Mejoras de Postproducción

Documento de diagnóstico técnico, decisiones de producto y registro de mejoras implementadas en la fase de postproducción y evolución sobre **Astro 7** (`v1.2.2`), junto con la planificación de la siguiente sesión.

---

## 1. Resumen de Estado (`v1.2.2`)

| Prioridad | Área | Hallazgo original | Estado | Solución aplicada |
|---|---|---|---|---|
| **Alta (P1)** | **Control de Calidad Integral (QA)** | Recorte visual de logotipo ("RICIC COACH"), desbordamiento navbar, colapso de Hero en móvil, ausencia de 404 y fallos de teclado/semántica. | **Completado (`v1.2.2`)** | 7 hallazgos resueltos: logo 384×95 (5.0 KB WebP unificado), hero móvil min-h 280px, 404.astro (noindex + 3 CTAs, 21 páginas estáticas), listeners condicionales en Navbar.jsx, validación trim con role="alert" en ContactForm.jsx y H1→H2→H3 secuencial. |
| **Alta (P1)** | **Funnels de Conversión** | Todos los servicios apuntaban genéricamente a `/contacto` o a un enlace antiguo. | **Completado** | Segmentación estratégica de CTAs hacia Google Forms (evaluación clínica/objetivos) y WhatsApp directo `+34 655 397 061` (asesoramiento y educación). |
| **Alta (P1)** | **UX & Accesibilidad Móvil** | Enlaces de navegación ocultos en móvil (`hidden md:flex`) sin menú hamburguesa. | **Completado** | Menú desplegable móvil accesible (`aria-expanded`, `aria-controls`) e indicador de ruta activa (`aria-current="page"`) en `Navbar.jsx` + enlace *skip-to-content* en `Layout.astro`. |
| **Alta (P1)** | **Identidad & Branding** | El favicon del sitio apuntaba al logo por defecto de Vite (`/vite.svg`). | **Completado** | Nuevo isotipo vectorial corporativo `public/favicon.svg` enlazado en `BaseHead.astro` y eliminación de `public/vite.svg`. |
| **Alta (P1)** | **SEO de Contenidos & Blog Propio** | Las tarjetas del blog enlazaban a artículos externos (Fitness Revolucionario), perdiendo el 100% del tráfico y autoridad orgánica. | **Completado (`v1.2.0`)** | Migración a Astro Content Layer API (`src/content.config.ts`), 9 artículos técnicos propios en Markdown (`src/content/blog/`), plantilla dinámica `/blog/[slug]` con Schema.org `BlogPosting` y sitemap dinámico (19 URLs). |
| **Media (P2)** | **SEO Técnico** | Falta de Sitemap XML dinámico y de datos estructurados Schema.org (JSON-LD). | **Completado** | Endpoint estático `src/pages/sitemap.xml.js`, directiva `Sitemap` en `public/robots.txt` y grafo JSON-LD (`HealthAndBeautyBusiness` + `Person` + `WebSite`) en `BaseHead.astro`. |
| **Media (P2)** | **Arquitectura de Islas** | `AuthPlaceholder.jsx` se hidrataba con `client:load` para renderizar un `<div>` vacío. | **Completado** | Renderizado estático (0 JS en cliente) de `AuthPlaceholder.jsx` en `/contacto` y `/login` hasta que se habilite Firebase Auth. |
| **Media (P2)** | **Conversión & Formularios** | `ContactForm.jsx` prevenía el envío (`e.preventDefault()`) sin feedback ni canal de salida. | **Completado** | Validación de campos, estado de confirmación accesible (`role="status"`, `aria-live="polite"`) y despacho directo pre-formateado por WhatsApp o Email. |
| **Media (P2)** | **Pie de Página & Tipografía** | Logo duplicado en `Footer.astro`, salto de jerarquía `<h4>` y peso único 400 en Poppins. | **Completado** | Jerarquía semántica `<h2>` en `Footer.astro`, enlace directo a WhatsApp, eliminación de logo redundante e importación de pesos `400`, `600` y `700` de `@fontsource/poppins`. |
| **Media (P2)** | **Caché CDN & Despliegue** | Sin reglas explícitas de caché HTTP para proteger activos con hash ni forzar revalidación de HTML tras cada deploy. | **Completado (`v1.2.1`)** | Configuración multi-CDN mediante `public/_headers` (Cloudflare Pages, emitido en `dist/_headers`) y `vercel.json` (Vercel) con caché inmutable de 1 año en `/_astro/*` y revalidación en HTML/sitemap. |
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

### 2.6. Retención de Tráfico Orgánico y Astro Content Layer API (`v1.2.0`)
- **Por qué:** Un portal de coaching nutricional necesita posicionarse como autoridad frente a Google. Mantener enlaces salientes a portales de terceros desperdiciaba el potencial de captación orgánica por palabras clave específicas de nutrición deportiva y recomposición corporal.
- **Cómo se resolvió:** Se implementó la nueva Content Layer API de Astro 7 (`src/content.config.ts`) con el cargador `glob` y validación estricta por esquemas Zod. Se redactaron 9 artículos técnicos originales en Markdown (`src/content/blog/`), una plantilla de lectura enriquecida con metadatos Open Graph y Schema.org `BlogPosting` (`src/pages/blog/[slug].astro`), utilidades centralizadas de tiempo de lectura y filtrado (`src/lib/posts.js`) y sitemap automático sincronizado con 19 URLs canónicas.

### 2.7. Estrategia de Caché Inmutable y Portabilidad Multi-CDN (`v1.2.1`)
- **Por qué:** En despliegues continuos sobre CDNs globales (Cloudflare Pages o Vercel), una política de caché genérica puede servir HTML desfasado que apunte a archivos CSS/JS/WebP con hashes ya eliminados, o cachear excesivamente el contenido dinámico impidiendo que las actualizaciones del blog se reflejen al instante. Además, cada proveedor utiliza convenciones distintas: Cloudflare Pages exige un archivo plano `_headers` en la raíz del directorio compilado (`dist/_headers`), mientras que Vercel exige un manifiesto `vercel.json` en la raíz del proyecto con patrones basados en expresiones regulares.
- **Cómo se resolvió:** Se implementaron ambos descriptores sincronizados (`public/_headers` y `vercel.json`) aplicando `Cache-Control: public, max-age=31536000, immutable` al directorio `/_astro/*` (donde Astro deposita fuentes, imágenes WebP y scripts con hash de contenido), `max-age=0, must-revalidate` para los documentos `.html` y `max-age=3600, must-revalidate` para `/sitemap.xml`. De este modo se logra portabilidad total entre CDNs, cero activos rotos tras despliegues y máxima velocidad en visitas recurrentes.

### 2.8. Control de Calidad Integral (QA), Estabilidad Visual y Experiencia de Usuario (`v1.2.2`)
- **Por qué:** Los pipelines de integración continua estándar (`npm run build`, `npm run lint` y auditorías Lighthouse en reposo) evalúan la corrección sintáctica, dependencias y tiempos de carga pasivos, pero son ciegos ante fallos de recorte de imagen por discrepancias de relación de aspecto, desbordamientos de layout verticales, colapso de rejillas en viewports móviles reducidos, omisión de manejadores de eventos dinámicos y validaciones de formulario ante entradas anómalas.
- **Cómo se resolvió:**
  1. **Logotipo corporativo (`384×95 px`, 5.0 KB WebP):** El archivo original `src/assets/LOGO.png` (1181×292 px, relación 4.04:1) al procesarse con `192×192` sufría el recorte central de Sharp (`fit: cover` por defecto), dejando solo "RICIC COACH" y desbordando 96 px fuera de la cabecera `h-24`. Recalcularlo a `384×95 px` (densidad Retina 2x) garantizó renderizado nítido a `192×48 px` en escritorio con 24 px de holgura superior e inferior en `Navbar.jsx`, `160×40 px` en móvil, y unificó la caché WebP en una única entrada de **5.0 KB** compartida entre `Layout.astro` y `Footer.astro`.
  2. **Hero responsivo sin colapso móvil (`index.astro`):** La columna derecha del Hero en vista móvil (`< 768px`) contenía un hijo con `position: absolute` dentro de un grid de una columna sin altura intrínseca, provocando que colapsara a `0 px`. Asignar `min-h-[280px] sm:min-h-[340px] md:min-h-0 h-full overflow-hidden rounded-xl md:overflow-visible md:rounded-none` garantizó altura estable en móvil sin CLS (0) y preservó la dirección de arte en escritorio (`-rotate-90 scale-150`).
  3. **Manejadores de eventos condicionales (`Navbar.jsx`):** Se implementaron listeners de `keydown` (`Escape`) y `resize` (`>= 768px`) activos únicamente cuando `isOpen === true`. Cuando el menú está cerrado existen **0 listeners globales en reposo**, optimizando el rendimiento y satisfaciendo WCAG 2.1 AA.
  4. **Validación reactiva frente a solo espacios (`ContactForm.jsx`):** Cadenas con solo espacios (`"   "`) superaban HTML5 `required` pero abortaban en silencio en `.trim()`. Se agregó feedback explícito con alerta semántica `role="alert"` y reseteo automático al escribir.
  5. **Página de error 404 (`src/pages/404.astro`):** Compila nativamente a `dist/404.html` con directiva `noindex={true}` y 3 CTAs de recuperación estratégica (`/`, `/servicios`, `/blog`), elevando el total a **21 páginas estáticas** listas para ser servidas por Cloudflare Pages y Vercel.
  6. **Jerarquía secuencial de encabezados:** Se corrigieron los saltos de `H1` a `H3` en servicios y contacto, normalizando a `H1` → `H2` → `H3` para navegación accesible de lectores de pantalla y rastreo semántico de motores de búsqueda.

---

## 3. Próximos Pasos (Backlog para Continuar Mañana)

Con la versión **`v1.2.2`** completamente estabilizada, libre de errores en linter y compilando de forma limpia sus **21 páginas estáticas**, el plan de trabajo para la sesión de mañana se estructura en tres tareas prioritarias:

1. **TODO 1 — Configuración de Perfiles Sociales Oficiales y Marcado Schema.org (Paso 1):**
   - **Objetivo:** Reemplazar las URLs de marcador de posición de Instagram y LinkedIn en `src/components/Footer.astro` y sincronizar el grafo Schema.org (`sameAs`) en `src/components/BaseHead.astro`.
   - **Estado:** Bloqueado únicamente a la espera de los enlaces definitivos de Álvaro Aguilar.
   - **Acción inmediata:** Insertar los enlaces con `aria-label` descriptivos y verificar con el validador de Schema.org.

2. **TODO 2 — Portal de Clientes con Firebase Authentication (Paso 3):**
   - **Objetivo:** Implementar el acceso seguro para clientes en `/login` sin comprometer la velocidad ni los Core Web Vitals de las rutas públicas.
   - **Estado:** Especificado y listo para desarrollo.
   - **Acción inmediata:** Instalar `firebase`, crear el cliente en `src/lib/firebase.js` aislado al navegador, documentar variables en `.env.example`, construir la isla interactiva `src/components/AuthIsland.jsx` (Email/Contraseña + Google Popup, estados de carga y error en español) y montarla con `client:load` exclusivamente en `src/pages/login.astro` (protegida con `noindex`).

3. **TODO 3 — Despliegue en Producción y Validación de Dominio (Paso 4.2):**
   - **Objetivo:** Publicar la plataforma en la CDN global definitiva (Cloudflare Pages o Vercel) y vincular el dominio `nutricionalcoach.com`.
   - **Estado:** Listo para conectar (las cabeceras de caché inmutable `public/_headers` y `vercel.json` ya están integradas).
   - **Acción inmediata:** Conectar el repositorio de GitHub a la plataforma, configurar registros DNS (CNAME/A), activar SSL/TLS automático y HTTP/3, y verificar en vivo la auditoría Lighthouse sobre `https://nutricionalcoach.com`.

*(Para el detalle técnico paso a paso de cada una de estas tareas, consultar [`docs/PLAN_FASE_2_EJECUCION.md`](PLAN_FASE_2_EJECUCION.md)).*
