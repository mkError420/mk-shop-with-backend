import { useState, useEffect } from 'react'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  icon?: string
  subcategories?: Category[]
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('useCategories: Loading static categories data...')
        setLoading(true)
        
        // Static categories data that matches the dashboard
        const staticCategories: Category[] = [
          {
            id: '1',
            title: 'Electronics',
            slug: 'electronics',
            href: 'electronics',
            icon: 'https://example.com/electronics-icon.png',
            subcategories: [
              { id: '2', title: 'Smartphones', slug: 'smartphones', href: 'smartphones', parentId: '1' },
              { id: '3', title: 'Laptops', slug: 'laptops', href: 'laptops', parentId: '1' },
              { id: '4', title: 'Tablets', slug: 'tablets', href: 'tablets', parentId: '1' }
            ]
          },
          {
            id: '5',
            title: 'Fashion',
            slug: 'fashion',
            href: 'fashion',
            subcategories: [
              { id: '6', title: 'Men\'s Clothing', slug: 'mens-clothing', href: 'mens-clothing', parentId: '5' },
              { id: '7', title: 'Women\'s Clothing', slug: 'womens-clothing', href: 'womens-clothing', parentId: '5' },
              { id: '8', title: 'Accessories', slug: 'accessories', href: 'accessories', parentId: '5' }
            ]
          },
          {
            id: '9',
            title: 'Home & Garden',
            slug: 'home-garden',
            href: 'home-garden',
            subcategories: [
              { id: '10', title: 'Furniture', slug: 'furniture', href: 'furniture', parentId: '9' },
              { id: '11', title: 'Decor', slug: 'decor', href: 'decor', parentId: '9' }
            ]
          }
        ]
        
        console.log('useCategories: Static categories loaded:', staticCategories)
        setCategories(staticCategories)
        setError(null)
      } catch (err) {
        console.error('useCategories: Error loading categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export const useFlatCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        
        // Static flat categories data
        const staticCategories: Category[] = [
          { id: '1', title: 'Electronics', slug: 'electronics', href: 'electronics' },
          { id: '2', title: 'Smartphones', slug: 'smartphones', href: 'smartphones', parentId: '1' },
          { id: '3', title: 'Laptops', slug: 'laptops', href: 'laptops', parentId: '1' },
          { id: '4', title: 'Tablets', slug: 'tablets', href: 'tablets', parentId: '1' },
          { id: '5', title: 'Fashion', slug: 'fashion', href: 'fashion' },
          { id: '6', title: 'Men\'s Clothing', slug: 'mens-clothing', href: 'mens-clothing', parentId: '5' },
          { id: '7', title: 'Women\'s Clothing', slug: 'womens-clothing', href: 'womens-clothing', parentId: '5' },
          { id: '8', title: 'Accessories', slug: 'accessories', href: 'accessories', parentId: '5' },
          { id: '9', title: 'Home & Garden', slug: 'home-garden', href: 'home-garden' },
          { id: '10', title: 'Furniture', slug: 'furniture', href: 'furniture', parentId: '9' },
          { id: '11', title: 'Decor', slug: 'decor', href: 'decor', parentId: '9' }
        ]
        
        setCategories(staticCategories)
        setError(null)
      } catch (err) {
        setError('Failed to load categories')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
