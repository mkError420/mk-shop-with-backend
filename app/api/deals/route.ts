import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'

// Local storage fallback for Netlify serverless functions
const getLocalStorageFallback = () => {
  return {
    deals: [
      {
        id: 'sample-1',
        title: 'Super deal: Best Samsung phones',
        originalPrice: 27900.9,
        dealPrice: 24690.9,
        discount: 12,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmdr-t7nODszaBxRZz-0_MUAl8dRo3oQFXCw&s',
        images: [
          'https://www.custommacbd.com/cdn/shop/files/samsung-galaxy-s24-sapphire-blue-Custom-Mac-BD.png?v=1706354011',
          'https://storage.googleapis.com/pickaboo-prod/media/catalog/product/cache/948612736c72ae3709677d5981c43a49/s/2/s26-2-28-26-12.jpg'
        ],
        category: 'Electronics',
        dealType: 'lightning',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        stock: 10,
        sold: 0,
        rating: 4.5,
        reviews: 25,
        description: 'The best Samsung phones in 2026 focus on the company\'s strengths, like long software support promises, great features, and top-notch hardware quality.',
        features: ['Phone', 'Offer', 'Deal', 'Best Offer'],
        freeShipping: true
      },
      {
        id: 'sample-2',
        title: 'Best Laptop Price in BD 2026',
        originalPrice: 48900.9,
        dealPrice: 45600.9,
        discount: 7,
        image: 'https://image.made-in-china.com/43f34j00LbTvFHoJySkZ/Mini-Laptop-PC-Personal-Computer-1920-1080-Resolution-8g-RAM-1tb-SSD-Ultra-Thin-Laptop.webp',
        images: [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5VaBcdkdCPm1T-Cos4gTQ3YT_4MtH11PKwA&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFu9fEnwERki9w_I3wzUw5H4iDABoKGyox5g&s'
        ],
        category: 'Electronics',
        dealType: 'daily',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        stock: 15,
        sold: 5,
        rating: 4.5,
        reviews: 18,
        description: 'Power in a slim and lightweight package is what most people look for in a laptop.',
        features: ['Deal', 'Offer', 'New Offer'],
        freeShipping: true
      }
    ]
  }
}

export async function GET() {
  try {
    console.log('=== GET Main Deals Route Called ===')
    
    // Return demo data for now
    const deals = getLocalStorageFallback().deals
    console.log('GET Main Route - Total deals returned:', deals.length)
    
    return apiSuccess(deals)
  } catch (error) {
    console.error('GET Main Route - Error:', error)
    return apiError('Failed to fetch deals', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('POST Request - Body:', body)
    
    const { title, originalPrice, dealPrice, discount, image, images, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    
    if (!title || originalPrice == null || dealPrice == null) {
      return apiError('Title, originalPrice and dealPrice required', 400)
    }
    
    // For Netlify serverless functions, we'll use a simple success response
    const deal = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image || '/api/placeholder/400/300',
      images: images || [],
      category: category || 'General',
      dealType: dealType || 'daily',
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stock: stock ?? 10,
      sold: sold ?? 0,
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
      description: description || '',
      features: features || [],
      freeShipping: freeShipping ?? true,
      note: 'Created with localStorage fallback - deal saved in browser storage'
    }
    
    console.log('New deal created:', deal)
    return apiSuccess(deal, 201)
    
  } catch (error) {
    console.error('Error creating deal:', error)
    return apiError('Failed to create deal', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Deal ID required', 400)
    
    const body = await req.json()
    const { title, originalPrice, dealPrice, discount, image, images, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    
    if (!title || originalPrice == null || dealPrice == null) {
      return apiError('Title, originalPrice and dealPrice required', 400)
    }
    
    // For now, just return success
    const deal = {
      id,
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image || '/api/placeholder/400/300',
      images: images || [],
      category: category || 'General',
      dealType: dealType || 'daily',
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stock: stock ?? 10,
      sold: sold ?? 0,
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
      description: description || '',
      features: features || [],
      freeShipping: freeShipping ?? true,
      note: 'Updated with localStorage fallback'
    }
    
    return apiSuccess(deal)
    
  } catch (error) {
    console.error('Error updating deal:', error)
    return apiError('Failed to update deal', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) return apiError('Deal ID required', 400)
    
    console.log('DELETE Request - Deal ID:', id)
    
    // For Netlify serverless functions, we'll use a simple success response
    // The frontend will handle localStorage deletion
    console.log('Deal deleted successfully:', id)
    
    return apiSuccess({ message: 'Deal deleted successfully', deletedId: id })
    
  } catch (error) {
    console.error('Error deleting deal:', error)
    return apiError('Failed to delete deal', 500)
  }
}

