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
    
    // GET all categories
    if (httpMethod === 'GET') {
      return apiResponse({ success: true, data: db.categories })
    }
    
    // POST new category
    if (httpMethod === 'POST') {
      const body = JSON.parse(event.body)
      const { title, slug, description, image, subcategories } = body
      
      if (!title || !slug) {
        return apiResponse({ success: false, message: 'Title and slug required' }, 400)
      }
      
      const category = {
        id: generateId(),
        title,
        slug,
        description: description || '',
        image: image || '/api/placeholder/300/200',
        subcategories: subcategories || []
      }
      
      db.categories.push(category)
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: category }, 201)
    }
    
    // PUT update category
    if (httpMethod === 'PUT') {
      const id = event.queryStringParameters?.id
      
      if (!id) {
        return apiResponse({ success: false, message: 'Category ID required' }, 400)
      }
      
      const body = JSON.parse(event.body)
      const { title, slug, description, image, subcategories } = body
      
      if (!title || !slug) {
        return apiResponse({ success: false, message: 'Title and slug required' }, 400)
      }
      
      const categoryIndex = db.categories.findIndex((category) => category.id === id)
      
      if (categoryIndex === -1) {
        return apiResponse({ success: false, message: 'Category not found' }, 404)
      }
      
      db.categories[categoryIndex] = {
        ...db.categories[categoryIndex],
        title: title || db.categories[categoryIndex].title,
        slug: slug || db.categories[categoryIndex].slug,
        description: description || db.categories[categoryIndex].description,
        image: image || db.categories[categoryIndex].image,
        subcategories: subcategories || db.categories[categoryIndex].subcategories
      }
      
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: db.categories[categoryIndex] })
    }
    
    // DELETE category
    if (httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id
      
      if (!id) {
        return apiResponse({ success: false, message: 'Category ID required' }, 400)
      }
      
      const categoryIndex = db.categories.findIndex((category) => category.id === id)
      
      if (categoryIndex === -1) {
        return apiResponse({ success: false, message: 'Category not found' }, 404)
      }
      
      db.categories.splice(categoryIndex, 1)
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: { message: 'Category deleted successfully' } })
    }
    
    return apiResponse({ success: false, message: 'Method not allowed' }, 405)
    
  } catch (error) {
    console.error('API Error:', error)
    return apiResponse({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    }, 500)
  }
}
