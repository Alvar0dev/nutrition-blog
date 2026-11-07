# Hoja de Ruta de Optimizaciones y Mejoras de Postproducción

Documento de diagnóstico técnico y planificación de mejoras posteriores a la migración a **Astro 7**. Recoge los puntos de fricción identificados en la auditoría técnica del sitio, su justificación arquitectónica y el plan de ejecución para las siguientes sesiones de trabajo.

---

## 1. Resumen de Prioridades

| Prioridad | Área | Hallazgo principal | Impacto técnico / negocio |
|---|---|---|---|
| **Alta (P1)** | **UX & Accesibilidad Móvil** | Enlaces de navegación ocultos en móvil (`hidden md:flex`) sin menú hamburguesa. | Los usuarios móviles no pueden navegar a Blog, Servicios o Contacto desde la cabecera. |
| **Alta (P1)** | **Identidad & Branding** | El favicon del sitio apunta al logo por defecto de Vite (`/vite.svg`). | Compromete la identidad corporativa y la profesionalidad visual en pestañas del navegador. |
| **Media (P2)** | **SEO Técnico** | Falta integración de Sitemap XML (`@astrojs/sitemap`) y Schema.org (JSON-LD). | Dificulta el indexado exhaustivo por motores de búsqueda y la visibilidad local del coach. |
| **Media (P2)** | **Arquitectura de Islas** | `Navbar.jsx` y `AuthPlaceholder.jsx` se hidratan con JS sin tener interactividad activa. | Descarga y procesamiento innecesario de JavaScript en el cliente en rutas informativas. |
| **Media (P2)** | **Conversión & Formularios** | `ContactForm.jsx` previene el envío (`e.preventDefault()`) sin feedback ni servicio de correo. | Pérdida potencial de clientes que intentan enviar un mensaje directo desde `/contacto`. |
| **Baja (P3)** | **Higiene de Dependencias** | Paquetes y activos huérfanos del boilerplate anterior (`@heroicons/react`, `react.svg`, etc.). | Ruido en `package.json`, `package-lock.json` y mayor peso innecesario en el repositorio git. |

---

## 2. Detalle de Optimizaciones Planificadas

### 2.1. Navegación Móvil y Accesibilidad (P1)

- **Problema:** En `src/components/Navbar.jsx`, los enlaces se ocultan por debajo del breakpoint `md` (`768px`) mediante `hidden md:flex`, pero no existe un botón de alternancia ni panel desplegable accesible.
- **Solución técnica:**
  1. Incorporar botón de menú hamburguesa accesible con atributos `aria-expanded`, `aria-controls` y `aria-label="Abrir menú de navegación"`.
  2. Implementar el estado de apertura/cierre (`isOpen`) para desplegar los enlaces en dispositivos móviles, o migrar `Navbar` a un componente estático de Astro con `<details>/<summary>` o un script mínimo vanilla.
  3. En `src/layouts/Layout.astro`, añadir el enlace de salto accesible `<a href="#main-content" class="sr-only focus:not-sr-only">Saltar al contenido</a>` y asignar `id="main-content"` a la etiqueta `<main>`.
- **Archivos:** `src/components/Navbar.jsx`, `src/layouts/Layout.astro`.

### 2.2. Identidad Visual y Favicon (P1)

- **Problema:** `src/components/BaseHead.astro` declara `<link rel="icon" type="image/svg+xml" href="/vite.svg" />`, mostrando el logo de Vite en los navegadores.
- **Solución técnica:**
  1. Generar un favicon SVG/PNG corporativo optimizado a partir de `src/assets/LOGO.png` y alojarlo en `public/favicon.svg` o `public/favicon.ico`.
  2. Actualizar `src/components/BaseHead.astro` para apuntar al favicon corporativo.
  3. Eliminar `public/vite.svg`.
- **Archivos:** `src/components/BaseHead.astro`, `public/`.

### 2.3. SEO Técnico: Sitemap XML y Schema.org JSON-LD (P2)

- **Problema:** El sitio carece de sitemap XML dinámico y de microdatos estructurados para posicionamiento orgánico y local.
- **Solución técnica:**
  1. Instalar y configurar `@astrojs/sitemap` en `astro.config.mjs` bajo `https://nutricionalcoach.com`.
  2. Agregar la directiva `Sitemap: https://nutricionalcoach.com/sitemap-index.xml` en `public/robots.txt`.
  3. Crear un componente de datos estructurados `src/components/StructuredData.astro` con esquema Schema.org de tipo `LocalBusiness` / `Person` (Álvaro Aguilar, coach nutricional, teléfono `+34655397061`, servicios ofrecidos).
- **Archivos:** `astro.config.mjs`, `public/robots.txt`, `src/components/BaseHead.astro`, `src/components/StructuredData.astro`.

### 2.4. Refactorización de Islas y Rendimiento de JavaScript (P2)

- **Problema:**
  - `Navbar.jsx` se monta con `client:visible` en `src/layouts/Layout.astro`, pero carece de hooks de estado o efectos de React en su versión actual.
  - `AuthPlaceholder.jsx` se monta con `client:load` en `src/pages/contacto.astro` y `src/pages/login.astro`, hidratando un `<div>` completamente vacío.
- **Solución técnica:**
  1. Si `Navbar` incorpora menú móvil con React, justificar el `client:visible` o `client:media="(max-width: 768px)"` para cargar JavaScript solo en pantallas móviles.
  2. Cambiar `AuthPlaceholder` para que no use directiva `client:*` hasta que el SDK de Firebase Auth esté verdaderamente instalado e importado.
- **Archivos:** `src/layouts/Layout.astro`, `src/pages/contacto.astro`, `src/pages/login.astro`.

### 2.5. Conexión y Feedback del Formulario de Contacto (P2)

- **Problema:** `src/components/ContactForm.jsx` captura el evento `onSubmit` con un comentario placeholder y no ofrece confirmación al usuario.
- **Solución técnica:**
  1. Añadir estados visuales (`idle`, `submitting`, `success`, `error`) con deshabilitación del botón mientras procesa.
  2. Integrar un endpoint de envío (Formspree, Resend o API endpoint de Astro con adapter) o bien un fallback de tipo `mailto:` o redirección de confirmación.
  3. Validar accesibilidad en mensajes de error asociados a los campos mediante `aria-describedby`.
- **Archivos:** `src/components/ContactForm.jsx`.

### 2.6. Enlaces Sociales y Limpieza de Pie de Página (P2)

- **Problema:** En `src/components/Footer.astro`, los enlaces de redes sociales apuntan a las URLs genéricas de Instagram, Facebook y LinkedIn, y el logo institucional se muestra duplicado (en la columna informativa y al pie).
- **Solución técnica:**
  1. Reemplazar enlaces por los perfiles oficiales de Álvaro Aguilar o remover los que no correspondan.
  2. Simplificar la estructura visual unificando la presencia del logo corporativo en el pie.
- **Archivos:** `src/components/Footer.astro`.

### 2.7. Saneamiento de Dependencias y Repositorio (P3)

- **Problema:** Existen paquetes en `package.json` que no se referencian en ningún archivo del código fuente, así como archivos de imagen de 30 bytes dejados por la plantilla inicial de Vite.
- **Solución técnica:**
  1. Remover `@heroicons/react` de `dependencies`.
  2. Remover `@vitejs/plugin-react` y `eslint-plugin-react-refresh` de `devDependencies`.
  3. Eliminar archivos obsoletos en `src/assets/`: `alvaro-profile.jpg`, `muscles.jpg`, `logo-completo.svg`, `react.svg`.
  4. Optimizar o convertir el archivo fuente original `src/assets/yo.png` (17.45 MB) para agilizar tiempos de clonado de git.
- **Archivos:** `package.json`, `package-lock.json`, `src/assets/`.

---

## 3. Plan de Acción para la Próxima Sesión

1. **Paso 1:** Implementar el menú móvil accesible en `Navbar` y reemplazar el favicon `/vite.svg` por el isotipo corporativo.
2. **Paso 2:** Instalar `@astrojs/sitemap`, configurar sitemap en `robots.txt` e inyectar Schema.org JSON-LD en `BaseHead.astro`.
3. **Paso 3:** Conectar feedback y servicio de correo en `ContactForm.jsx` y deshidratar `AuthPlaceholder.jsx` hasta la fase de integración con Firebase.
4. **Paso 4:** Limpiar dependencias obsoletas en `package.json` y depurar activos huérfanos en `src/assets/`.
5. **Paso 5:** Ejecutar build de verificación (`npm run build`) y revalidar métricas Lighthouse 100/100.
