'use client'

import React, { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('Checking Firebase...')
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    const checkFirebase = () => {
      try {
        // Check if environment variables are loaded
        const envVars = {
          NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        }
        
        setConfig(envVars)
        
        // Check if auth is available
        if (auth) {
          setStatus('✅ Firebase Auth is available')
          console.log('Firebase auth object:', auth)
        } else {
          setStatus('❌ Firebase Auth not available')
        }
      } catch (error: any) {
        setStatus(`❌ Error: ${error?.message || 'Unknown error'}`)
      }
    }

    checkFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_FIREBASE_API_KEY:</span>
              <span className={config.NEXT_PUBLIC_FIREBASE_API_KEY ? 'text-green-600' : 'text-red-600'}>
                {config.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</span>
              <span className={config.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'text-green-600' : 'text-red-600'}>
                {config.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Loaded' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</span>
              <span className={config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'text-green-600' : 'text-red-600'}>
                {config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Loaded' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>If all environment variables are ✅ Loaded, try going to <a href="/dashboard/login" className="text-blue-600 underline">Dashboard Login</a></li>
            <li>If you see ❌ Missing, check your .env.local file</li>
            <li>Check browser console for detailed Firebase initialization logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
