'use client'

import React from 'react'

export default function DashboardSimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard (Simple Version)</h1>
          <p className="text-gray-600">This version bypasses authentication to test rendering.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Check</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-800">✅ Dashboard rendering works</span>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-blue-800">ℹ️ Authentication bypassed for testing</span>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-yellow-800">⚠️ If this works, the issue is in auth logic</span>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <a 
              href="/dashboard" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Real Dashboard
            </a>
            <a 
              href="/auth-debug" 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Auth Debug
            </a>
          </div>
        </div>

        {/* Sample Dashboard Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Products', value: '12', color: 'bg-blue-500' },
            { label: 'Categories', value: '8', color: 'bg-green-500' },
            { label: 'Orders', value: '24', color: 'bg-purple-500' },
            { label: 'Users', value: '1', color: 'bg-orange-500' }
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
