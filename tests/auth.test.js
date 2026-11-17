import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isFirebaseConfigComplete,
  validateLoginInput,
  getAuthErrorMessage,
} from '../src/lib/authHelpers.js';
import { getFirebaseAuth, isFirebaseConfigured } from '../src/lib/firebase.js';

test('isFirebaseConfigComplete rejects empty, partial, or template placeholder configs', () => {
  assert.equal(isFirebaseConfigComplete(null), false);
  assert.equal(isFirebaseConfigComplete({}), false);
  assert.equal(
    isFirebaseConfigComplete({
      apiKey: 'tu_api_key',
      authDomain: 'nutricional-coach.firebaseapp.com',
      projectId: 'nutricional-coach',
      appId: 'tu_app_id',
    }),
    false
  );
  assert.equal(
    isFirebaseConfigComplete({
      apiKey: 'AIzaSyTestKey123456',
      authDomain: 'nutricional-coach.firebaseapp.com',
      projectId: 'nutricional-coach',
      appId: '   ',
    }),
    false
  );
  assert.equal(
    isFirebaseConfigComplete({
      apiKey: 'AIzaSyTestKey123456',
      authDomain: 'nutricional-coach.firebaseapp.com',
      projectId: 'nutricional-coach',
      appId: '1:123456789:web:abcdef',
    }),
    true
  );
});

test('validateLoginInput validates email format and password requirements in Spanish', () => {
  const emptyEmail = validateLoginInput({ email: '   ', password: 'secret123' });
  assert.equal(emptyEmail.valid, false);
  assert.match(emptyEmail.error, /correo/i);

  const badEmail = validateLoginInput({ email: 'not-an-email', password: 'secret123' });
  assert.equal(badEmail.valid, false);
  assert.match(badEmail.error, /válido/i);

  const emptyPassword = validateLoginInput({ email: 'cliente@ejemplo.com', password: '' });
  assert.equal(emptyPassword.valid, false);
  assert.match(emptyPassword.error, /contraseña/i);

  const shortPassword = validateLoginInput({ email: 'cliente@ejemplo.com', password: '123' });
  assert.equal(shortPassword.valid, false);
  assert.match(shortPassword.error, /6 caracteres/i);

  const valid = validateLoginInput({ email: '  cliente@ejemplo.com  ', password: 'password123' });
  assert.deepEqual(valid, { valid: true, error: '' });
});

test('getAuthErrorMessage maps Firebase auth error codes to Spanish messages with safe fallback', () => {
  assert.match(getAuthErrorMessage({ code: 'auth/user-not-found' }), /No existe ninguna cuenta/i);
  assert.match(getAuthErrorMessage({ code: 'auth/wrong-password' }), /contraseña/i);
  assert.match(getAuthErrorMessage({ code: 'auth/invalid-credential' }), /incorrectos/i);
  assert.match(getAuthErrorMessage({ code: 'auth/too-many-requests' }), /Demasiados intentos/i);
  assert.match(getAuthErrorMessage({ code: 'auth/popup-closed-by-user' }), /ventana/i);
  assert.match(getAuthErrorMessage({ code: 'auth/network-request-failed' }), /conexión/i);
  assert.match(getAuthErrorMessage({ code: 'auth/unknown-code' }), /No se pudo completar/i);
  assert.match(getAuthErrorMessage({ code: 'toString' }), /No se pudo completar/i);
  assert.match(getAuthErrorMessage(null), /No se pudo completar/i);
});

test('getFirebaseAuth enforces browser-only isolation during SSR/Node execution', () => {
  assert.equal(typeof window, 'undefined');
  assert.equal(isFirebaseConfigured(), false);
  assert.equal(getFirebaseAuth(), null);
});
