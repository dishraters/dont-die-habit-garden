import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { Auth, GoogleAuthProvider, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingConfig.length > 0) {
  console.warn(`Missing Firebase env vars: ${missingConfig.join(', ')}`)
}

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

let cachedDb: Firestore | null = null
let cachedAuth: Auth | null = null
let cachedGoogleProvider: GoogleAuthProvider | null = null

export function getDb() {
  if (!cachedDb) {
    cachedDb = getFirestore(getFirebaseApp())
  }
  return cachedDb
}

export function getFirebaseAuth() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth is only available in the browser')
  }

  if (!cachedAuth) {
    cachedAuth = getAuth(getFirebaseApp())
  }
  return cachedAuth
}

export function getGoogleProvider() {
  if (!cachedGoogleProvider) {
    cachedGoogleProvider = new GoogleAuthProvider()
  }
  return cachedGoogleProvider
}
