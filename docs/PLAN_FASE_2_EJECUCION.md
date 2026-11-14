# Plan de Ejecución Detallado — Fase 2 (Postproducción y Evolución)

Documento operativo que establece la hoja de ruta paso por paso para la ejecución de la **Fase 2** en **Nutricional Coach** (`nutrition-blog`). Cada paso está diseñado como una unidad de trabajo independiente, verificable y con criterios de aceptación claros.

---

## 1. Resumen de Etapas y Secuencia de Ejecución

| Paso | Módulo | Estado | Objetivo principal | Archivos afectados | Verificación técnica |
|---|---|---|---|---|---|
| **Paso 1** | **Identidad & Redes** | Pendiente | Reemplazar URLs placeholder de redes sociales por los perfiles oficiales y sincronizar Schema.org. | `Footer.astro`, `BaseHead.astro` | Inspección visual en pie y validación de JSON-LD. |
| **Paso 2** | **Blog Interno (Content Collections)** | **Completado (`v1.2.0`)** | Migrar artículos a Markdown local con Content Layer API (`src/content.config.ts`) y generar rutas dinámicas `/blog/[slug]`. | `src/content.config.ts`, `src/content/blog/`, `src/lib/posts.js`, `src/pages/blog/`, `sitemap.xml.js` | `npm run build` genera páginas estáticas + `/sitemap.xml` con 19 URLs. |
| **QA & Estabilidad** | **Control de Calidad Integral (`v1.2.2`)** | **Completado** | Auditoría visual, geométrica y funcional en las 21 rutas (escritorio `1280×800` y móvil `375×812`), corrección de layout del logotipo, navegación, responsive hero, página 404, WCAG y semántica. | `Layout.astro`, `Footer.astro`, `Navbar.jsx`, `ContactForm.jsx`, `404.astro`, `index.astro`, `servicios/*.astro`, `blog/index.astro`, `docs/QA_AUDIT.md` | `npm run build` genera 21 páginas estáticas (incluyendo `/404.html`) y `npm run lint` pasa con 0 errores. |
| **Paso 3** | **Portal Clientes (Firebase Auth)** | Pendiente | Conectar SDK de Firebase Authentication en `/login` para permitir acceso seguro de clientes. | `src/lib/firebase.js`, `AuthPlaceholder.jsx`, `login.astro`, `.env` | Flujo de autenticación cliente probado en local. |
| **Paso 4** | **Despliegue a Producción (CDN)** | En progreso (4.1 listo) | Configurar pipeline de publicación (Cloudflare Pages / Vercel), cabeceras de caché (`public/_headers`, `vercel.json`) y dominio. | `public/_headers`, `vercel.json`, `README.md` | Despliegue en vivo en `nutricionalcoach.com` con SSL y HTTP/2+. |

---

## 2. Desglose Paso a Paso

### Paso 1: Configuración de Perfiles Sociales Oficiales y Marcado Schema.org

#### 1.1. Contexto y Justificación
Actualmente los botones de Instagram y LinkedIn en `src/components/Footer.astro` apuntan a `https://www.instagram.com/` y `https://www.linkedin.com/`. Asimismo, el grafo Schema.org en `src/components/BaseHead.astro` (`sameAs`) solo incluye WhatsApp. Es necesario unificar los canales oficiales para transmitir autoridad y facilitar el contacto.

#### 1.2. Tareas de Implementación
1. **Definir URLs oficiales:**
   - WhatsApp: `https://wa.me/34655397061` (activo).
   - Instagram: perfil oficial de Álvaro Aguilar (e.g. `https://www.instagram.com/alvaro_aguilar_coach/` o el handle definitivo proporcionado).
   - LinkedIn: perfil profesional de Álvaro Aguilar.
2. **Actualizar `src/components/Footer.astro`:**
   - Reemplazar los enlaces `href` con las URLs definitivas.
   - Asegurar atributos `aria-label="Seguir a Álvaro Aguilar en Instagram"` y `target="_blank" rel="noopener noreferrer"`.
3. **Actualizar `src/components/BaseHead.astro`:**
   - Añadir las URLs al array `sameAs` del objeto `HealthAndBeautyBusiness` en el JSON-LD.
4. **Verificación:**
   - Comprobar que los enlaces abren en pestaña nueva con `rel="noopener noreferrer"`.
   - Validar el marcado resultante con el [Validador de Schema.org](https://validator.schema.org/).

---

### Paso 2: Migración del Blog a Astro Content Collections (SEO Orgánico Propio) — Completado (`v1.2.0`)

#### 2.1. Contexto y Justificación
Originalmente, las 9 tarjetas en `src/pages/blog.astro` enlazaban externamente a artículos de Fitness Revolucionario. Para captar tráfico orgánico cualificado mediante palabras clave de nutrición y rendimiento deportivo, los artículos se migraron para alojarse dentro del propio dominio `nutricionalcoach.com` utilizando **Astro Content Layer API** (`src/content.config.ts`) con validación por esquemas Zod.

#### 2.2. Implementación realizada
1. **Definición de la colección (`src/content.config.ts`):**
   - Configurado en la raíz de `src/` con el cargador `glob` de Astro 7 y validación estricta de frontmatter (`zod`).
2. **Redacción de 9 artículos técnicos (`src/content/blog/*.md`):**
   - Artículos divulgativos completos en Markdown con metadatos estructurados (`title`, `description`, `pubDate`, `category`, `image`, `imageAlt`, `tags`).
3. **Plantilla dinámica (`src/pages/blog/[slug].astro`):**
   - Generación estática vía `getCollection('blog')`, renderizado con `<Content />`, imagen WebP optimizada, migas de pan y datos Schema.org `BlogPosting`.
4. **Catálogo (`src/pages/blog/index.astro`) y utilidades (`src/lib/posts.js`):**
   - Listado cronológico con cálculo de tiempo de lectura y enlaces internos `/blog/[slug]`.
5. **Sitemap automático (`src/pages/sitemap.xml.js`):**
   - Generación en 2ms de 19 URLs canónicas con `lastmod` dinámico.

---

### Paso 3: Arquitectura y Conexión de Firebase Auth en el Área de Clientes

#### 3.1. Contexto y Justificación
`src/pages/login.astro` y `src/components/AuthPlaceholder.jsx` están preparados como puntos de extensión estáticos (0 KB de JavaScript). Cuando se decida habilitar el área privada de seguimiento, se conectará el SDK de **Firebase Authentication** únicamente en esa ruta, manteniendo el resto del portal libre de sobrecarga.

#### 3.2. Tareas de Implementación
1. **Instalación y variables de entorno:**
   - Instalar el paquete oficial de Firebase:
     ```bash
     npm install firebase
     ```
   - Configurar variables de entorno públicas en `.env` (y documentarlas en `.env.example`):
     ```env
     PUBLIC_FIREBASE_API_KEY=tu_api_key
     PUBLIC_FIREBASE_AUTH_DOMAIN=nutricional-coach.firebaseapp.com
     PUBLIC_FIREBASE_PROJECT_ID=nutricional-coach
     PUBLIC_FIREBASE_STORAGE_BUCKET=nutricional-coach.appspot.com
     PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
     PUBLIC_FIREBASE_APP_ID=tu_app_id
     ```
2. **Crear cliente de Firebase (`src/lib/firebase.js`):**
   - Inicializar la app y exportar el servicio de autenticación (`getAuth`) asegurando que solo se ejecute en el entorno del navegador.
3. **Construir el componente interactivo de Login (`src/components/AuthIsland.jsx`):**
   - Reemplazar el placeholder por un formulario de acceso completo con:
     - Campos: Email y Contraseña con validación visual.
     - Botón de acceso por correo y botón alternativo con Google (`GoogleAuthProvider` + `signInWithPopup`).
     - Manejo de estados: `loading`, `error` (mensajes traducidos al español para códigos como `auth/user-not-found`, `auth/wrong-password`) y `authenticated`.
     - Panel de usuario autenticado con botón de cerrar sesión (`signOut`).
4. **Hidratación en `src/pages/login.astro`:**
   - Montar el componente con hidratación diferida al cliente:
     ```astro
     <AuthIsland client:load />
     ```
5. **Verificación:**
   - Probar inicio de sesión, errores de credenciales inválidas y cierre de sesión.
   - Confirmar que las páginas públicas (`/`, `/blog`, `/servicios`, `/contacto`) siguen sin cargar ningún script de Firebase.

---

### Paso 4: Pipeline de Despliegue a Producción (Hosting, CDN y Caché)

#### 4.1. Contexto y Justificación
Para garantizar que el sitio mantenga sus puntuaciones de 100/100 en un entorno de producción real, se debe configurar una CDN global de alto rendimiento (Cloudflare Pages o Vercel) con compresión Brotli, protocolo HTTP/3 y políticas de caché inmutables para los activos estáticos.

#### 4.2. Tareas de Implementación
1. **Elección de plataforma:**
   - **Opción recomendada (Cloudflare Pages):** Cero latencia en España/Europa, SSL automático, ancho de banda ilimitado y despliegues instantáneos desde GitHub.
   - **Alternativa (Vercel):** Integración nativa con Astro y vista previa automática de PRs.
2. **Configuración de cabeceras de caché (`public/_headers` para Cloudflare Pages o `vercel.json`):**
   - Activos inmutables generados con hash en `/_astro/*`:
     ```text
     /_astro/*
       Cache-Control: public, max-age=31536000, immutable
     ```
   - Archivos HTML y Sitemap (revalidación inmediata):
     ```text
     /*.html
       Cache-Control: public, max-age=0, must-revalidate
     /sitemap.xml
       Cache-Control: public, max-age=3600, must-revalidate
     ```
3. **Configuración de Dominio y DNS:**
   - Apuntar los registros DNS de `nutricionalcoach.com` a los servidores de la CDN elegida:
     - Registro `CNAME` para `www.nutricionalcoach.com`.
     - Registro `A` o aplanamiento CNAME para el dominio raíz.
   - Forzar redirección HTTPS y HSTS.
4. **Verificación:**
   - Ejecutar Lighthouse contra la URL de producción final (`https://nutricionalcoach.com`).
   - Verificar que el sitemap y `robots.txt` son accesibles sin redirecciones intermedias.

---

## 3. Checklist de Ejecución y Estado Actual

- [ ] **Paso 1:** URLs reales en `Footer.astro` y JSON-LD de `BaseHead.astro` *(Bloqueado: esperando enlaces oficiales de Álvaro)*.
- [x] **Paso 2.1:** Configurar `src/content.config.ts` (Content Layer API de Astro 7 con `glob` loader) y crear los 9 artículos Markdown en `src/content/blog/*.md`.
- [x] **Paso 2.2:** Crear plantilla `src/pages/blog/[slug].astro` con JSON-LD `BlogPosting` y enlazar catálogo en `src/pages/blog/index.astro`.
- [x] **Paso 2.3:** Integrar rutas dinámicas del blog en `src/pages/sitemap.xml.js`.
- [x] **Control de Calidad (QA — `v1.2.2`):** Auditoría visual y funcional sobre las 21 rutas estáticas (escritorio y móvil), resolución de 7 anomalías críticas/medias y creación de `src/pages/404.astro` (`dist/404.html`). Ver [`docs/QA_AUDIT.md`](QA_AUDIT.md).
- [ ] **Paso 3.1:** Instalar `firebase` y crear `src/lib/firebase.js` con variables de entorno documentadas en `.env.example`.
- [ ] **Paso 3.2:** Construir UI de login con Google / Email en isla React `AuthIsland.jsx` e integrarla en `src/pages/login.astro`.
- [x] **Paso 4.1:** Crear archivo de cabeceras de caché inmutable (`public/_headers` y `vercel.json`).
- [ ] **Paso 4.2:** Conectar repositorio a la plataforma de hosting (Cloudflare Pages o Vercel), enlazar dominio y validar en vivo.

---

## 4. Dificultades Técnicas Encontradas y Justificación Arquitectónica

1. **Gestión de Identidad y Riesgo de Enlaces Rotos (Paso 1):**
   - *Dificultad:* En la plantilla inicial los botones de redes sociales apuntaban a las raíces de `instagram.com` y `linkedin.com`. Para evitar introducir enlaces provisionales o handles incorrectos en el pie de página y en el grafo de autoridad Schema.org (`sameAs`), se decidió bloquear esta tarea hasta contar con los perfiles definitivos del profesional.
   - *Por qué se construyó así:* El marcado Schema.org alimenta directamente la entidad de negocio local en Google. Vincular una URL equivocada o un perfil no verificado daña la reputación del dominio y la indexación como especialista acreditado.

2. **Migración a la nueva Content Layer API en lugar del API heredado (Paso 2):**
   - *Dificultad:* Astro 5/6/7 reemplazó el antiguo `src/content/config.ts` por `src/content.config.ts` utilizando la API Content Layer con cargadores (`glob`). La documentación heredada sugería la estructura antigua que no aprovecha la sincronización incremental de contenidos ni la tipificación automática de TypeScript en compilación.
   - *Por qué se construyó así:* La Content Layer API compila los contenidos en milisegundos y desacopla la carga de datos del renderizado, permitiendo que la compilación de 21 páginas y 41 imágenes WebP tarde menos de 3 segundos en total.

3. **Aislamiento del SDK de Firebase para Proteger Métricas Web Vitals (Paso 3):**
   - *Dificultad:* La librería cliente de Firebase añade decenas de kilobytes de JavaScript que, de cargarse en el layout principal o en páginas de contenido, arruinarían el 100/100 de Lighthouse y el TBT de `0 ms`.
   - *Por qué se construyó así:* Se diseñó un aislamiento estricto donde el SDK de Firebase y la isla `AuthIsland.jsx` se confinan exclusivamente a la ruta `/login`, la cual además cuenta con directiva `noindex, nofollow`. Las 19 páginas públicas del portal se mantienen con 0 KB de Firebase.

4. **Políticas de Caché en Hosting Estático y Portabilidad Multi-CDN (Paso 4.1 — Completado en `v1.2.1`):**
   - *Dificultad 1 (Desincronización tras despliegues):* Los despliegues continuos en CDNs globales pueden sufrir desincronización de activos (*stale HTML / broken chunks*) si el navegador almacena en caché archivos HTML que referencian fragmentos CSS/JS/WebP de un build anterior cuyos hashes ya fueron reemplazados.
   - *Dificultad 2 (Divergencia de ubicación y sintaxis entre proveedores CDN):* Cloudflare Pages lee un archivo plano llamado `_headers` ubicado dentro de la carpeta final de publicación (`dist/_headers`) con comodines tipo glob (`/_astro/*`, `/*.html`), mientras que Vercel ignora `_headers` y requiere un archivo `vercel.json` en la raíz del repositorio con expresiones regulares PCRE (`/_astro/(.*)`, `/(.*)\\.html`).
   - *Por qué se construyó así:*
     1. Colocar `public/_headers` hace que el pipeline de Astro lo copie de forma transparente a `dist/_headers` en cada compilación para Cloudflare Pages.
     2. Mantener `vercel.json` en la raíz con validación `$schema` asegura compatibilidad inmediata con Vercel sin reescribir configuración si se cambia de proveedor.
     3. Aplicar `max-age=31536000, immutable` exclusivamente a `/_astro/*` elimina peticiones repetidas de fuentes WOFF2, imágenes WebP y bundles de islas, mientras `max-age=0, must-revalidate` en HTML y `max-age=3600, must-revalidate` en `/sitemap.xml` garantizan despliegues atómicos e indexación fresca.

5. **Auditoría de Control de Calidad, Estabilidad Visual y Página 404 (`v1.2.2` — Ver [`docs/QA_AUDIT.md`](QA_AUDIT.md)):**
   - *Dificultad 1 (Recorte cuadrado y desbordamiento del logotipo):* El activo `src/assets/LOGO.png` tiene dimensiones reales de 1181×292 px (proporción horizontal 4.04:1). Forzar `width={192}` y `height={192}` (`1:1`) en Astro causaba que Sharp recortara los extremos por defecto con `fit: cover` dejando solo el centro ("RICIC COACH") y desbordara 96 px hacia abajo sobre el contenido superior en todas las páginas.
   - *Dificultad 2 (Colapso del hero móvil a 0 px):* En `src/pages/index.astro`, la columna derecha del hero albergaba solo elementos con `position: absolute`. Al pasar a una sola columna en pantallas móviles (`< 768px`), el contenedor colapsaba a 0 px de alto, ocultando por completo la imagen del entrenador (`cachas.png`).
   - *Dificultad 3 (Navegación rota en servicios y ausencia de 404):* Los enlaces de retorno en las 6 especialidades apuntaban a `/` en lugar de `/servicios`, y las rutas inexistentes carecían de una plantilla `404.astro` integrada en el layout.
   - *Por qué se construyó así:* Se redimensionó el logotipo a 384×95 px (Retina 2x, relación 4.04:1 exacta, unificando la caché WebP a 5.0 KB entre cabecera y pie), se dotó al hero móvil de `min-h-[280px] sm:min-h-[340px] md:min-h-0 h-full overflow-hidden rounded-xl md:overflow-visible md:rounded-none` (preservando la dirección de arte en escritorio `-rotate-90 scale-150`), se normalizaron los enlaces a `/servicios`, se creó `src/pages/404.astro` con directiva `noindex` (alcanzando 21 páginas estáticas compiladas), se añadieron listeners para cerrar el menú móvil con `Escape`/redimensionamiento (`isOpen === true`, 0 listeners en reposo) y se blindó la validación del formulario de contacto frente a cadenas de solo espacios mediante alertas accesibles (`role="alert"`).

---

## 5. Plan de Continuación para Mañana

Con el **Paso 2** (Blog interno Content Layer), el **Paso 4.1** (Cabeceras de caché CDN en `public/_headers` y `vercel.json`) y la **Auditoría de QA (`v1.2.2`)** ya completados y verificados con 21 páginas estáticas, el orden de ejecución para mañana queda estructurado en 3 bloques:

1. **Prioridad 1 — Identidad Oficial y Marcado de Autoridad (Paso 1):**
   - *Estado:* Bloqueado únicamente a la espera de las URLs definitivas de Instagram y LinkedIn de Álvaro Aguilar.
   - *Acción:* Reemplazar los enlaces placeholder en `src/components/Footer.astro` (con `aria-label` descriptivos) y añadirlos al array `sameAs` del grafo JSON-LD en `src/components/BaseHead.astro`.
2. **Prioridad 2 — Portal de Clientes con Firebase Auth (Paso 3):**
   - *Estado:* Listo para implementar en código.
   - *Acción:* Instalar `firebase`, configurar `src/lib/firebase.js` (aislado al navegador), crear `.env.example`, desarrollar la isla `src/components/AuthIsland.jsx` (acceso con Email/Contraseña y Google Popup, manejo de errores en español y cierre de sesión) y montarla con `client:load` exclusivamente en `src/pages/login.astro`.
3. **Prioridad 3 — Despliegue en Producción y Dominio (Paso 4.2):**
   - *Estado:* Listo para conectar (las cabeceras de caché `public/_headers` y `vercel.json` ya están en el repositorio).
   - *Acción:* Vincular el repositorio `Alvar0dev/nutrition-blog` con Cloudflare Pages o Vercel, configurar los registros DNS de `nutricionalcoach.com`, activar SSL/HTTP3 y ejecutar la auditoría Lighthouse final sobre la URL pública de producción.
