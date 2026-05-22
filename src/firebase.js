/**
 * firebase.js  ← additions needed
 * ─────────────────────────────────────────────────────────────────────
 * Add these exports to your existing firebase.js so the projects
 * feature can import db and storage.
 *
 * Your existing firebase.js already has auth, provider, signInWithPopup,
 * signOut. Just add the lines marked with  ← ADD
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';   // ← ADD
import { getStorage }   from 'firebase/storage';    // ← ADD

const firebaseConfig = {
  // ← your existing config object, unchanged
  apiKey: "AIzaSyD1MLmwzlWn31A6n-2cLoV0eMTBTxXMJlU",
  authDomain: "kimaniportfolio-a3062.firebaseapp.com",
  projectId: "kimaniportfolio-a3062",
  storageBucket: "kimaniportfolio-a3062.firebasestorage.app",
  messagingSenderId: "676280465894",
  appId: "1:676280465894:web:9d98c88c7d770080a6be27",
  measurementId: "G-77B9ZE7447"
};

const app = initializeApp(firebaseConfig);

export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup, signOut };

export const db      = getFirestore(app);   // ← ADD
export const storage = getStorage(app);     // ← ADD