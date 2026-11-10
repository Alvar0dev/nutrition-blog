# Plan de Ejecución Detallado — Fase 2 (Postproducción y Evolución)

Documento operativo que establece la hoja de ruta paso por paso para la ejecución de la **Fase 2** en **Nutricional Coach** (`nutrition-blog`). Cada paso está diseñado como una unidad de trabajo independiente, verificable y con criterios de aceptación claros.

---

## 1. Resumen de Etapas y Secuencia de Ejecución

| Paso | Módulo | Estado | Objetivo principal | Archivos afectados | Verificación técnica |
|---|---|---|---|---|---|
| **Paso 1** | **Identidad & Redes** | Pendiente | Reemplazar URLs placeholder de redes sociales por los perfiles oficiales y sincronizar Schema.org. | `Footer.astro`, `BaseHead.astro` | Inspección visual en pie y validación de JSON-LD. |
| **Paso 2** | **Blog Interno (Content Collections)** | **Completado (`v1.2.0`)** | Migrar artículos a Markdown local con Content Layer API (`src/content.config.ts`) y generar rutas dinámicas `/blog/[slug]`. | `src/content.config.ts`, `src/content/blog/`, `src/lib/posts.js`, `src/pages/blog/`, `sitemap.xml.js` | `npm run build` genera 20 páginas estáticas + `/sitemap.xml` con 19 URLs. |
| **Paso 3** | **Portal Clientes (Firebase Auth)** | Pendiente | Conectar SDK de Firebase Authentication en `/login` para permitir acceso seguro de clientes. | `src/lib/firebase.js`, `AuthPlaceholder.jsx`, `login.astro`, `.env` | Flujo de autenticación cliente probado en local. |
| **Paso 4** | **Despliegue a Producción (CDN)** | Pendiente | Configurar pipeline de publicación (Cloudflare Pages / Vercel), cabeceras de caché y dominio. | `_headers` / `vercel.json`, `README.md` | Despliegue en vivo en `nutricionalcoach.com` con SSL y HTTP/2+. |

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

### Paso 2: Migración del Blog a Astro Content Collections (SEO Orgánico Propio)

#### 2.1. Contexto y Justificación
Actualmente, las 9 tarjetas en `src/pages/blog.astro` enlazan externamente a artículos de Fitness Revolucionario. Para captar tráfico orgánico cualificado mediante palabras clave de nutrición y rendimiento deportivo, los artículos deben alojarse dentro del propio dominio `nutricionalcoach.com` utilizando **Astro Content Collections** con validación por esquemas Zod.

#### 2.2. Tareas de Implementación
1. **Definir la colección de contenido (`src/content/config.ts`):**
   ```typescript
   import { defineCollection, z } from 'astro:content';

   const blog = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       description: z.string(),
       pubDate: z.date(),
       category: z.string(),
       image: z.string(),
       imageAlt: z.string().default('Artículo de nutrición'),
       author: z.string().default('Álvaro Aguilar'),
       tags: z.array(z.string()).default([]),
     }),
   });

   export const collections = { blog };
   ```
2. **Crear artículos iniciales en Markdown (`src/content/blog/*.md`):**
   - Crear los archivos Markdown para los artículos iniciales (e.g. `la-importancia-del-desayuno.md`, `proteinas-vegetales.md`, `nutricion-para-deportistas.md`) con su frontmatter tipado y contenido divulgativo estructurado.
3. **Crear la plantilla de detalle dinámica (`src/pages/blog/[slug].astro`):**
   - Utilizar `getStaticPaths()` para consultar todos los posts mediante `getCollection('blog')`.
   - Renderizar el contenido con `<Content />` del post.
   - Configurar metadatos específicos en `Layout.astro` (título, descripción, imagen Open Graph y artículo Schema.org tipo `BlogPosting`).
   - Añadir botón de retorno al catálogo de blog y CTA de conversión al final del artículo.
4. **Refactorizar el catálogo general (`src/pages/blog.astro`):**
   - Consultar los posts con `await getCollection('blog')` ordenados por fecha descendente.
   - Enlazar cada tarjeta a `/blog/${post.slug}`.
5. **Actualizar el generador de Sitemap (`src/pages/sitemap.xml.js`):**
   - Importar `getCollection('blog')` en `sitemap.xml.js` para inyectar automáticamente cada URL de artículo en el sitemap estático con `priority="0.8"` y `changefreq="monthly"`.
6. **Verificación:**
   - Ejecutar `npm run build` y comprobar que se generan todas las páginas estáticas `/blog/[slug]/index.html`.
   - Verificar Lighthouse en un artículo individual (objetivo: 100/100).

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

## 3. Checklist de Ejecución Rápida

- [ ] **Paso 1:** URLs reales en `Footer.astro` y JSON-LD de `BaseHead.astro`.
- [x] **Paso 2.1:** Configurar `src/content.config.ts` (Content Layer API de Astro 7 con `glob` loader) y crear los 9 artículos Markdown en `src/content/blog/*.md`.
- [x] **Paso 2.2:** Crear plantilla `src/pages/blog/[slug].astro` con JSON-LD `BlogPosting` y enlazar catálogo en `src/pages/blog/index.astro`.
- [x] **Paso 2.3:** Integrar rutas dinámicas del blog en `src/pages/sitemap.xml.js`.
- [ ] **Paso 3.1:** Instalar `firebase` y crear `src/lib/firebase.js`.
- [ ] **Paso 3.2:** Construir UI de login con Google / Email en isla React.
- [ ] **Paso 4.1:** Crear archivo de cabeceras de caché (`_headers` / `vercel.json`).
- [ ] **Paso 4.2:** Conectar repositorio a la plataforma de hosting y validar en vivo.
