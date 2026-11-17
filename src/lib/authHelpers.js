const REQUIRED_FIREBASE_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];

const PLACEHOLDER_VALUES = new Set([
  'tu_api_key',
  'tu_sender_id',
  'tu_app_id',
  'your_api_key',
  'your_sender_id',
  'your_app_id',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'El formato del correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta con Álvaro para más información.',
  'auth/user-not-found': 'No existe ninguna cuenta asociada a este correo electrónico.',
  'auth/wrong-password': 'La contraseña introducida no es correcta.',
  'auth/invalid-credential': 'Correo electrónico o contraseña incorrectos.',
  'auth/too-many-requests':
    'Demasiados intentos fallidos. Espera unos minutos antes de volver a intentarlo.',
  'auth/popup-closed-by-user':
    'Se cerró la ventana de acceso con Google antes de completar el inicio de sesión.',
  'auth/popup-blocked':
    'El navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  'auth/cancelled-popup-request': 'Se canceló la solicitud de acceso con Google.',
  'auth/network-request-failed':
    'Error de conexión. Revisa tu acceso a internet e inténtalo de nuevo.',
  'auth/operation-not-allowed':
    'Este método de acceso no está habilitado en la configuración de Firebase.',
  'auth/unauthorized-domain':
    'Este dominio no está autorizado en la configuración de Firebase.',
};

/**
 * Checks whether all required Firebase web config fields are present and non-placeholder.
 *
 * @param {Record<string, unknown> | null | undefined} config
 * @returns {boolean}
 */
export function isFirebaseConfigComplete(config) {
  if (!config || typeof config !== 'object') {
    return false;
  }

  return REQUIRED_FIREBASE_KEYS.every((key) => {
    const value = config[key];
    if (typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 && !PLACEHOLDER_VALUES.has(trimmed);
  });
}

/**
 * Validates email and password input before invoking Firebase Authentication.
 *
 * @param {{ email?: string, password?: string }} input
 * @returns {{ valid: boolean, error: string }}
 */
export function validateLoginInput({ email = '', password = '' } = {}) {
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';

  if (!trimmedEmail) {
    return {
      valid: false,
      error: 'Por favor, introduce tu correo electrónico.',
    };
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return {
      valid: false,
      error: 'Introduce un correo electrónico válido.',
    };
  }

  if (typeof password !== 'string' || password.trim().length === 0) {
    return {
      valid: false,
      error: 'Por favor, introduce tu contraseña.',
    };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: 'La contraseña debe tener al menos 6 caracteres.',
    };
  }

  return {
    valid: true,
    error: '',
  };
}

/**
 * Maps a Firebase Authentication error object into a user-friendly Spanish message.
 *
 * @param {{ code?: string } | null | undefined} error
 * @returns {string}
 */
export function getAuthErrorMessage(error) {
  const code = error && typeof error === 'object' ? error.code : undefined;
  if (typeof code === 'string' && Object.hasOwn(AUTH_ERROR_MESSAGES, code)) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return 'No se pudo completar el inicio de sesión. Inténtalo de nuevo más tarde.';
}
