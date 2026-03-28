import { NextRequest } from 'next/server'
import { adminAuth } from './firebase-admin'

export async function verifyFirebaseToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided')
  }
  
  const token = authHeader.split('Bearer ')[1]
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export async function requireAuth(request: NextRequest) {
  try {
    const user = await verifyFirebaseToken(request)
    
    // Check if user is the admin
    if (user.email !== 'mk.rabbani.cse@gmail.com') {
      throw new Error('Access denied: Admin access required')
    }
    
    return user
  } catch (error) {
    throw new Error('Authentication required')
  }
}
