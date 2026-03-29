import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  try {
    console.log('=== GET Main Deals Route Called ===')
    
    const db = await getDb()
    console.log('GET Main Route - Total deals in DB:', db.deals.length)
    console.log('GET Main Route - Deals:', db.deals.map(d => ({ id: d.id, title: d.title, dealPrice: d.dealPrice })))
    
    // If no deals in database, provide sample data
    if (db.deals.length === 0) {
      console.log('No deals found in DB, providing sample data')
      const sampleDeals = [
        {
          id: "sample-1",
          title: "Super deal: Best Samsung phones",
          originalPrice: 27900.9,
          dealPrice: 24690.9,
          discount: 12,
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmdr-t7nODszaBxRZz-0_MUAl8dRo3oQFXCw&s",
          images: [
            "https://www.custommacbd.com/cdn/shop/files/samsung-galaxy-s24-sapphire-blue-Custom-Mac-BD.png?v=1706354011",
            "https://storage.googleapis.com/pickaboo-prod/media/catalog/product/cache/948612736c72ae3709677d5981c43a49/s/2/s26-2-28-26-12.jpg"
          ],
          category: "Electronics",
          dealType: "lightning",
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stock: 10,
          sold: 0,
          rating: 4.5,
          reviews: 25,
          description: "The best Samsung phones in 2026 focus on the company's strengths, like long software support promises, great features, and top-notch hardware quality.",
          features: ["Phone", "Offer", "Deal", "Best Offer"],
          freeShipping: true
        },
        {
          id: "sample-2",
          title: "Best Laptop Price in BD 2026",
          originalPrice: 48900.9,
          dealPrice: 45600.9,
          discount: 7,
          image: "https://image.made-in-china.com/43f34j00LbTvFHoJySkZ/Mini-Laptop-PC-Personal-Computer-1920-1080-Resolution-8g-RAM-1tb-SSD-Ultra-Thin-Laptop.webp",
          images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5VaBcdkdCPm1T-Cos4gTQ3YT_4MtH11PKwA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFu9fEnwERki9w_I3wzUw5H4iDABoKGyox5g&s"
          ],
          category: "Electronics",
          dealType: "daily",
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stock: 15,
          sold: 5,
          rating: 4.5,
          reviews: 18,
          description: "Power in a slim and lightweight package is what most people look for in a laptop.",
          features: ["Deal", "Offer", "New Offer"],
          freeShipping: true
        }
      ]
      const response = apiSuccess(sampleDeals)
      console.log('GET Main Route - Sample response created with deals count:', sampleDeals.length)
      return response
    }
    
    const response = apiSuccess(db.deals)
    console.log('GET Main Route - Response created with deals count:', db.deals.length)
    return response
  } catch (error) {
    console.error('GET Main Route - Error:', error)
    
    // Provide fallback sample data even on error
    const fallbackDeals = [
      {
        id: "fallback-1",
        title: "Super deal: Best Samsung phones",
        originalPrice: 27900.9,
        dealPrice: 24690.9,
        discount: 12,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmdr-t7nODszaBxRZz-0_MUAl8dRo3oQFXCw&s",
        category: "Electronics",
        dealType: "lightning",
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        stock: 10,
        sold: 0,
        rating: 4.5,
        reviews: 25,
        description: "The best Samsung phones with great features.",
        features: ["Phone", "Offer", "Deal"],
        freeShipping: true
      }
    ]
    
    console.log('GET Main Route - Fallback response created')
    return apiSuccess(fallbackDeals)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('POST Request - Body:', body)
    
    const { title, originalPrice, dealPrice, discount, image, images, category, dealType, endTime, stock, sold, rating, reviews, description, features, freeShipping } = body
    if (!title || originalPrice == null || dealPrice == null) return apiError('Title, originalPrice and dealPrice required', 400)
    
    const db = await getDb()
    console.log('Current deals in DB before creation:', db.deals.length)
    
    // Sample product images for defaults
    const sampleImages = [
      '/images/products/product_1.png',
      '/images/products/product_2.jpg',
      '/images/products/product_3.png',
      '/images/products/product_4.png',
      '/images/products/product_5.png',
      '/images/products/product_6.png',
      '/images/products/product_7.png',
      '/images/products/product_8.png'
    ];
    
    const deal = {
      id: generateId(),
      title,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      discount: discount ?? Math.round((1 - Number(dealPrice) / Number(originalPrice)) * 100),
      image: image && image !== '/api/placeholder/400/300' ? image : sampleImages[Math.floor(Math.random() * sampleImages.length)],
      images: images || [], // Array of additional images for gallery
      category: category || 'General',
      dealType: dealType || 'daily',
      endTime: endTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      stock: stock ?? 10,
      sold: sold ?? 0,
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
      description: description || '',
      features: features || [],
      freeShipping: freeShipping ?? true
    }
    
    console.log('New deal created:', deal)
    
    db.deals.push(deal)
    await writeDb(db)
    
    console.log('Total deals after creation:', db.deals.length)
    
    return apiSuccess(deal, 201)
  } catch (error) {
    console.error('Error creating deal:', error)
    return apiError('Failed to create deal', 500)
  }
}

