import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body
    
    if (!email || !password) {
      return apiError('Email and password required', 400)
    }
    
    // For Firebase, the actual authentication happens on the client side
    // This endpoint just validates that the user should be allowed to login
    if (email === 'mk.rabbani.cse@gmail.com') {
      return apiSuccess({ 
        message: 'Login allowed',
        user: { email },
        // Note: The actual Firebase token will be handled by the client
      })
    }
    
    return apiError('Invalid credentials', 401)
  } catch {
    return apiError('Login failed', 500)
  }
}
