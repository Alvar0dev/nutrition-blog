import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  createGoogleProvider,
  getFirebaseAuth,
  isFirebaseConfigured,
} from '../lib/firebase.js';
import { getAuthErrorMessage, validateLoginInput } from '../lib/authHelpers.js';

const UNAVAILABLE_AUTH_MESSAGE =
  'El acceso no está disponible todavía porque faltan las credenciales de Firebase en la configuración del entorno.';

export default function AuthIsland() {
  const configured = isFirebaseConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(configured ? 'checking' : 'unauthenticated');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setStatus('unauthenticated');
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setStatus(currentUser ? 'authenticated' : 'unauthenticated');
      },
      (error) => {
        setErrorMessage(getAuthErrorMessage(error));
        setStatus('unauthenticated');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEmailChange = (event) => {
    if (errorMessage) setErrorMessage('');
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    if (errorMessage) setErrorMessage('');
    setPassword(event.target.value);
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setErrorMessage(UNAVAILABLE_AUTH_MESSAGE);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setErrorMessage(UNAVAILABLE_AUTH_MESSAGE);
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const provider = createGoogleProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'checking') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-8 text-center font-body text-sm text-silver"
      >
        Comprobando sesión...
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    const safePhotoUrl =
      typeof user.photoURL === 'string' && user.photoURL.startsWith('https://')
        ? user.photoURL
        : null;
    const displayLabel = user.displayName || user.email || 'Cliente';
    const initial = displayLabel.charAt(0).toUpperCase();

    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-accent/5 border border-silver/30 rounded-xl p-6 text-center space-y-5 font-body"
      >
        <div className="flex flex-col items-center space-y-3">
          {safePhotoUrl ? (
            <img
              src={safePhotoUrl}
              alt={`Foto de perfil de ${displayLabel}`}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full border-2 border-silver object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="w-16 h-16 rounded-full bg-primary text-accent font-display text-2xl flex items-center justify-center border-2 border-silver"
            >
              {initial}
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl text-silver">SESIÓN ACTIVA</h2>
            {user.displayName && (
              <p className="text-base font-semibold text-accent mt-1">{user.displayName}</p>
            )}
            {user.email && <p className="text-sm text-gray-300">{user.email}</p>}
          </div>
        </div>

        <p className="text-sm text-gray-300">
          Has iniciado sesión correctamente. Tu panel privado de seguimiento nutricional estará
          disponible aquí próximamente.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="text-sm font-body text-accent bg-primary/40 border border-primary rounded-lg px-4 py-2.5 text-left"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="w-full bg-primary text-accent py-3 rounded-lg font-display hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'CERRANDO SESIÓN...' : 'CERRAR SESIÓN'}
        </button>
      </div>
    );
  }

  return (
    <div data-auth-island className="text-left space-y-5">
      {!configured && (
        <p
          role="status"
          className="text-xs font-body text-silver bg-accent/5 border border-silver/30 rounded-lg px-3.5 py-2.5"
        >
          Configuración de Firebase pendiente (.env). Puedes validar los campos; el inicio de sesión
          real se activará al añadir las credenciales del proyecto.
        </p>
      )}

      <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-silver mb-1.5 text-sm font-body">
            Correo electrónico
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            autoComplete="email"
            aria-required="true"
            value={email}
            onChange={handleEmailChange}
            placeholder="cliente@email.com"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-lg bg-accent text-secondary placeholder-gray-500 font-body focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-silver text-sm font-body">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="text-xs font-body text-silver hover:text-accent underline transition-colors"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            name="password"
            autoComplete="current-password"
            aria-required="true"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Tu contraseña"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-lg bg-accent text-secondary placeholder-gray-500 font-body focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="text-sm font-body text-accent bg-primary/40 border border-primary rounded-lg px-4 py-2.5"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-accent py-3 rounded-lg font-display tracking-wide hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
        </button>
      </form>

      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-accent/20" />
        <span className="flex-shrink mx-3 text-xs font-body text-gray-300">o continúa con</span>
        <div className="flex-grow border-t border-accent/20" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full bg-accent text-secondary py-3 px-4 rounded-lg font-body font-semibold hover:bg-silver transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.08.73-2.46 1.16-4.23 1.16-3.25 0-6.01-2.19-7-5.15H.98v3.14C3.01 21.18 7.17 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5 14c-.25-.73-.39-1.51-.39-2.31s.14-1.58.39-2.31V6.24H.98A11.98 11.98 0 0 0 0 11.69c0 1.93.46 3.76 1.28 5.45L5 14Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.17 0 3.01 2.82.98 6.86l4.02 3.13C5.99 6.94 8.75 4.75 12 4.75Z"
          />
        </svg>
        <span>Continuar con Google</span>
      </button>
    </div>
  );
}
