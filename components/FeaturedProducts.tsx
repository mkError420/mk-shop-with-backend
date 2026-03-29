'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to get products from dashboard localStorage
        if (typeof window !== 'undefined') {
          const savedProducts = localStorage.getItem('dashboardProducts')
          if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts)
            console.log('FeaturedProducts loaded from localStorage:', parsedProducts.length, 'items')
            
            // Filter for featured products or use latest products
            const featuredProducts = parsedProducts.filter((product: any) => product.featured)
            const productsToShow = featuredProducts.length > 0 ? featuredProducts : parsedProducts.slice(0, 8)
            
            setProducts(productsToShow)
          } else {
            console.log('No products in localStorage')
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Error loading products from localStorage:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className='py-8 sm:py-12 md:py-16 bg-shop_light_bg'>
        <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
          {/* Section Header */}
          <div className='text-center mb-8 sm:mb-10 md:mb-12'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
              Featured <span className='text-shop_dark_green'>Products</span>
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4'>
              Discover our handpicked selection of best deals and trending products
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
            {[...Array(8)].map((_, index) => (
              <div key={index} className='bg-white rounded-lg p-4 animate-pulse'>
                <div className='bg-gray-200 rounded-lg h-48 mb-4' />
                <div className='bg-gray-200 h-4 rounded mb-2' />
                <div className='bg-gray-200 h-3 rounded w-3/4 mb-2' />
                <div className='bg-gray-200 h-6 rounded w-1/2' />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-8 sm:py-12 md:py-16 bg-shop_light_bg'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4'>
            Featured <span className='text-shop_dark_green'>Products</span>
          </h2>
          <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4'>
            Discover our handpicked selection of best deals and trending products
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
            {products.slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <div className='text-gray-400 text-6xl mb-4'>📦</div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              No featured products available
            </h3>
            <p className='text-gray-600'>
              Add products through the Admin Dashboard and mark them as featured to see them here.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className='text-center mt-8 sm:mt-10 md:mt-12'>
          <Link
            href='/shop'
            className='inline-flex items-center gap-2 bg-white border-2 border-shop_dark_green text-shop_dark_green px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:text-white hover:shadow-lg hover:shadow-shop_dark_green/25 transition-all duration-300 text-sm sm:text-base'
          >
            View All Products
            <svg className='w-4 h-4 sm:w-5 sm:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
