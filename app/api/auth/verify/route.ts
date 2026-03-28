import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/firebase-middleware'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    return apiSuccess({ 
      message: 'Token valid',
      user: { email: user.email }
    })
  } catch (error: any) {
    return apiError(error.message || 'Token verification failed', 401)
  }
}
