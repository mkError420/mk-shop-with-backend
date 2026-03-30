'use client'

import React from 'react'
import Link from 'next/link'

export default function DashboardTestPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard (Test Mode)</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Test User: mk.rabbani.cse@gmail.com</span>
              <Link href="/dashboard/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview (Test)</h1>
          <p className="text-gray-600">This is a test version of the dashboard to verify rendering works.</p>
        </div>

        {/* Test Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Products', value: '12', color: 'bg-blue-500' },
            { label: 'Categories', value: '8', color: 'bg-green-500' },
            { label: 'Deals', value: '5', color: 'bg-orange-500' },
            { label: 'Orders', value: '24', color: 'bg-purple-500' }
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

        {/* Test Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-green-800">✅ Dashboard rendering works</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-blue-800">ℹ️ Test mode bypasses authentication</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <span className="text-yellow-800">⚠️ If this works, the issue is with auth flow</span>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Try Real Dashboard
            </Link>
            <Link href="/auth-debug" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Debug Auth
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
