import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
}

// Initialize Firebase only if all required config is present and we're in browser
const shouldInitializeFirebase = () => {
  return typeof window !== 'undefined' && 
         firebaseConfig.apiKey && 
         firebaseConfig.projectId &&
         process.env.NODE_ENV !== 'test'
}

// Initialize Firebase
let app: any = null
let authInstance: any = null
let dbInstance: any = null

if (typeof window !== 'undefined') {
  try {
    app = (!getApps().length || !getApps()[0]) ? initializeApp(firebaseConfig) : getApps()[0]
    authInstance = app ? getAuth(app) : null
    dbInstance = app ? getFirestore(app) : null
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
}

export const auth = authInstance
export const db = dbInstance

export { signInWithEmailAndPassword, signOut, onAuthStateChanged }
