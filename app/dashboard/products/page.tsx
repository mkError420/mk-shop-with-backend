'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Filter, Search, Download, ChevronDown, Package, AlertCircle, TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, ShoppingCart, Archive, Tag, Upload, X, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  category: string
  description?: string
  size?: string
  stock: number
  featured?: boolean
  images?: string[]
}

export default function DashboardProductsPage() {
  // Load products from localStorage on initial load
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = localStorage.getItem('dashboardProducts')
      if (savedProducts) {
        try {
          return JSON.parse(savedProducts)
        } catch (error) {
          console.error('Failed to load saved products:', error)
        }
      }
    }
    
    // Default products if no saved data
    return [
      {
        id: 'mmbhx4773czywi13506',
        name: 'iPhone 13',
        price: 150000,
        originalPrice: 155000,
        image: 'https://www.custommacbd.com/cdn/shop/products/iphone-13-pink-Custom-Mac-BD.jpg?v=1634647421',
        rating: 4.5,
        reviews: 128,
        badge: 'Best Seller',
        category: 'Electronics',
        description: 'Latest iPhone 13 with advanced features',
        stock: 25,
        featured: true,
        images: [
          'https://www.custommacbd.com/cdn/shop/products/iphone-13-pink-Custom-Mac-BD.jpg?v=1634647421',
          'https://example.com/iphone13-blue.jpg',
          'https://example.com/iphone13-black.jpg',
          'https://example.com/iphone13-white.jpg'
        ]
      },
      {
        id: 'mmbkna9rmijocw75jf8',
        name: 'Smart Watch',
        price: 15000,
        originalPrice: 16990,
        image: 'https://img.drz.lazcdn.com/static/bd/p/b506a3a49007f3df27f2d222b190ecb6.jpg_720x720q80.jpg',
        rating: 4.3,
        reviews: 89,
        category: 'Electronics',
        description: 'Advanced smartwatch with health tracking',
        stock: 50,
        featured: true
      },
      {
        id: 'mmbks35eofpgkeemdu',
        name: 'Lenovo Laptop',
        price: 76500,
        originalPrice: 77300,
        image: 'https://p4-ofp.static.pub//fes/cms/2023/08/23/983kt3002y3un5m318o1coqa0o7hxl595568.png',
        rating: 4.7,
        reviews: 45,
        badge: 'New',
        category: 'Electronics',
        description: 'ThinkPad L13 2-in-1 Gen 5 (13" Intel)',
        stock: 15,
        featured: false,
        images: [
          'https://p4-ofp.static.pub//fes/cms/2023/08/23/983kt3002y3un5m318o1coqa0o7hxl595568.png',
          'https://techmarvels.com.bd/wp-content/uploads/2025/12/IdeaPad_Slim_3_14IRH10_CT2_08-768x768.webp',
          'https://p1-ofp.static.pub//fes/cms/2024/12/26/a95m3ujigs7g89r8dy8u6tuk4bawdc795866.png',
          'https://www.dearit.com.bd/image/cache/catalog/Lenovo/lenovo-thinkpad-l490-laptop-i5-8th-8-256-gb-laptop-3-500x500.jpg'
        ]
      },
      {
        id: 'mmbkt5y9wzj1u8x2h7k',
        name: 'Wireless Earbuds',
        price: 3500,
        image: 'https://example.com/earbuds.jpg',
        rating: 4.2,
        reviews: 234,
        category: 'Electronics',
        description: 'Premium wireless earbuds with noise cancellation',
        stock: 100,
        featured: false
      },
      {
        id: 'mmbpq8r2t3k4l5m6n7o',
        name: 'Tablet Pro',
        price: 45000,
        originalPrice: 49990,
        image: 'https://example.com/tablet.jpg',
        rating: 4.6,
        reviews: 67,
        badge: 'Limited',
        category: 'Electronics',
        description: 'Professional tablet for work and entertainment',
        stock: 8,
        featured: true
      },
      {
        id: 'mmbqr3s4t5u6v7w8x9y',
        name: 'Men\'s T-Shirt',
        price: 1200,
        image: 'https://example.com/tshirt.jpg',
        rating: 4.1,
        reviews: 156,
        category: 'Fashion',
        description: 'Comfortable cotton t-shirt',
        stock: 75,
        featured: false
      },
      {
        id: 'mmbst6u7v8w9x0y1z2a',
        name: 'Women\'s Handbag',
        price: 3500,
        originalPrice: 4200,
        image: 'https://example.com/handbag.jpg',
        rating: 4.4,
        reviews: 89,
        badge: 'Sale',
        category: 'Fashion',
        description: 'Stylish leather handbag',
        stock: 30,
        featured: false
      },
      {
        id: 'mmbuv8w9x0y1z2a3b4c',
        name: 'Office Chair',
        price: 8500,
        image: 'https://example.com/chair.jpg',
        rating: 4.3,
        reviews: 45,
        category: 'Home & Garden',
        description: 'Ergonomic office chair',
        stock: 20,
        featured: false
      }
    ]
  })
  
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [stockUpdates, setStockUpdates] = useState<{[key: string]: string}>({})
  const [updatingStock, setUpdatingStock] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    description: '',
    stock: '',
    featured: false,
    badge: '',
    image: ''
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  // Load categories from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategories = localStorage.getItem('dashboardCategories')
      if (savedCategories) {
        try {
          const parsedCategories = JSON.parse(savedCategories)
          // Extract all categories (both main and subcategories)
          const allCategories = parsedCategories.flatMap((cat: any) => [
            { id: cat.id, title: cat.title },
            ...(cat.subcategories || []).map((sub: any) => ({ id: sub.id, title: sub.title }))
          ])
          setCategories(allCategories)
        } catch (error) {
          console.error('Failed to load categories:', error)
          // Fallback to default categories
          setCategories([
            { id: '1', title: 'Electronics' },
            { id: '2', title: 'Smartphones' },
            { id: '3', title: 'Laptops' },
            { id: '4', title: 'Tablets' },
            { id: '5', title: 'Fashion' },
            { id: '6', title: 'Men\'s Clothing' },
            { id: '7', title: 'Women\'s Clothing' },
            { id: '8', title: 'Accessories' },
            { id: '9', title: 'Home & Garden' },
            { id: '10', title: 'Furniture' },
            { id: '11', title: 'Decor' }
          ])
        }
      } else {
        // Fallback to default categories
        setCategories([
          { id: '1', title: 'Electronics' },
          { id: '2', title: 'Smartphones' },
          { id: '3', title: 'Laptops' },
          { id: '4', title: 'Tablets' },
          { id: '5', title: 'Fashion' },
          { id: '6', title: 'Men\'s Clothing' },
          { id: '7', title: 'Women\'s Clothing' },
          { id: '8', title: 'Accessories' },
          { id: '9', title: 'Home & Garden' },
          { id: '10', title: 'Furniture' },
          { id: '11', title: 'Decor' }
        ])
      }
    }
  }, [])

  // Save products to localStorage whenever they change
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardProducts', JSON.stringify(updatedProducts))
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0) * (product.stock || 0), 0)
    const avgPrice = totalProducts > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts : 0
    const outOfStock = products.filter(product => (product.stock || 0) === 0).length
    const lowStock = products.filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= 10).length
    const inStock = products.filter(product => (product.stock || 0) > 10).length
    const totalCategories = new Set(products.map(p => p.category)).size
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0)
    
    // Calculate growth (mock data for demonstration)
    const productsGrowth = 15.2
    const valueGrowth = 8.7
    
    return {
      totalProducts,
      totalValue,
      avgPrice,
      outOfStock,
      lowStock,
      inStock,
      totalCategories,
      totalStock,
      productsGrowth,
      valueGrowth
    }
  }

  const stats = calculateStats()

  // Stock distribution for charts
  const stockDistribution = [
    { name: 'In Stock', value: stats.inStock, color: '#10b981' },
    { name: 'Low Stock', value: stats.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStock, color: '#ef4444' }
  ]

  // Category distribution
  const categoryDistribution = [
    { name: 'Electronics', value: products.filter(p => p.category === 'Electronics').length, color: '#3b82f6' },
    { name: 'Fashion', value: products.filter(p => p.category === 'Fashion').length, color: '#8b5cf6' },
    { name: 'Home & Garden', value: products.filter(p => p.category === 'Home & Garden').length, color: '#10b981' }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: form.name,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      description: form.description,
      stock: parseInt(form.stock),
      featured: form.featured,
      badge: form.badge,
      image: form.image
    }
    
    try {
      let updatedProducts: Product[]
      
      if (editingProduct) {
        // Update existing product
        updatedProducts = products.map(product => 
          product.id === editingProduct.id 
            ? { ...product, ...productData }
            : product
        )
      } else {
        // Create new product
        updatedProducts = [...products, productData]
      }
      
      // Save to localStorage and update state
      saveProducts(updatedProducts)
      
      resetForm()
      setShowForm(false)
      
      // Show success message
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!')
      
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      description: '',
      stock: '',
      featured: false,
      badge: '',
      image: ''
    })
    setImagePreview('')
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      description: product.description || '',
      stock: product.stock.toString(),
      featured: product.featured || false,
      badge: product.badge || '',
      image: product.image
    })
    setImagePreview(product.image)
    setShowForm(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    
    try {
      const updatedProducts = products.filter(product => product.id !== id)
      saveProducts(updatedProducts)
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const handleStockUpdate = async (productId: string, newStock: string) => {
    const stock = parseInt(newStock)
    if (isNaN(stock) || stock < 0) return
    
    setUpdatingStock(productId)
    try {
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, stock }
          : product
      )
      saveProducts(updatedProducts)
      setStockUpdates(prev => ({ ...prev, [productId]: '' }))
      alert('Stock updated successfully!')
    } catch (error) {
      console.error('Failed to update stock:', error)
      alert('Failed to update stock. Please try again.')
    } finally {
      setUpdatingStock(null)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      
      // Store the file data as base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setForm({ ...form, image: '' })
    setImagePreview('')
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'red', icon: AlertCircle, label: 'Out of Stock', bgColor: 'bg-red-100', textColor: 'text-red-700' }
    if (stock <= 10) return { status: 'low', color: 'orange', icon: TrendingDown, label: 'Low Stock', bgColor: 'bg-orange-100', textColor: 'text-orange-700' }
    return { status: 'high', color: 'green', icon: TrendingUp, label: 'In Stock', bgColor: 'bg-green-100', textColor: 'text-green-700' }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const exportProducts = (format: 'csv' | 'excel' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting ${filteredProducts.length} products as ${format.toUpperCase()}...`)
    setShowExportDropdown(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Dashboard Diagram Section */}
      <div className="mb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your product inventory and pricing</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" /> Export
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button onClick={() => exportProducts('csv')} className="w-full text-left px-4 py-2 hover:bg-gray-100">Export as CSV</button>
                  <button onClick={() => exportProducts('excel')} className="w-full text-left px-4 py-2 hover:bg-gray-100">Export as Excel</button>
                  <button onClick={() => exportProducts('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-100">Export as PDF</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.productsGrowth}%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{stats.totalValue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.valueGrowth}%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">৳{Math.round(stats.avgPrice).toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <Tag className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-600">Per item</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalStock}</p>
                <div className="flex items-center mt-2">
                  <Archive className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-600">Units</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Archive className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stock Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Stock Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stockDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalProducts > 0 ? (item.value / stats.totalProducts) * 100 : 0}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalProducts > 0 ? (item.value / stats.totalProducts) * 100 : 0}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.title}>{category.title}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.title}>{category.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., New, Sale, Best Seller"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Product description..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors relative">
              {imagePreview || form.image ? (
                <div className="relative">
                  <img
                    src={imagePreview || form.image}
                    alt="Product preview"
                    className="w-24 h-24 mx-auto rounded-lg object-cover mb-2"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload product image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured Product</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false) }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Stock</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              const Icon = stockStatus.icon
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.badge && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded mr-2">
                              {product.badge}
                            </span>
                          )}
                          {product.featured && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">৳{product.price.toLocaleString()}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">৳{product.originalPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : product.stock}
                        onChange={(e) => setStockUpdates(prev => ({ ...prev, [product.id]: e.target.value }))}
                        className="w-20 px-2 py-1 border rounded"
                        disabled={updatingStock === product.id}
                      />
                      {stockUpdates[product.id] !== undefined && stockUpdates[product.id] !== product.stock.toString() && (
                        <button
                          onClick={() => handleStockUpdate(product.id, stockUpdates[product.id])}
                          className="text-green-600 hover:text-green-700"
                          disabled={updatingStock === product.id}
                        >
                          {updatingStock === product.id ? '...' : '✓'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${stockStatus.bgColor} ${stockStatus.textColor}`}>
                      <Icon className="w-3 h-3" />
                      {stockStatus.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="Edit Product"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            {searchTerm || selectedCategory !== 'all'
              ? 'No products found matching your criteria.'
              : 'No products yet. Add your first product!'}
          </p>
        )}
      </div>
    </div>
  )
}
