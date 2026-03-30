const fs = require('fs')
const path = require('path')

// Simple in-memory database for Netlify Functions
const DB_PATH = path.join(__dirname, '../data/db.json')

let dbCache = null

// Simple database functions for Netlify deployment
const getDb = async () => {
  if (dbCache) return dbCache
  
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8')
      dbCache = JSON.parse(data)
    } else {
      // Create default data if file doesn't exist
      dbCache = {
        products: [],
        categories: [],
        deals: [],
        blogPosts: [],
        orders: [],
        users: [],
        banners: [],
        coupons: []
      }
      // Save default data
      fs.writeFileSync(DB_PATH, JSON.stringify(dbCache, null, 2))
    }
    return dbCache
  } catch (error) {
    console.error('Database error:', error)
    return {
      products: [],
      categories: [],
      deals: [],
      blogPosts: [],
      orders: [],
      users: [],
      banners: [],
      coupons: []
    }
  }
}

const writeDb = async (data) => {
  try {
    dbCache = data
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Write database error:', error)
    throw error
  }
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const clearCache = () => {
  dbCache = null
}

// Helper function to create API response
const apiResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify(data),
  }
}

// Handle CORS preflight requests
const handleCors = () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: '',
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCors()
  }

  try {
    const { httpMethod } = event
    const db = await getDb()
    
    // POST login
    if (httpMethod === 'POST') {
      const body = JSON.parse(event.body)
      const { email, password } = body
      
      if (!email || !password) {
        return apiResponse({ success: false, message: 'Email and password required' }, 400)
      }
      
      // Simple authentication - check against users in database
      const user = db.users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        return apiResponse({ success: false, message: 'Invalid credentials' }, 401)
      }
      
      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user
      
      return apiResponse({ 
        success: true, 
        data: {
          user: userWithoutPassword,
          token: 'mock-jwt-token-' + generateId()
        }
      })
    }
    
    return apiResponse({ success: false, message: 'Method not allowed' }, 405)
    
  } catch (error) {
    console.error('Auth API Error:', error)
    return apiResponse({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    }, 500)
  }
}
