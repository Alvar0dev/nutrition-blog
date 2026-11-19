# Tutorial de Configuración de Firebase Authentication (Plan Gratuito Spark)

Guía paso a paso para crear una cuenta gratuita en **Firebase** (sin tarjeta de crédito), habilitar el acceso por **Correo/Contraseña** y **Google**, y conectar las credenciales con el portal de clientes (`/login`) de **Nutricional Coach**.

> **Resumen de coste y alcance:** El plan gratuito **Spark** cubre hasta **50.000 usuarios activos mensuales (MAU)** para autenticación con correo/contraseña y Google sin requerir método de pago. Este proyecto solo utiliza el módulo de autenticación del navegador; no es necesario activar Firebase Hosting ni bases de datos de pago.

---

## Ruta rápida

1. Crear el proyecto en Firebase Console dentro del **Plan Spark (Gratis)**.
2. Registrar una aplicación **Web (`</>`)** y obtener el bloque `firebaseConfig`.
3. Activar los proveedores **Correo electrónico / Contraseña** y **Google** en **Authentication**.
4. Crear un usuario de prueba y revisar los **Dominios autorizados** (`localhost` y futuro dominio en producción).
5. Copiar `.env.example` a `.env`, rellenar las 6 variables `PUBLIC_FIREBASE_*` y probar `/login`.

---

## Paso 1: Crear el proyecto gratuito en Firebase

1. Inicia sesión con una cuenta de Google en [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **Crear un proyecto** (o **Agregar proyecto**).
3. Introduce un nombre identificativo, por ejemplo `nutricional-coach`, y pulsa **Continuar**.
4. **Google Analytics (opcional):** Puedes desactivar Google Analytics para simplificar el alta inicial (no es necesario para Firebase Auth) y pulsar **Crear proyecto**.
5. Espera unos segundos a que finalice el aprovisionamiento y pulsa **Continuar**.
6. Verifica en la esquina inferior izquierda (junto al nombre del proyecto) que el plan activo indica **Spark** (gratuito, sin facturación asociada).

---

## Paso 2: Registrar la aplicación Web y copiar `firebaseConfig`

1. En la vista general del proyecto (**Project Overview**), pulsa el icono **Web (`</>`)** para añadir una aplicación web.
2. Escribe un apodo interno para la app, por ejemplo `nutricional-coach-web`.
3. **No marques** la casilla *"También configura Firebase Hosting para esta app"* (el portal se despliega en Cloudflare Pages o Vercel).
4. Pulsa **Registrar app**.
5. En pantalla aparecerá un bloque JavaScript llamado `firebaseConfig` similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nutricional-coach.firebaseapp.com",
  projectId: "nutricional-coach",
  storageBucket: "nutricional-coach.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. Guarda estos 6 valores (los necesitarás en el **Paso 5**) y pulsa **Ir a la consola**.

*(Si en cualquier momento necesitas volver a ver estas claves, entra en **Configuración del proyecto** mediante el icono de engranaje en el menú izquierdo → pestaña **General** → sección **Tus apps**).*

---

## Paso 3: Activar Correo/Contraseña y Acceso con Google

1. En el menú lateral izquierdo, abre **Compilación** (o **Build**) → **Authentication**.
2. Pulsa **Comenzar** (*Get started*).
3. Entra en la pestaña **Sign-in method** (*Método de inicio de sesión*).

### 3.1. Habilitar Correo electrónico / Contraseña
1. Selecciona el proveedor **Correo electrónico / Contraseña** (*Email/Password*).
2. Activa el primer interruptor **Habilitar** (*Enable*).
3. Deja **desactivado** el segundo interruptor (*Vínculo de correo electrónico sin contraseña*), ya que el plan Spark limita ese flujo secundario a 5 correos/día y el portal usa contraseña clásica.
4. Pulsa **Guardar**.

### 3.2. Habilitar Google
1. En la misma pestaña **Sign-in method**, pulsa **Agregar un proveedor nuevo** (*Add new provider*).
2. Elige **Google** y activa el interruptor **Habilitar**.
3. En **Correo electrónico de asistencia del proyecto**, selecciona tu dirección de correo de Google en el desplegable.
4. Pulsa **Guardar**.

---

## Paso 4: Dominios autorizados y usuarios de prueba

### 4.1. Revisar dominios autorizados
Firebase bloquea por seguridad el inicio de sesión con Google desde dominios que no figuren en su lista blanca:

1. Dentro de **Authentication**, ve a la pestaña **Settings** (*Configuración*) → **Authorized domains** (*Dominios autorizados*).
2. Comprueba que `localhost` ya aparece en la lista (permite probar en local sin cambios).
3. **Cuando publiques la web en producción**, recuerda volver aquí y pulsar **Agregar dominio** para añadir:
   - Tu dominio definitivo (por ejemplo, `nutricionalcoach.com` y `www.nutricionalcoach.com`).
   - El subdominio temporal que asigne tu hosting si pruebas antes de apuntar las DNS (por ejemplo, `*.pages.dev` o `*.vercel.app`).

### 4.2. Dar de alta un cliente / usuario de prueba
1. Ve a **Authentication** → pestaña **Users** (*Usuarios*).
2. Pulsa **Agregar usuario** (*Add user*).
3. Introduce un correo y una contraseña de al menos 6 caracteres y confirma.
   *(Los usuarios que accedan con el botón **Continuar con Google** se crearán automáticamente en esta lista tras su primer acceso).*

---

## Paso 5: Conectar las credenciales en el proyecto local

En la raíz del repositorio existe la plantilla [`.env.example`](../.env.example). El archivo real `.env` está excluido en [`.gitignore`](../.gitignore) para no subir configuraciones locales al repositorio.

### 5.1. Tabla de correspondencia

| Propiedad en `firebaseConfig` | Variable en `.env` | Uso en el proyecto |
|---|---|---|
| `apiKey` | `PUBLIC_FIREBASE_API_KEY` | Identificador público del proyecto web |
| `authDomain` | `PUBLIC_FIREBASE_AUTH_DOMAIN` | Dominio OAuth para popups de Google |
| `projectId` | `PUBLIC_FIREBASE_PROJECT_ID` | Identificador único del proyecto |
| `storageBucket` | `PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento asociado |
| `messagingSenderId` | `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID de mensajería del proyecto |
| `appId` | `PUBLIC_FIREBASE_APP_ID` | Identificador de la app web registrada |

### 5.2. Crear `.env` y probar en local

1. Copia la plantilla en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env`)*
2. Abre `.env` y sustituye los valores de ejemplo por los 6 valores reales del **Paso 2** (sin comillas ni espacios extra).
3. Arranca el servidor de desarrollo o genera el build de previsualización:
   ```bash
   npm run dev
   ```
   *(Nota: Astro incrusta las variables `PUBLIC_*` durante el build estático. Si editas `.env` mientras `npm run dev` está abierto, reinicia el servidor; si usas `npm run preview`, ejecuta antes `npm run build`).*
4. Abre `http://localhost:4321/login` en tu navegador:
   - El aviso de *"Configuración de Firebase pendiente (.env)"* habrá desaparecido.
   - Prueba el acceso con el usuario creado en el **Paso 4.2** y con el botón **Continuar con Google**.
   - Verifica que aparece la tarjeta **SESIÓN ACTIVA** y que el botón **CERRAR SESIÓN** cierra la sesión correctamente.

---

## Paso 6: Configuración al desplegar en producción (Cloudflare Pages / Vercel)

Cuando conectes el repositorio a **Cloudflare Pages** o **Vercel**:

1. Entra en **Settings → Environment Variables** dentro del panel de tu proveedor.
2. Añade las mismas 6 variables `PUBLIC_FIREBASE_*` con sus valores reales (para producción y preview).
3. Lanza un nuevo despliegue (*redeploy*) para que Vite compile el bundle de `/login` con esas variables embebidas.
4. Verifica que tu dominio público figura en **Authentication → Settings → Authorized domains** en Firebase Console.

---

## Resolución de errores frecuentes

| Síntoma / Error | Causa habitual | Solución |
|---|---|---|
| Sigue apareciendo el aviso `Configuración de Firebase pendiente (.env)` | Alguna clave obligatoria (`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `APP_ID`) está vacía, conserva valores de plantilla (`tu_api_key`, `tu_app_id`) o no se reinició el build | Revisa `.env`, elimina comillas innecesarias y reinicia `npm run dev` (o vuelve a ejecutar `npm run build`). |
| `Este método de acceso no está habilitado` (`auth/operation-not-allowed`) | Falta activar el proveedor Email/Password o Google en Firebase Console | Completa el **Paso 3** en *Authentication → Sign-in method*. |
| `Este dominio no está autorizado` (`auth/unauthorized-domain`) | Estás probando desde una URL pública o IP que no está en la lista blanca | Añade el dominio exacto en **Paso 4.1** (*Authorized domains*). |
| El navegador bloquea la ventana de Google (`auth/popup-blocked`) | Bloqueador de ventanas emergentes activo | Permite los popups para ese dominio en el navegador e inténtalo de nuevo. |

---

## Checklist de verificación

- [ ] Proyecto creado en Firebase Console bajo el **Plan Spark** (gratuito).
- [ ] App Web (`</>`) registrada y 6 valores copiados.
- [ ] Proveedores **Correo electrónico / Contraseña** y **Google** habilitados en *Sign-in method*.
- [ ] Archivo `.env` creado en local a partir de `.env.example` (sin modificar `.gitignore`).
- [ ] Acceso y cierre de sesión verificados en `http://localhost:4321/login`.
- [ ] Variables `PUBLIC_FIREBASE_*` y dominio autorizados contemplados para el despliegue en producción.
