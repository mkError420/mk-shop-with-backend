'use client'

import React, { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from '@/lib/firebase'

export default function AuthDebugPage() {
  const [authStatus, setAuthStatus] = useState('Checking...')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog('Starting auth debug...')
    
    // Check if auth is available
    if (!auth) {
      addLog('❌ Firebase auth not available')
      setAuthStatus('Firebase Auth Not Available')
      return
    }
    
    addLog('✅ Firebase auth is available')
    setAuthStatus('Firebase Auth Available')
    
    try {
      addLog('Setting up auth state listener...')
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          addLog(`✅ User authenticated: ${user.email}`)
          setCurrentUser({
            email: user.email,
            uid: user.uid,
            emailVerified: user.emailVerified
          })
          setAuthStatus('User Authenticated')
        } else {
          addLog('❌ No user authenticated')
          setCurrentUser(null)
          setAuthStatus('No User')
        }
      })
      
      return () => {
        addLog('Cleaning up auth listener...')
        unsubscribe()
      }
    } catch (error: any) {
      addLog(`❌ Error setting up auth listener: ${error.message}`)
      setAuthStatus('Auth Error')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Authentication Debug</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  authStatus.includes('Available') || authStatus.includes('Authenticated') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {authStatus}
                </span>
              </div>
              
              {currentUser && (
                <div className="border-t pt-3">
                  <h3 className="font-semibold mb-2">Current User:</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Email:</strong> {currentUser.email}</div>
                    <div><strong>UID:</strong> {currentUser.uid}</div>
                    <div><strong>Email Verified:</strong> {currentUser.emailVerified ? '✅' : '❌'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-gray-900 text-green-400 p-3 rounded h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/dashboard/login" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              Go to Login
            </a>
            <a 
              href="/dashboard" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
            >
              Go to Dashboard
            </a>
            <a 
              href="/firebase-test" 
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
            >
              Firebase Test
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
