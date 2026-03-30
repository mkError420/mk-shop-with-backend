import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase'

export interface AdminUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName?: string
  photoURL?: string
  createdAt?: Date
  lastLoginAt?: Date
}

// Authentication service
export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AdminUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      if (!user.emailVerified) {
        throw new Error('Please verify your email before signing in.')
      }
      
      return {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : undefined,
        lastLoginAt: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : undefined
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.')
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.')
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.')
      } else {
        throw new Error(error.message || 'Failed to sign in. Please try again.')
      }
    }
  },

  // Sign out current user
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.error('Sign out error:', error)
      throw new Error('Failed to sign out. Please try again.')
    }
  },

  // Get current authenticated user
  getCurrentUser(): AdminUser | null {
    const user = auth.currentUser
    if (!user) return null
    
    return {
      uid: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : undefined,
      lastLoginAt: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : undefined
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : undefined,
          lastLoginAt: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : undefined
        })
      } else {
        callback(null)
      }
    })
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null
  },

  // Refresh user token
  async refreshToken(): Promise<string | null> {
    try {
      const user = auth.currentUser
      if (!user) return null
      
      const tokenResult = await user.getIdToken(true)
      return tokenResult
    } catch (error) {
      console.error('Token refresh error:', error)
      return null
    }
  },

  // Reset password (send email)
  async resetPassword(email: string): Promise<void> {
    try {
      // This would require importing sendPasswordResetEmail from firebase/auth
      // For now, we'll throw an error indicating the feature needs to be implemented
      throw new Error('Password reset feature not yet implemented. Please contact administrator.')
    } catch (error: any) {
      console.error('Password reset error:', error)
      throw new Error(error.message || 'Failed to send password reset email.')
    }
  }
}

export default authService
