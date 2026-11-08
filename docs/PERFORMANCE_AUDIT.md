# Auditoría de Rendimiento y Core Web Vitals

Este documento recoge las métricas comparativas antes y después de la migración arquitectónica a **Astro 7** y el pulido de postproducción (`v1.1.0`), incluyendo el desglose de compresión de activos, las dificultades detectadas durante el perfilado y los resultados de **Lighthouse** verificados sobre el build de producción (`npm run build` + `npm run preview`).

---

## 1. Resultados de Lighthouse en Producción

Auditoría ejecutada con Lighthouse CLI (Chrome Headless, preset Desktop) sobre las cuatro rutas principales del sitio:

| Ruta | Performance | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| `/` (Inicio) | **100 / 100** | **100 / 100** | `0.2 s` | `0.5 s` | `0 ms` | `0.015` |
| `/blog` | **100 / 100** | **100 / 100** | `0.2 s` | `0.5 s` | `0 ms` | `0.000` |
| `/contacto` | **100 / 100** | **100 / 100** | `0.2 s` | `0.4 s` | `0 ms` | `0.005` |
| `/servicios` | **100 / 100** | **100 / 100** | `0.2 s` | `0.4 s` | `0 ms` | `0.001` |

---

## 2. Optimización de Imágenes (`astro:assets` → WebP)

### 2.1. Activos locales críticos

| Activo origen | Uso en el sitio | Peso original (PNG) | Dimensiones de salida | Peso final (WebP) | Reducción |
|---|---|---:|---:|---:|---:|
| `src/assets/yo.png` | Retrato en `/contacto` | **17,041.0 KB** | `600 × 600` (`q=80`) | **16.3 KB** | **-99.90%** |
| `src/assets/cachas.png` | Hero principal en `/` | **519.9 KB** | `800 × 600` (`q=85`) | **66.7 KB** | **-87.17%** |
| `src/assets/LOGO.png` | Cabecera y pie de página | **73.7 KB** | `192 × 192` (`q=85`) | **6.0 KB** | **-91.86%** |

*(Nota: En `v1.1.0` se eliminó la segunda instancia duplicada de `LOGO.png` a `128 × 128` en el pie de página, reduciendo el total de activos generados de 33 a 32 imágenes WebP).*

### 2.2. Activos remotos (Pexels) procesados en tiempo de build

Al declarar `image: { domains: ['images.pexels.com'] }` en `astro.config.mjs`, Astro descarga, redimensiona (`400×300` y `400×320`) y codifica a WebP las **29 imágenes remotas** durante el build:

- **Rango de peso original (JPEG de cámara en Pexels):** entre `544 KB` y `6,236 KB` por fotografía.
- **Rango de peso optimizado en `dist/_astro/*.webp`:** entre **`3 KB` y `27 KB`** por fotografía.
- **Impacto directo en LCP:** En `/blog` el LCP bajó de `6.5 s` a **`0.5 s`**, y en `/servicios` bajó de `3.3 s` a **`0.4 s`**.

---

## 3. Estrategia de Prioridad de Carga (LCP & Lazy Loading)

| Elemento | Ubicación | Atributos aplicados | Justificación técnica |
|---|---|---|---|
| Imagen Hero (`cachas.png`) | `/` (above the fold) | `loading="eager" fetchpriority="high"` | Evita el antipatrón `lcp-lazy-loaded` y adelanta la descarga del elemento LCP. |
| Logotipo en `Navbar` | Todas las páginas | `loading="eager" decoding="async"` | Visible inmediatamente en el primer pintado del viewport superior. |
| Retrato profesional (`yo.png`) | `/contacto` (above the fold) | `loading="eager" fetchpriority="high"` | Elemento visual principal de la vista de contacto. |
| Primera fila de tarjetas (índices `0..2`) | `/blog` y `/servicios` | `loading="eager" decoding="async"` | Entra dentro del viewport inicial de escritorio sin retraso de intersección. |
| Resto de tarjetas, galerías y `Footer` | Bajo el pliegue (below the fold) | `loading="lazy" decoding="async"` | Ahorra ancho de banda inicial y prioriza los recursos críticos de la vista activa. |

---

## 4. Dificultades de Perfilado y Lecciones Aprendidas

1. **Penalización por `loading="lazy"` en imágenes sobre el pliegue:**
   - Inicialmente todas las tarjetas de `/blog` y `/servicios` utilizaban `loading="lazy"`. Lighthouse penalizaba el LCP porque el navegador esperaba al cálculo de layout e intersección antes de solicitar las imágenes de la primera fila. Forzar `loading="eager"` en los índices `0..2` eliminó el cuello de botella.
2. **Contención de CPU en ejecuciones concurrentes de Lighthouse:**
   - Ejecutar múltiples instancias de Chrome Headless en paralelo produjo lecturas distorsionadas de `TBT` por estrangulamiento del hilo principal del sistema operativo. La ejecución secuencial por ruta demostró un `TBT = 0 ms` estable en todas las páginas.
3. **Hidratación de islas vacías:**
   - Mantener `client:load` sobre `AuthPlaceholder.jsx` en `/contacto` y `/login` añadía trabajo de hidratación en el hilo principal sin renderizar interfaz visible. Deshidratar el componente hasta la fase de conexión con Firebase eliminó ese coste por completo.
