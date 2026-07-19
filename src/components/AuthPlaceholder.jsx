/**
 * Firebase Auth Extension Point (React Island - hydrated with `client:load`).
 *
 * Future integration guide (when `firebase` is installed):
 * 1. Create `src/lib/firebase.js` with `initializeApp(firebaseConfig)` and export `auth = getAuth(app)`.
 * 2. Connect `onAuthStateChanged(auth, callback)` inside a `useEffect` here (or in an `<AuthProvider>`).
 * 3. Mount `signInWithEmailAndPassword` / `GoogleAuthProvider` UI inside `[data-auth-placeholder]`.
 * 4. Do NOT install `firebase` until authentication is actively enabled.
 */
export default function AuthPlaceholder() {
  return (
    <div data-auth-placeholder>
      {/* Future Firebase Auth provider & login UI mount point */}
    </div>
  );
}
