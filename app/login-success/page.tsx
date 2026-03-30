'use client'

import React from 'react'

export default function LoginSuccessPage() {
  const handleManualRedirect = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h1>
          <p className="text-gray-600 mb-6">You have been successfully authenticated.</p>
          
          <div className="space-y-3">
            <button 
              onClick={handleManualRedirect}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            
            <div className="text-sm text-gray-500">
              <p>If the automatic redirect doesn't work, click the button above.</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-center space-x-4">
              <a href="/auth-debug" className="text-blue-600 hover:text-blue-700 text-sm">
                Debug Auth
              </a>
              <a href="/dashboard/login" className="text-blue-600 hover:text-blue-700 text-sm">
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
