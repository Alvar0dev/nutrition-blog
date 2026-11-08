/**
 * Firebase Auth Extension Point.
 *
 * Rendered statically with zero client JS overhead until authentication is enabled.
 *
 * Future integration guide (when `firebase` is installed):
 * 1. Create `src/lib/firebase.js` with `initializeApp(firebaseConfig)` and export `auth = getAuth(app)`.
 * 2. Connect `onAuthStateChanged(auth, callback)` inside a `useEffect` here (or in an `<AuthProvider>`).
 * 3. Mount `signInWithEmailAndPassword` / `GoogleAuthProvider` UI inside `[data-auth-placeholder]`.
 * 4. Add `client:load` where `<AuthPlaceholder />` is mounted (`src/pages/login.astro`, `src/pages/contacto.astro`).
 */
export default function AuthPlaceholder() {
  return (
    <div data-auth-placeholder>
      {/* Future Firebase Auth provider & login UI mount point */}
    </div>
  );
}
