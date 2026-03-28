import { apiSuccess } from '@/lib/api-response'

export async function POST() {
  // Firebase logout is handled client-side
  return apiSuccess({ message: 'Logout successful' })
}
