# Auditoría Integral de Control de Calidad (QA Visual, Interactivo y Semántico)

Documento técnico de control de calidad que registra la inspección visual, geométrica, interactiva y semántica realizada sobre la totalidad de las 21 rutas estáticas de **Nutricional Coach** (`nutrition-blog`), detallando los hallazgos identificados, sus causas raíz a nivel de código fuente, las soluciones técnicas implementadas y la matriz final de verificación en producción.

---

## 1. Resumen Ejecutivo y Alcance

La auditoría cubrió el 100% de las rutas generadas estáticamente en el proyecto, evaluando el comportamiento en viewports estándar de escritorio (**1280×800 px**) y dispositivos móviles (**375×812 px** / iPhone X/12/13/14), así como puntos de quiebre intermedios en tablet (**768×1024 px**).

### 1.1. Inventario de Rutas Auditadas (21 rutas estáticas)

| Grupo de rutas | Rutas evaluadas | Tipo de renderizado |
|---|---|---|
| **Páginas Principales (3)** | `/` (Portada), `/contacto`, `/login` | Estático (Astro SSG) + Islas React |
| **Catálogo y Artículos de Blog (10)** | `/blog`, `/blog/la-importancia-del-desayuno`, `/blog/proteinas-vegetales`, `/blog/mitos-de-las-dietas`, `/blog/nutricion-para-deportistas`, `/blog/alimentacion-antiinflamatoria`, `/blog/gestion-del-estres-y-nutricion`, `/blog/suplementacion-inteligente`, `/blog/nutricion-para-estudiantes`, `/blog/hidratacion-y-salud` | Estático (Astro Content Layer API) |
| **Catálogo y Especialidades de Servicios (7)** | `/servicios`, `/servicios/habitos`, `/servicios/objetivos`, `/servicios/composicion`, `/servicios/salud`, `/servicios/asesoramiento`, `/servicios/educacion` | Estático (Astro SSG + `astro:assets`) |
| **Gestión de Errores (1)** | `/404` (`/404.html`) | Estático (Astro SSG con directiva `noindex`) |

### 1.2. Metodología de Inspección
1. **Inspección Geométrica y Layout:** Medición de *bounding boxes* en CSS, verificación de contención dentro del viewport, detección de desbordamientos (*overflow* horizontal y vertical) y colapso de rejillas (*grid/flex*).
2. **Interactividad y Estados:** Evaluación de navegación móvil, menús desplegables, manejadores de eventos de teclado (`Escape`, `Tab`), transiciones y validación reactiva de formularios.
3. **Semántica y Accesibilidad (WCAG 2.1 AA):** Jerarquía de encabezados (`H1` → `H2` → `H3`), atributos ARIA (`role="alert"`, `aria-expanded`, `aria-controls`, `aria-current`), gestión del foco en saltos de contenido (*skip links*) y ratios de contraste tipográfico.
4. **Optimización de Recursos (Core Web Vitals):** Estrategia de carga de imágenes sobre el pliegue (*above the fold*) para Largest Contentful Paint (LCP) y minimización de Cumulative Layout Shift (CLS).

### 1.3. Por qué las herramientas automáticas (build, linters y Lighthouse) no detectaron estos defectos

Durante el desarrollo previo, las pruebas automatizadas convencionales arrojaban resultados aparentemente perfectos: `npm run build` finalizaba con código de salida 0, `npm run lint` reportaba 0 advertencias y Lighthouse arrojaba **100/100 en Performance y SEO**. Sin embargo, existían graves anomalías visuales y de interacción que estas herramientas son estructuralmente incapaces de identificar:

1. **Limitaciones del compilador estático (`npm run build` — Astro & Vite):**
   - El compilador valida la sintaxis de plantillas `.astro`, `.jsx`, la resolución de importaciones y la emisión correcta de marcado HTML y CSS.
   - Para el pipeline de imágenes (`astro:assets` con Sharp), recibir `<Image src={logo} width={192} height={192} />` sobre un PNG de `1181×292 px` es una instrucción sintácticamente válida: Sharp ejecuta un recorte central (`fit: cover` por defecto) y genera un archivo WebP válido (200 OK). El compilador no tiene modelo semántico de visión artificial para saber que el recorte ha amputado las letras "NUT" y "AL" del nombre comercial.
   - De igual modo, un contenedor con hijos con `position: absolute` dentro de un grid con altura calculada de `0 px` es CSS plenamente válido según las especificaciones de W3C, por lo que el build se completa sin errores.

2. **Limitaciones del análisis estático de código (`npm run lint` — ESLint):**
   - ESLint analiza el árbol de sintaxis abstracta (AST) de JavaScript/React, verificando convenciones de nomenclatura, uso de variables y reglas de hooks (`react-hooks/rules-of-hooks`, `exhaustive-deps`).
   - El linter no ejecuta el código ni simula un navegador: no puede predecir que un usuario tecleará solo espacios (`"   "`), superando la validación HTML5 `required` del navegador mientras la función `handleSubmit` ejecuta un `return` mudo sin proporcionar retroalimentación visual al usuario en el DOM.
   - Tampoco analiza las consecuencias en el DOM de la omisión de listeners para la tecla `Escape` o el redimensionamiento de ventana.

3. **Limitaciones de las auditorías sintéticas (Lighthouse en reposo):**
   - Lighthouse CLI se ejecuta típicamente en Chrome Headless bajo un preset fijo (por defecto escritorio a `1280×800 px`) evaluando la página en estado pasivo/reposo tras el primer pintado.
   - **Sin interacción dinámica:** Lighthouse no abre el menú hamburguesa móvil, no presiona la tecla `Escape`, no redimensiona el viewport en caliente de móvil a escritorio (`>= 768px`) ni rellena formularios con entradas límite (como espacios en blanco).
   - **Invisibilidad de fallos en otros viewports:** La ejecución en escritorio no detecta el colapso a `0 px` del Hero móvil en pantallas inferiores a `768 px` ni evalúa el desbordamiento visual de 96 px si el contenedor padre no genera un desbordamiento horizontal global del documento.
   - **Ausencia de rastreo de 404:** Lighthouse solo audita las URLs que se le ordenan inspeccionar; no comprueba qué respuesta visual o código HTTP entrega el servidor estático ante una ruta inexistente arbitraria.
   - **Falsos positivos de accesibilidad:** Un elemento con `alt="Nutricional Coach"` satisface la regla automatizada de accesibilidad de Lighthouse para imágenes, aun cuando visualmente la imagen esté severamente recortada o superpuesta sobre el contenido principal.

Por estas razones, la inspección manual multi-viewport y las pruebas de comportamiento interactivo resultaron indispensables para blindar la versión `v1.2.2`.

### 1.4. Matriz de Resumen de Hallazgos

| ID | Severidad | Categoría | Componentes / Rutas afectadas | Estado |
|---|---|---|---|---|
| **H-01** | **Crítica** | Visual / Layout | `Navbar` (`Layout.astro`), `Footer.astro` (Todas las rutas) | **Resuelto** |
| **H-02** | **Alta** | Navegación / UX | 6 subpáginas de detalle en `/servicios/*` | **Resuelto** |
| **H-03** | **Alta** | Responsive Móvil | Hero principal en `/` (`index.astro`) | **Resuelto** |
| **H-04** | **Alta** | Enrutamiento / Retención | Servidor estático / Manejo de 404 (`404.astro`) | **Resuelto** |
| **H-05** | **Media** | Accesibilidad / Teclado | `Navbar.jsx`, `Layout.astro` | **Resuelto** |
| **H-06** | **Media** | Validación de Formulario | `ContactForm.jsx` (`/contacto`) | **Resuelto** |
| **H-07** | **Media** | Semántica / Contraste / LCP | `/servicios`, `/servicios/*`, `/blog`, `/contacto` | **Resuelto** |

---

## 2. Detalle de Hallazgos, Causa Raíz y Soluciones Técnicas

### Hallazgo 1 (Crítico — Visual / Layout): Recorte cuadrado ("RICIC COACH") y desbordamiento vertical del logotipo en `Navbar` y `Footer`

#### Descripción y Evidencia Visual
Al inspeccionar la barra de navegación superior en cualquier resolución, el logotipo corporativo aparecía amputado en sus costados izquierdo y derecho, leyéndose únicamente el fragmento central `"RICIC COACH"`. Además, la imagen generada tenía un formato cuadrado de `192 × 192 px` que, insertada dentro de una barra de navegación con altura fija de `96 px` (`h-24` de Tailwind), provocaba que los `96 px` inferiores de la imagen se desbordasen fuera de la barra, invadiendo el encabezado y el texto superior de todas las páginas del portal. El mismo defecto se reproducía en el pie de página (`Footer`).

#### Causa Raíz
El archivo de imagen original `src/assets/LOGO.png` posee dimensiones reales de **1181 × 292 px**, lo que representa una relación de aspecto horizontal panorámica de **4.04:1**. 

En `src/layouts/Layout.astro` y en `src/components/Footer.astro` se invocaba el componente de optimización de Astro con dimensiones forzadas cuadradas:
```astro
<!-- Código defectuoso previo -->
<Image
  src={defaultOgImage}
  alt="Nutricional Coach"
  width={192}
  height={192}
  format="webp"
  ...
/>
```
Al recibir `width={192}` y `height={192}` con un activo horizontal, el motor de procesamiento de imágenes Sharp aplica por defecto su política `fit: cover` siempre que la relación de aspecto de salida solicitada (`1:1`) difiera de la relación de aspecto original (`4.04:1`). Como consecuencia, Sharp aplicaba un recorte central estricto, amputando silenciosamente los extremos izquierdo y derecho de la marca ("NUT" a la izquierda y "AL" a la derecha) y dejando visible únicamente el fragmento central `"RICIC COACH"`.

Además, la imagen resultante de `192 × 192 px`, al renderizarse dentro de una barra de navegación con altura fija de `96 px` (`h-24` de Tailwind), provocaba que los `96 px` inferiores de la imagen se desbordasen verticalmente fuera de la cabecera, invadiendo y solapando el encabezado y el texto superior de todas las páginas del portal. El mismo problema de recorte visual se reproducía en el pie de página (`Footer`).

#### Solución Técnica y Razón Arquitectónica
1. **Preservación de aspecto y densidad Retina 2x:** Se recalculó la dimensión intrínseca respetando la relación de aspecto exacta `4.04:1` a densidad Retina 2x: **384 × 95 px** (`384 / 4.042 ≈ 95`), garantizando nitidez perfecta en pantallas de alta densidad (HiDPI / Retina) sin artefactos de compresión.
2. **Eliminación del desbordamiento en Navbar:** En `Navbar.jsx`, el contenedor del logotipo delimita el renderizado visual a `w-48` (`192 × 47.5 px`) en escritorio y `w-40` (`160 × 39.5 px`) en móvil. Dentro de la barra `h-24` (`96 px`), la imagen de `47.5 px` de alto queda centrada verticalmente con `24 px` de margen de seguridad superior e inferior, erradicando por completo el desbordamiento vertical.
3. **Unificación de la caché WebP (`5 KB`):** Al configurar exactamente las mismas dimensiones `width={384}` y `height={95}` tanto en `src/layouts/Layout.astro` (cabecera) como en `src/components/Footer.astro` (pie de página):
```astro
<!-- src/layouts/Layout.astro y src/components/Footer.astro -->
<Image
  src={logo}
  alt="Nutricional Coach"
  width={384}
  height={95}
  format="webp"
  quality={85}
  loading="eager"
  decoding="async"
  class="w-full h-auto rounded"
/>
```
el pipeline de Astro compila y almacena en caché un único activo WebP en `dist/_astro/` de tan solo **5.0 KB**. Ambas instancias comparten este recurso unificado en lugar de compilar activos duplicados, reduciendo el tiempo de compilación y optimizando la caché de red del navegador.

---

### Hallazgo 2 (Alto — Navegación): Enlace `"← Volver a Servicios"` apuntando a `/` en lugar de `/servicios`

#### Descripción y Evidencia
En la parte superior de las seis páginas individuales de especialidad nutricional existía un botón de retorno contextual con el texto explícito `"← Volver a Servicios"`. Sin embargo, al hacer clic sobre el enlace, el navegador enviaba al usuario a la página de inicio raíz (`/`) en lugar de devolverlo al catálogo de servicios (`/servicios`), rompiendo el flujo de navegación esperado.

#### Causa Raíz
En las seis plantillas (`src/pages/servicios/habitos.astro`, `objetivos.astro`, `composicion.astro`, `salud.astro`, `asesoramiento.astro` y `educacion.astro`), la etiqueta `<a>` superior contenía de forma invariable el atributo `href="/"`.

#### Solución Técnica Aplicada
Se corrigió la ruta de destino a `href="/servicios"` en los 6 archivos:
```astro
<!-- src/pages/servicios/*.astro -->
<a href="/servicios" class="text-primary hover:text-opacity-80 mb-8 inline-block">
  ← Volver a Servicios
</a>
```

---

### Hallazgo 3 (Alto — Responsive Móvil): Colapso a `0 px` de la imagen Hero en la portada móvil (`< 768px`)

#### Descripción y Evidencia
Al cargar la página de inicio (`/`) en un dispositivo móvil con ancho de pantalla inferior a `768 px` (e.g. `375×812 px`), la fotografía principal del entrenador (`cachas.png`) desaparecía por completo de la pantalla, dejando un espacio vacío o saltando bruscamente al listado de servicios.

#### Causa Raíz
En `src/pages/index.astro`, la sección Hero está estructurada como un grid (`grid grid-cols-1 md:grid-cols-2`). En escritorio (`md:grid-cols-2`), la columna derecha heredaba automáticamente la altura de la columna izquierda gracias al estiramiento natural (*stretch*) de las celdas de rejilla cuando el contenido de la columna izquierda (H1, descripción y botones CTA) fluía en el documento.

No obstante, en la vista móvil de una sola columna (`grid-cols-1`), cada fila del grid calcula su altura de forma independiente a partir de sus propios elementos en flujo. La columna derecha estaba declarada de la siguiente forma:
```html
<!-- Estructura defectuosa previa -->
<div class="relative h-full">
  <div class="absolute right-0 top-0 bottom-0 w-full">
    <Image src={cachas} ... />
  </div>
</div>
```
Dado que el contenedor padre `<div class="relative h-full">` solo contenía un hijo con posicionamiento `position: absolute`, y los elementos posicionados absolutamente quedan completamente fuera del flujo normal del documento sin aportar altura intrínseca, la altura computada del contenedor padre colapsaba a exactamente **`0 px`**, haciendo la imagen invisible para cualquier usuario en smartphone.

#### Solución Técnica y Razón Arquitectónica
Se aplicó la regla responsiva `min-h-[280px] sm:min-h-[340px] md:min-h-0 h-full overflow-hidden rounded-xl md:overflow-visible md:rounded-none`:
```astro
<!-- src/pages/index.astro -->
<div class="relative min-h-[280px] sm:min-h-[340px] md:min-h-0 h-full overflow-hidden rounded-xl md:overflow-visible md:rounded-none">
  <div class="absolute right-0 top-0 bottom-0 w-full">
    <Image
      src={cachas}
      alt="Nutricional Coach - Álvaro Aguilar"
      width={800}
      height={600}
      format="webp"
      quality={85}
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="w-full h-full object-cover object-top md:object-center"
    />
  </div>
</div>
```
1. **Recuperación de visibilidad móvil sin CLS:** En pantallas móviles (`< 768px`), `min-h-[280px]` (para móviles compactos de 375 px) y `sm:min-h-[340px]` (para pantallas intermedias de 640 px) proporcionan una altura intrínseca garantizada sobre la cual el hijo absoluto puede expandirse al 100%, reservando el espacio de inmediato para evitar cualquier Cumulative Layout Shift (CLS = 0). Las clases `overflow-hidden rounded-xl` contienen el encuadre de la fotografía dentro de los márgenes de la tarjeta móvil.
2. **Preservación intacta de la dirección de arte en escritorio:** En pantallas de escritorio a partir de `md:`, las clases `md:min-h-0 md:overflow-visible md:rounded-none` anulan las restricciones móviles y devuelven el control al estiramiento del grid bidimensional. Esto permite preservar con total fidelidad la dirección de arte original concebida para escritorio (efectos de rotación y escala como `-rotate-90 scale-150` en el recorte visual del entrenador) sin cortes artificiales ni distorsiones geométricas.

---

### Hallazgo 4 (Alto — Enrutamiento y Retención): Ausencia de página 404 personalizada (`src/pages/404.astro`)

#### Descripción y Evidencia
Al introducir cualquier URL inexistente o con un error tipográfico (por ejemplo `/servicio`, `/articulo`, `/contacto-directo`), el navegador recibía una página de error genérica en texto plano del servidor web sin estilos corporativos, sin barra de navegación ni pie de página, impidiendo al usuario continuar navegando por el sitio.

#### Causa Raíz
El repositorio carecía de una plantilla `src/pages/404.astro`. Como resultado, el comando de compilación estática de Astro no generaba el archivo estándar `/404.html` que las plataformas de alojamiento web estático y CDNs (Cloudflare Pages, Vercel, Netlify, Apache, Nginx) buscan y sirven automáticamente ante códigos de estado HTTP 404 en rutas no encontradas.

#### Solución Técnica y Razón Arquitectónica
Se implementó la vista `src/pages/404.astro` totalmente integrada en el layout maestro `Layout.astro`:
1. **Directiva SEO `noindex={true}`:** Se pasa `noindex={true}` a `Layout.astro`, lo que inyecta `<meta name="robots" content="noindex, nofollow" />` en la cabecera del documento. Esto instruye inequívocamente a los rastreadores de Google y otros motores de búsqueda a no indexar respuestas de error ni acumular enlaces huérfanos, evitando penalizaciones por *soft-404*.
2. **Tres llamadas a la acción (CTAs) de recuperación estratégica:** En lugar de presentar un callejón sin salida, la vista ofrece 3 vías de reenganche hacia las secciones troncales del portal:
   - **"VOLVER AL INICIO"** (`/`): Retorno directo a la portada.
   - **"VER SERVICIOS"** (`/servicios`): Catálogo de especialidades nutricionales.
   - **"IR AL BLOG"** (`/blog`): Catálogo de artículos divulgativos.
3. **Servicio automático en CDNs (`public/_headers` y `vercel.json`):** Al compilar con `npm run build`, Astro emite de forma determinista `dist/404.html`. Las reglas de CDN configuradas en `public/_headers` y `vercel.json` permiten que tanto Cloudflare Pages como Vercel sirvan este archivo automáticamente con código HTTP 404 ante cualquier ruta no coincidente, reteniendo al usuario dentro del ecosistema de la marca.

---

### Hallazgo 5 (Medio — Accesibilidad y Teclado): Cierre del menú móvil con tecla `Escape`, redimensionamiento de ventana y foco de `"Saltar al contenido principal"`

#### Descripción y Evidencia
1. En dispositivos móviles o pantallas reducidas, una vez abierto el menú de navegación desplegable, pulsar la tecla `Escape` no cerraba el panel, obligando a los usuarios de teclado o lectores de pantalla a tabear secuencialmente por todos los enlaces o buscar el botón de alternancia.
2. Si el usuario abría el menú móvil y posteriormente ampliaba la ventana del navegador a resolución de escritorio (`>= 768px`), el estado interno del componente `isOpen` permanecía en `true`, de modo que al volver a reducir la ventana el menú continuaba abierto sin interacción deliberada.
3. El enlace de accesibilidad *"Saltar al contenido principal"* (`<a href="#main-content">`) transfería el scroll al elemento `<main id="main-content">`, pero este carecía de capacidad de enfoque programático, por lo que la siguiente pulsación de `Tab` no continuaba desde el primer elemento interactivo del contenido principal.

#### Causa Raíz
1. En `src/components/Navbar.jsx`, el estado reactivo `isOpen` no disponía de manejadores de eventos (*listeners*) de ventana para `keydown` ni para `resize`.
2. En `src/layouts/Layout.astro`, la etiqueta `<main id="main-content" class="flex-grow">` no tenía declarado el atributo `tabindex="-1"`.

#### Solución Técnica y Razón Arquitectónica
1. **Manejadores condicionales con 0 oyentes en reposo (`Navbar.jsx`):**
   Se incorporó un hook `useEffect` en `src/components/Navbar.jsx` con guardia de salida anticipada (`if (!isOpen) return undefined;`). Esto garantiza que mientras el menú móvil permanezca cerrado, existen **cero listeners globales activos** vinculados al objeto `window`:
```jsx
// src/components/Navbar.jsx
useEffect(() => {
  if (!isOpen) return undefined;

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
  };
}, [isOpen]);
```
   - **Por qué se construyó así:** Vincular listeners globales de forma persistente cuando el menú está cerrado consume recursos de ejecución innecesarios en cada pulsación de tecla o redimensionamiento. Con este diseño condicional, los manejadores solo se suscriben cuando el modal está activo en pantalla, satisfaciendo el criterio WCAG 2.1 AA (cierre intuitivo mediante `Escape` y reseteo al cruzar el breakpoint de escritorio `>= 768px`), y se desuscriben inmediatamente tan pronto como el menú se cierra o el componente se desmonta.

2. **Enfoque programático del salto de accesibilidad (`Layout.astro`):**
```astro
<!-- src/layouts/Layout.astro -->
<main id="main-content" tabindex="-1" class="flex-grow outline-none">
  <slot />
</main>
```
   Al incluir `tabindex="-1"`, los navegadores permiten que el foco de accesibilidad sea recibido programáticamente por el contenedor `<main>` tras pulsar el enlace *"Saltar al contenido principal"*. Esto garantiza que la siguiente pulsación de `Tab` interactúe con el primer enlace o botón dentro del contenido principal, mientras que la clase `outline-none` previene la aparición de un recuadro de foco visible no deseado para usuarios de ratón.

---

### Hallazgo 6 (Medio — Validación de Formulario): Fallo silencioso ante campos con solo espacios en blanco en `ContactForm.jsx`

#### Descripción y Evidencia
En la página de contacto (`/contacto`), si un usuario rellenaba los campos obligatorios del formulario pulsando únicamente la barra espaciadora (por ejemplo `"   "` en el nombre, email o mensaje) y enviaba el formulario, el navegador superaba la validación HTML5 `required`, pero la interfaz no ejecutaba el envío ni proporcionaba ninguna respuesta visual, desconcertando al usuario.

#### Causa Raíz
El atributo HTML5 `required` valida únicamente que el campo no esté estrictamente vacío (`value.length > 0`). Dado que las cadenas compuestas exclusivamente por espacios en blanco poseen longitud mayor a cero, el navegador las acepta como válidas.

En `src/components/ContactForm.jsx`, la función `handleSubmit` saneaba las entradas con `.trim()`:
```javascript
const trimmed = {
  name: formData.name.trim(),
  email: formData.email.trim(),
  message: formData.message.trim(),
};

if (!trimmed.name || !trimmed.email || !trimmed.message) {
  return; // Aborto silencioso sin respuesta visual
}
```
Al detectar campos vacíos tras el `.trim()`, la función ejecutaba un `return` mudo sin alterar ningún estado de React, dejando al usuario frente a un botón inerte sin saber qué ocurría.

#### Solución Técnica y Razón Arquitectónica
1. **Estado reactivo de alerta (`errorMessage`):** Se introdujo una variable de estado para capturar y mostrar el error de validación semántica.
2. **Mensaje explícito en español:** Cuando la validación post-`.trim()` falla, se actualiza el estado inmediatamente:
```javascript
if (!trimmed.name || !trimmed.email || !trimmed.message) {
  setErrorMessage('Por favor, completa todos los campos con texto válido antes de enviar.');
  return;
}
```
3. **Banner accesible con `role="alert"`:** Se renderiza un contenedor con el atributo semántico `role="alert"`, asegurando que lectores de pantalla anuncien el fallo de inmediato:
```jsx
{errorMessage && (
  <p
    role="alert"
    className="text-sm font-body text-accent bg-primary/40 border border-primary rounded-lg px-4 py-2.5"
  >
    {errorMessage}
  </p>
)}
```
4. **Reseteo contextual:** El mensaje de error se limpia automáticamente tan pronto como el usuario vuelve a escribir en cualquier campo (`handleChange`) o cuando limpia el formulario (`handleReset`), guiando al usuario sin fricción.

---

### Hallazgo 7 (Medio — Semántica HTML, Jerarquía de Encabezados, Contraste y LCP en Servicios, Blog y Contacto)

#### Descripción y Evidencia
Durante la auditoría de accesibilidad semántica y rendimiento de carga se detectaron varias inconsistencias menores pero acumulativas:
1. **Saltos en la jerarquía de encabezados:** En `/servicios`, en las 6 páginas `/servicios/*.astro` y en `/contacto`, los títulos de secciones saltaban de `H1` directamente a `H3` sin pasar por `H2`. Adicionalmente, el estado de éxito de `ContactForm.jsx` utilizaba un `<h4>`.
2. **Inconsistencia de rejilla en Servicios:** La página `/servicios/habitos.astro` utilizaba una altura de imagen de `h-48` y una clase `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, a diferencia de las otras 5 páginas de especialidad que utilizaban `h-64` y `md:grid-cols-3`.
3. **Retraso de LCP en páginas de detalle:** La primera imagen de la galería superior en las páginas de servicios contaba con atributo `loading="lazy"`, retrasando la visualización del recurso principal sobre el pliegue.
4. **Ratio de contraste en `/blog`:** Los metadatos de fecha y tiempo de lectura utilizaban la clase `text-gray-500` sobre el fondo oscuro `#111111`, quedando al límite del ratio de contraste mínimo recomendado por WCAG (4.5:1).

#### Causa Raíz
Divergencias en el marcado de plantillas originadas durante las migraciones tempranas desde la SPA original en React hacia las páginas estáticas de Astro.

#### Solución Técnica y Razón Arquitectónica
1. **Jerarquía secuencial estricta de encabezados (`H1` → `H2` → `H3`):**
   - **Por qué es obligatoria para tecnologías de asistencia:** Los usuarios de lectores de pantalla (como NVDA, JAWS o VoiceOver) dependen de atajos de teclado para saltar secuencialmente entre niveles de encabezado (pulsando '2' para recorrer secciones principales o '3' para subsecciones). Saltar de `H1` directamente a `H3` desorienta al usuario, sugiriendo que se ha omitido una sección intermedia o transmitiendo una estructura caótica del documento.
   - **Por qué es indispensable para parsers y SEO:** Los algoritmos de indexación de Google analizan el esquema tipográfico para construir el árbol temático de relevancia. Una jerarquía no anidada deforma la interpretación de qué contenidos son divisiones principales y cuáles son complementarios.
   - **Ajustes aplicados:**
     - En `/servicios/index.astro`, las tarjetas de servicios se promovieron de `<h3>` a `<h2 class="font-display text-2xl text-accent mb-2">`.
     - En las 6 páginas `/servicios/*.astro`, las tarjetas se normalizaron a `<h2 class="font-display text-xl text-silver mb-2">`.
     - En `/contacto.astro`, el título del contenedor del formulario se normalizó a `<h2 class="font-display text-2xl text-silver mb-6">ENVÍAME UN MENSAJE</h2>`.
     - En `ContactForm.jsx`, el mensaje de confirmación se ajustó a `<h3 class="font-display text-2xl text-silver">¡MENSAJE PREPARADO!</h3>`.
2. **Unificación visual en `habitos.astro`:** Se ajustó la rejilla a `grid grid-cols-1 md:grid-cols-3 gap-8 mb-12` y las imágenes a `class="w-full h-64 object-cover"`, homogeneizando el diseño con las otras 5 especialidades.
3. **Optimización LCP en servicios y blog:**
   - En las 6 páginas de servicio, la primera imagen de la galería (`index === 0`) se marcó con `loading="eager"`.
   - En `/blog/index.astro`, la primera tarjeta del listado se marcó con `fetchpriority="high"`.
4. **Mejora de contraste tipográfico:** En `src/pages/blog/index.astro`, la fecha y el tiempo de lectura se actualizaron a `text-gray-400`, superando holgadamente el ratio de contraste exigido (superior a 5.5:1).

---

## 3. Matriz de Verificación Técnica de las 21 Rutas

Verificación efectuada sobre la compilación estática de producción (`npm run build`) y probada en servidor local (`npm run preview`):

| # | Ruta evaluada | Viewport Escritorio (1280×800) | Viewport Móvil (375×812) | Jerarquía Semántica | Estado QA |
|---|---|---|---|---|---|
| 1 | `/` | Logotipo 192×48 px alineado en h-24; LCP Hero 0.5s | Logotipo 160×40 px; Hero min-h 280px visible; menú móvil funcional | H1 → H2 | **Conforme** |
| 2 | `/blog` | Cuadrícula 3 cols; fechas legibles (gray-400); primer post fetchpriority high | Cuadrícula 1 col; tarjetas táctiles completas | H1 → H2 | **Conforme** |
| 3 | `/blog/la-importancia-del-desayuno` | Hero 1200×600 WebP; migas de pan; CTAs operativos | Lectura tipográfica óptima; botones apilados | H1 → H2 | **Conforme** |
| 4 | `/blog/proteinas-vegetales` | Hero WebP; Schema BlogPosting verificado | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 5 | `/blog/mitos-de-las-dietas` | Hero WebP; navegación por teclado funcional | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 6 | `/blog/nutricion-para-deportistas` | Hero WebP; enlaces internos consistentes | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 7 | `/blog/alimentacion-antiinflamatoria` | Hero WebP; tipografía legible | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 8 | `/blog/gestion-del-estres-y-nutricion`| Hero WebP; tiempo de lectura exacto | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 9 | `/blog/suplementacion-inteligente` | Hero WebP; CTAs WhatsApp/Forms operativos | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 10 | `/blog/nutricion-para-estudiantes` | Hero WebP; etiquetas temáticas | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 11 | `/blog/hidratacion-y-salud` | Hero WebP; metadatos Open Graph completos | Formato adaptativo sin overflow | H1 → H2 | **Conforme** |
| 12 | `/servicios` | 6 tarjetas en grid; encabezados H2; imágenes LCP optimizadas | Columna única; textos y botones perfectamente legibles | H1 → H2 | **Conforme** |
| 13 | `/servicios/habitos` | Enlace retorno a `/servicios`; imágenes h-64; 3 cols | Retorno operativo; galería vertical fluida | H1 → H2 | **Conforme** |
| 14 | `/servicios/objetivos` | Enlace retorno a `/servicios`; imagen 1 eager | Retorno operativo; galería vertical fluida | H1 → H2 | **Conforme** |
| 15 | `/servicios/composicion` | Enlace retorno a `/servicios`; imagen 1 eager | Retorno operativo; galería vertical fluida | H1 → H2 | **Conforme** |
| 16 | `/servicios/salud` | Enlace retorno a `/servicios`; imagen 1 eager | Retorno operativo; galería vertical fluida | H1 → H2 | **Conforme** |
| 17 | `/servicios/asesoramiento` | Enlace retorno a `/servicios`; CTA WhatsApp verificado | Retorno operativo; enlace directo a WhatsApp | H1 → H2 | **Conforme** |
| 18 | `/servicios/educacion` | Enlace retorno a `/servicios`; CTA WhatsApp verificado | Retorno operativo; enlace directo a WhatsApp | H1 → H2 | **Conforme** |
| 19 | `/contacto` | Retrato 600×600 WebP; formulario con validación saneada | Formulario adaptado; mensaje de alerta accesible | H1 → H2 → H3 | **Conforme** |
| 20 | `/login` | Formulario accesible; directiva noindex verificada | Vista centrada y legible | H1 | **Conforme** |
| 21 | `/404` (`/404.html`) | Nueva plantilla integrada; 3 botones de retorno; noindex | Layout completo sin rotura visual ni técnica | H1 | **Conforme** |

---

## 4. Conclusiones y Estado del Proyecto

Todas las anomalías visuales, de navegación, de accesibilidad por teclado y de semántica han sido resueltas en el código fuente y verificadas mediante validación estática y visual. El proyecto genera de manera limpia y determinista sus **21 páginas estáticas** (incluyendo `/404.html`), manteniendo **0 errores en el linter (`eslint .`)** y un tiempo de compilación inferior a 1.5 segundos.

### 4.1. Estado Actual del Sistema (`v1.2.2`)
- **Compilación estática:** 21 páginas HTML válidas y reproducibles generadas en `dist/`.
- **Pipeline de activos WebP:** Logotipo unificado en `384×95 px` (5.0 KB) compartido entre cabecera y pie; retrato `yo.png` en 16.3 KB; fotografía hero `cachas.png` en 66.7 KB; 29 fotografías de catálogo Pexels compiladas entre 3 KB y 27 KB.
- **Rendimiento y SEO:** 100/100 en Lighthouse en todas las rutas principales con TBT de 0 ms y CLS de 0.
- **Políticas CDN:** Cabeceras multi-proveedor configuradas en `public/_headers` (Cloudflare Pages) y `vercel.json` (Vercel) para caché inmutable en `/_astro/*` (1 año) y revalidación inmediata en HTML y sitemap.

### 4.2. Plan de Continuación para Mañana (TODOs Prioritarios)
1. **TODO 1 — Identidad y Perfiles Sociales Oficiales (Paso 1):**
   - *Dependencia:* Handles/URLs oficiales de Instagram y LinkedIn de Álvaro Aguilar.
   - *Acción:* Actualizar los enlaces de `src/components/Footer.astro` con atributos de accesibilidad `aria-label` descriptivos y sincronizar el array `sameAs` del grafo JSON-LD en `src/components/BaseHead.astro`.
2. **TODO 2 — Portal de Clientes con Firebase Authentication (Paso 3):**
   - *Dependencia:* Credenciales del proyecto de Firebase en consola de Google Cloud/Firebase.
   - *Acción:* Instalar `firebase`, crear el cliente en `src/lib/firebase.js` (con aislamiento estricto al navegador), documentar `.env.example`, construir la isla interactiva `src/components/AuthIsland.jsx` (Email/Password + Google Popup) y montarla con `client:load` exclusivamente en `src/pages/login.astro` (protegida con `noindex`).
3. **TODO 3 — Despliegue en Producción y Validación de Dominio (Paso 4.2):**
   - *Dependencia:* Elección de plataforma definitiva (Cloudflare Pages o Vercel) y acceso DNS a `nutricionalcoach.com`.
   - *Acción:* Vincular el repositorio a la plataforma de hosting, validar que `dist/_headers` o `vercel.json` apliquen las reglas de caché inmutable, configurar los registros CNAME/A, verificar el certificado SSL/TLS y ejecutar la auditoría Lighthouse final en producción real sobre la URL pública.

*(Para más detalles técnicos de planificación, consultar [`POST_PRODUCTION_ROADMAP.md`](POST_PRODUCTION_ROADMAP.md) y [`PLAN_FASE_2_EJECUCION.md`](PLAN_FASE_2_EJECUCION.md)).*
