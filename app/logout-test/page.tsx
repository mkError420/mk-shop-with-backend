'use client'

import React, { useState } from 'react'
import { auth, signOut } from '@/lib/firebase'

export default function LogoutTestPage() {
  const [status, setStatus] = useState('Ready to test logout')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testLogout = async () => {
    try {
      addLog('Starting logout test...')
      setStatus('Testing logout...')

      if (!auth) {
        addLog('❌ Firebase auth not available')
        setStatus('Firebase auth not available')
        return
      }

      addLog('✅ Firebase auth available')
      addLog('Calling signOut...')
      
      try {
        await signOut(auth)
        addLog('✅ Sign out successful')
        setStatus('Logout successful!')
      } catch (firebaseError: any) {
        addLog(`⚠️ Firebase sign out failed: ${firebaseError.message}`)
        addLog('🔄 Clearing browser storage as fallback...')
        
        // Fallback: clear storage manually
        localStorage.clear()
        sessionStorage.clear()
        addLog('✅ Browser storage cleared')
        setStatus('Logout completed with fallback method')
      }
      
      // Redirect after 2 seconds
      setTimeout(() => {
        addLog('Redirecting to login...')
        window.location.href = '/dashboard/login'
      }, 2000)
      
    } catch (error: any) {
      addLog(`❌ Logout error: ${error.message}`)
      setStatus(`Logout failed: ${error.message}`)
    }
  }

  const testForceRedirect = () => {
    addLog('Force redirecting to login...')
    window.location.href = '/dashboard/login'
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔐 Logout Function Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  status.includes('successful') ? 'bg-green-100 text-green-700' : 
                  status.includes('failed') ? 'bg-red-100 text-red-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {status}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button 
                onClick={testLogout}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Test Logout Function
              </button>
              <button 
                onClick={testForceRedirect}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Force Redirect to Login
              </button>
              <a 
                href="/dashboard" 
                className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                Go to Dashboard
              </a>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
            <div className="bg-gray-900 text-green-400 p-3 rounded h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet. Click "Test Logout Function" to start.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>First, make sure you're logged in by visiting the dashboard</li>
            <li>Click "Test Logout Function" to test the logout logic</li>
            <li>Check the logs for detailed information</li>
            <li>If logout fails, try "Force Redirect to Login"</li>
            <li>Verify you end up at the login page</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
