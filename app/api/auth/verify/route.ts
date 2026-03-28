import { NextRequest } from 'next/server'
// import { requireAuth } from '@/lib/firebase-middleware'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    // const user = await requireAuth(req)
    // For now, just return success without verification
    return apiSuccess({ 
      message: 'Token valid',
      user: { email: 'mk.rabbani.cse@gmail.com' }
    })
  } catch (error: any) {
    return apiError(error.message || 'Token verification failed', 401)
  }
}
