'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Tag, Percent, FileText, ShoppingCart, TrendingUp, Activity, Users, DollarSign, AlertCircle, TrendingDown, TrendingUp as StockUpIcon, Plus, Eye, Edit, Trash2 } from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  
  // Static data that always works
  const stats = {
    products: 12,
    categories: 8,
    deals: 5,
    blog: 3,
    orders: 24,
    banners: 4,
    coupons: 6
  }

  const recentOrders = [
    { id: '1', orderNumber: 'ORD-001', name: 'John Doe', email: 'john@example.com', total: 15000, status: 'Pending', createdAt: new Date().toISOString() },
    { id: '2', orderNumber: 'ORD-002', name: 'Jane Smith', email: 'jane@example.com', total: 25000, status: 'Completed', createdAt: new Date().toISOString() },
    { id: '3', orderNumber: 'ORD-003', name: 'Bob Johnson', email: 'bob@example.com', total: 8500, status: 'Processing', createdAt: new Date().toISOString() }
  ]

  const topProducts = [
    { id: '1', name: 'iPhone 13', price: 150000, stock: 25, rating: 4.5, image: 'https://www.custommacbd.com/cdn/shop/products/iphone-13-pink-Custom-Mac-BD.jpg?v=1634647421' },
    { id: '2', name: 'Smart Watch', price: 15000, stock: 50, rating: 4.3, image: 'https://img.drz.lazcdn.com/static/bd/p/b506a3a49007f3df27f2d222b190ecb6.jpg_720x720q80.jpg' },
    { id: '3', name: 'Lenovo Laptop', price: 76500, stock: 15, rating: 4.7, image: 'https://p4-ofp.static.pub//fes/cms/2023/08/23/983kt3002y3un5m318o1coqa0o7hxl595568.png' },
    { id: '4', name: 'Wireless Earbuds', price: 3500, stock: 100, rating: 4.2, image: 'https://example.com/earbuds.jpg' },
    { id: '5', name: 'Tablet Pro', price: 45000, stock: 8, rating: 4.6, image: 'https://example.com/tablet.jpg' }
  ]

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'red', icon: AlertCircle, label: 'Out of Stock', bgColor: 'bg-red-100', textColor: 'text-red-700' }
    if (stock <= 10) return { status: 'low', color: 'orange', icon: TrendingDown, label: 'Low Stock', bgColor: 'bg-orange-100', textColor: 'text-orange-700' }
    if (stock <= 50) return { status: 'medium', color: 'yellow', icon: Package, label: 'Medium Stock', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' }
    return { status: 'high', color: 'green', icon: StockUpIcon, label: 'In Stock', bgColor: 'bg-green-100', textColor: 'text-green-700' }
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const cards = [
    { label: 'Products', value: stats.products, href: '/dashboard/products', icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: stats.categories, href: '/dashboard/categories', icon: Tag, color: 'bg-green-500' },
    { label: 'Deals', value: stats.deals, href: '/dashboard/deals', icon: Percent, color: 'bg-orange-500' },
    { label: 'Blog Posts', value: stats.blog, href: '/dashboard/blog', icon: FileText, color: 'bg-purple-500' },
    { label: 'Orders', value: stats.orders, href: '/dashboard/orders', icon: ShoppingCart, color: 'bg-amber-500' },
    { label: 'Banners', value: stats.banners, href: '/dashboard/banners', icon: Package, color: 'bg-indigo-500' },
    { label: 'Coupons', value: stats.coupons, href: '/dashboard/coupons', icon: Tag, color: 'bg-pink-500' }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <Link key={index} href={card.href} className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">৳{order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Top Products</h2>
            <Link href="/dashboard/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock)
              const Icon = stockStatus.icon
              return (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">৳{product.price.toLocaleString()}</span>
                        <span className="text-xs text-yellow-600">⭐ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${stockStatus.bgColor} ${stockStatus.textColor}`}>
                      <Icon className="w-3 h-3" />
                      {stockStatus.label}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/products?action=add" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Add Product</span>
          </Link>
          <Link href="/dashboard/orders" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Eye className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">View Orders</span>
          </Link>
          <Link href="/dashboard/deals?action=add" className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Percent className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Create Deal</span>
          </Link>
          <Link href="/dashboard/blog?action=add" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Write Blog</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
