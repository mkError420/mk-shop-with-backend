import { 
  db, 
  storage, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from './firebase'

// Product interfaces
export interface Product {
  id?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  rating?: number
  reviews?: number
  badge?: string
  category: string
  description?: string
  size?: string
  stock: number
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  id?: string
  title: string
  slug: string
  href: string
  parentId?: string
  subcategories?: Category[]
  createdAt?: Date
  updatedAt?: Date
}

// Products CRUD operations
export const productsService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products')
      const q = query(productsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, 'products', id)
      const productSnap = await getDoc(productRef)
      
      if (productSnap.exists()) {
        return {
          id: productSnap.id,
          ...productSnap.data()
        } as Product
      }
      return null
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Create new product
  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const productsRef = collection(db, 'products')
      const now = new Date()
      
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(productsRef, productData)
      
      return {
        id: docRef.id,
        ...productData
      }
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Update product
  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const productRef = doc(db, 'products', id)
      const updateData = {
        ...product,
        updatedAt: new Date()
      }
      
      await updateDoc(productRef, updateData)
      
      const updatedProduct = await this.getById(id)
      if (!updatedProduct) {
        throw new Error('Product not found after update')
      }
      
      return updatedProduct
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      const productRef = doc(db, 'products', id)
      await deleteDoc(productRef)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  // Upload product image to Firebase Storage
  async uploadImage(file: File, productId: string, imageType: 'main' | 'gallery' = 'main', index?: number): Promise<string> {
    try {
      const fileName = imageType === 'main' 
        ? `products/${productId}/main.jpg`
        : `products/${productId}/gallery_${index}.jpg`
      
      const storageRef = ref(storage, fileName)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Delete product image from Firebase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  },

  // Search products
  async search(searchTerm: string, category?: string): Promise<Product[]> {
    try {
      let productsRef = collection(db, 'products')
      let q = query(productsRef, orderBy('createdAt', 'desc'))

      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that filters on the client side
      const querySnapshot = await getDocs(q)
      let products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      // Filter on client side
      if (searchTerm) {
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (category && category !== 'all') {
        products = products.filter(product => product.category === category)
      }

      return products
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  },

  // Get products by category
  async getByCategory(category: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products')
      const q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  // Get featured products
  async getFeatured(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products')
      const q = query(
        productsRef, 
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  },

  // Get low stock products
  async getLowStock(threshold: number = 10): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products')
      const q = query(
        productsRef, 
        where('stock', '<=', threshold),
        orderBy('stock', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      throw error
    }
  }
}

// Categories CRUD operations
export const categoriesService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories')
      const q = query(categoriesRef, orderBy('title', 'asc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get main categories (no parentId)
  async getMainCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories')
      const q = query(
        categoriesRef, 
        where('parentId', '==', null),
        orderBy('title', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[]
    } catch (error) {
      console.error('Error fetching main categories:', error)
      throw error
    }
  },

  // Get subcategories by parent ID
  async getSubcategories(parentId: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories')
      const q = query(
        categoriesRef, 
        where('parentId', '==', parentId),
        orderBy('title', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[]
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      throw error
    }
  },

  // Create new category
  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const categoriesRef = collection(db, 'categories')
      const now = new Date()
      
      const categoryData = {
        ...category,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(categoriesRef, categoryData)
      
      return {
        id: docRef.id,
        ...categoryData
      }
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  // Update category
  async update(id: string, category: Partial<Category>): Promise<Category> {
    try {
      const categoryRef = doc(db, 'categories', id)
      const updateData = {
        ...category,
        updatedAt: new Date()
      }
      
      await updateDoc(categoryRef, updateData)
      
      const updatedCategory = await this.getById(id)
      if (!updatedCategory) {
        throw new Error('Category not found after update')
      }
      
      return updatedCategory
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Get category by ID
  async getById(id: string): Promise<Category | null> {
    try {
      const categoryRef = doc(db, 'categories', id)
      const categorySnap = await getDoc(categoryRef)
      
      if (categorySnap.exists()) {
        return {
          id: categorySnap.id,
          ...categorySnap.data()
        } as Category
      }
      return null
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },

  // Delete category
  async delete(id: string): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', id)
      await deleteDoc(categoryRef)
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

export default {
  products: productsService,
  categories: categoriesService
}
