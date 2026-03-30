const { getDb, writeDb, generateId, clearCache } = require('../../lib/db')

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
    const { httpMethod, pathParameters } = event
    const db = await getDb()
    let products = [...db.products]
    
    // GET all products
    if (httpMethod === 'GET') {
      // Parse query parameters from event
      const { queryStringParameters } = event
      const category = queryStringParameters?.category
      const search = queryStringParameters?.search
      const featured = queryStringParameters?.featured
      
      // Apply filters (same logic as original API)
      if (category && category !== 'all') {
        const categorySlugToTitleMap = {}
        db.categories.forEach((cat) => {
          categorySlugToTitleMap[cat.slug] = cat.title
          if (cat.subcategories) {
            cat.subcategories.forEach((sub) => {
              categorySlugToTitleMap[sub.slug] = sub.title
            })
          }
        })
        
        const categoryTitle = categorySlugToTitleMap[category] || category
        products = products.filter(p => {
          const productCategory = p.category?.toLowerCase() || ''
          const searchCategory = categoryTitle.toLowerCase()
          return productCategory === searchCategory || 
                 productCategory.includes(searchCategory) || 
                 searchCategory.includes(productCategory)
        })
      }
      
      if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      }
      
      if (featured === 'true') {
        products = products.filter(p => p.featured)
      }
      
      return apiResponse({ success: true, data: products })
    }
    
    // POST new product
    if (httpMethod === 'POST') {
      const body = JSON.parse(event.body)
      const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
      
      if (!name || price == null) {
        return apiResponse({ success: false, message: 'Name and price required' }, 400)
      }
      
      const product = {
        id: generateId(),
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image: image || '/api/placeholder/300/300',
        rating: rating ?? 0,
        reviews: reviews ?? 0,
        badge: badge || '',
        category: category || 'Uncategorized',
        description: description || '',
        size: size || '',
        stock: stock ?? 100
      }
      
      db.products.push(product)
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: product }, 201)
    }
    
    // PUT update product
    if (httpMethod === 'PUT') {
      const id = pathParameters?.id || event.queryStringParameters?.id
      
      if (!id) {
        return apiResponse({ success: false, message: 'Product ID required' }, 400)
      }
      
      const body = JSON.parse(event.body)
      const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
      
      if (!name || price == null) {
        return apiResponse({ success: false, message: 'Name and price required' }, 400)
      }
      
      const productIndex = db.products.findIndex((product) => product.id === id)
      
      if (productIndex === -1) {
        return apiResponse({ success: false, message: 'Product not found' }, 404)
      }
      
      db.products[productIndex] = {
        ...db.products[productIndex],
        name: name || db.products[productIndex].name,
        price: price != null ? Number(price) : db.products[productIndex].price,
        originalPrice: originalPrice ? Number(originalPrice) : db.products[productIndex].originalPrice,
        image: image || db.products[productIndex].image,
        rating: rating != null ? Number(rating) : db.products[productIndex].rating,
        reviews: reviews != null ? Number(reviews) : db.products[productIndex].reviews,
        badge: badge || db.products[productIndex].badge,
        category: category || db.products[productIndex].category,
        description: description || db.products[productIndex].description,
        size: size || db.products[productIndex].size,
        stock: stock != null ? Number(stock) : db.products[productIndex].stock
      }
      
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: db.products[productIndex] })
    }
    
    // DELETE product
    if (httpMethod === 'DELETE') {
      const id = pathParameters?.id || event.queryStringParameters?.id
      
      if (!id) {
        return apiResponse({ success: false, message: 'Product ID required' }, 400)
      }
      
      const productIndex = db.products.findIndex((product) => product.id === id)
      
      if (productIndex === -1) {
        return apiResponse({ success: false, message: 'Product not found' }, 404)
      }
      
      db.products.splice(productIndex, 1)
      await writeDb(db)
      clearCache()
      
      return apiResponse({ success: true, data: { message: 'Product deleted successfully' } })
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
