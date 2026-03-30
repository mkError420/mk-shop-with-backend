import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const getFirebaseConfig = () => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
  }
}

// Initialize Firebase only if all required config is present and we're in browser
const shouldInitializeFirebase = () => {
  const config = getFirebaseConfig()
  return typeof window !== 'undefined' && 
         config.apiKey && 
         config.projectId &&
         process.env.NODE_ENV !== 'test'
}

// Initialize Firebase lazily
let app: any = null
let authInstance: any = null
let dbInstance: any = null

const initializeFirebase = () => {
  if (app || !shouldInitializeFirebase()) return app
  
  try {
    const config = getFirebaseConfig()
    console.log('Initializing Firebase with config:', { 
      projectId: config.projectId, 
      authDomain: config.authDomain,
      hasApiKey: !!config.apiKey 
    })
    
    app = (!getApps().length || !getApps()[0]) ? initializeApp(config) : getApps()[0]
    authInstance = app ? getAuth(app) : null
    dbInstance = app ? getFirestore(app) : null
    
    console.log('Firebase initialized successfully:', { 
      hasApp: !!app, 
      hasAuth: !!authInstance, 
      hasDb: !!dbInstance 
    })
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
  
  return app
}

export const auth = new Proxy({}, {
  get(target, prop) {
    if (!authInstance) {
      initializeFirebase()
    }
    return authInstance?.[prop]
  },
  has(target, prop) {
    if (!authInstance) {
      initializeFirebase()
    }
    return authInstance && prop in authInstance
  }
}) as any

export const db = new Proxy({}, {
  get(target, prop) {
    if (!dbInstance) {
      initializeFirebase()
    }
    return dbInstance?.[prop]
  },
  has(target, prop) {
    if (!dbInstance) {
      initializeFirebase()
    }
    return dbInstance && prop in dbInstance
  }
}) as any

export { signInWithEmailAndPassword, signOut, onAuthStateChanged }
