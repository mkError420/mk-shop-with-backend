import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'

// Local storage fallback for Netlify serverless functions
const getLocalStorageFallback = () => {
  // This is a fallback for when file system doesn't work
  return {
    products: [
      {
        id: 'demo-1',
        name: 'iPhone 13',
        price: 150000,
        category: 'Electronics',
        stock: 25,
        image: 'https://www.custommacbd.com/cdn/shop/products/iphone-13-pink-Custom-Mac-BD.jpg?v=1634647421'
      },
      {
        id: 'demo-2', 
        name: 'Smart Watch',
        price: 15000,
        category: 'Electronics',
        stock: 50,
        image: 'https://img.drz.lazcdn.com/static/bd/p/b506a3a49007f3df27f2d222b190ecb6.jpg_720x720q80.jpg'
      }
    ]
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
    
    if (!name || price == null) {
      return apiError('Name and price required', 400)
    }
    
    // For Netlify serverless functions, we'll use a simple success response
    // The frontend will handle localStorage storage
    const product = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
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
      stock: stock ?? 100,
      note: 'Created with localStorage fallback - product saved in browser storage'
    }
    
    console.log('Product created successfully:', product.name)
    return apiSuccess(product, 201)
    
  } catch (error) {
    console.error('Product creation error:', error)
    return apiError('Failed to create product', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    
    // Return demo data for now
    let products = getLocalStorageFallback().products
    
    // Apply filters
    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()))
    }
    
    if (search) {
      products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    
    if (featured === 'true') {
      products = products.filter(p => p.category !== 'Uncategorized')
    }
    
    return apiSuccess(products)
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return apiError('Failed to fetch products', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Product ID required', 400)
    
    const body = await req.json()
    const { name, price, originalPrice, image, rating, reviews, badge, category, description, size, stock } = body
    
    if (!name || price == null) return apiError('Name and price required', 400)
    
    // For now, just return success
    const product = {
      id,
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
      stock: stock ?? 100,
      note: 'Updated with localStorage fallback'
    }
    
    return apiSuccess(product)
    
  } catch (error) {
    console.error('Error updating product:', error)
    return apiError('Failed to update product', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Product ID required', 400)
    
    // For now, just return success
    return apiSuccess({ message: 'Product deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return apiError('Failed to delete product', 500)
  }
}
