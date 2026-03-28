import admin from 'firebase-admin'

// Only initialize Firebase Admin if all required environment variables are present
const shouldInitialize = () => {
  return process.env.FIREBASE_ADMIN_PROJECT_ID && 
         process.env.FIREBASE_ADMIN_PRIVATE_KEY && 
         process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
         process.env.NODE_ENV === 'production'
}

if (!admin.apps.length && shouldInitialize()) {
  const serviceAccount = {
    type: process.env.FIREBASE_ADMIN_TYPE || 'service_account',
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
export default admin
