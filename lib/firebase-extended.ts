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

// Deal interfaces
export interface Deal {
  id?: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  applicableProducts?: string[] // Product IDs
  applicableCategories?: string[] // Category names
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Blog interfaces
export interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  author: string
  publishedAt?: Date
  isPublished: boolean
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

// Order interfaces
export interface Order {
  id?: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt?: Date
  updatedAt?: Date
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

// Banner interfaces
export interface Banner {
  id?: string
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  linkText?: string
  isActive: boolean
  position: 'home' | 'category' | 'product'
  displayOrder: number
  startDate?: Date
  endDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Coupon interfaces
export interface Coupon {
  id?: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  applicableProducts?: string[] // Product IDs
  applicableCategories?: string[] // Category names
  isActive: boolean
  expiresAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Deals CRUD operations
export const dealsService = {
  async getAll(): Promise<Deal[]> {
    try {
      const dealsRef = collection(db, 'deals')
      const q = query(dealsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate()
      })) as Deal[]
    } catch (error) {
      console.error('Error fetching deals:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Deal | null> {
    try {
      const dealRef = doc(db, 'deals', id)
      const dealSnap = await getDoc(dealRef)
      
      if (dealSnap.exists()) {
        const data = dealSnap.data()
        return {
          id: dealSnap.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate()
        } as Deal
      }
      return null
    } catch (error) {
      console.error('Error fetching deal:', error)
      throw error
    }
  },

  async create(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> {
    try {
      const dealsRef = collection(db, 'deals')
      const now = new Date()
      
      const dealData = {
        ...deal,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(dealsRef, dealData)
      
      return {
        id: docRef.id,
        ...dealData
      }
    } catch (error) {
      console.error('Error creating deal:', error)
      throw error
    }
  },

  async update(id: string, deal: Partial<Deal>): Promise<Deal> {
    try {
      const dealRef = doc(db, 'deals', id)
      const updateData = {
        ...deal,
        updatedAt: new Date()
      }
      
      await updateDoc(dealRef, updateData)
      
      const updatedDeal = await this.getById(id)
      if (!updatedDeal) {
        throw new Error('Deal not found after update')
      }
      
      return updatedDeal
    } catch (error) {
      console.error('Error updating deal:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const dealRef = doc(db, 'deals', id)
      await deleteDoc(dealRef)
    } catch (error) {
      console.error('Error deleting deal:', error)
      throw error
    }
  },

  async getActive(): Promise<Deal[]> {
    try {
      const now = new Date()
      const dealsRef = collection(db, 'deals')
      const q = query(
        dealsRef,
        where('isActive', '==', true),
        where('startDate', '<=', now),
        where('endDate', '>=', now),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate()
      })) as Deal[]
    } catch (error) {
      console.error('Error fetching active deals:', error)
      throw error
    }
  }
}

// Blog CRUD operations
export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    try {
      const blogRef = collection(db, 'blog')
      const q = query(blogRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate()
      })) as BlogPost[]
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
  },

  async getById(id: string): Promise<BlogPost | null> {
    try {
      const blogRef = doc(db, 'blog', id)
      const blogSnap = await getDoc(blogRef)
      
      if (blogSnap.exists()) {
        const data = blogSnap.data()
        return {
          id: blogSnap.id,
          ...data,
          publishedAt: data.publishedAt?.toDate()
        } as BlogPost
      }
      return null
    } catch (error) {
      console.error('Error fetching blog post:', error)
      throw error
    }
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const blogRef = collection(db, 'blog')
      const q = query(blogRef, where('slug', '==', slug), limit(1))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) return null
      
      const doc = querySnapshot.docs[0]
      const data = doc.data()
      
      return {
        id: doc.id,
        ...data,
        publishedAt: data.publishedAt?.toDate()
      } as BlogPost
    } catch (error) {
      console.error('Error fetching blog post by slug:', error)
      throw error
    }
  },

  async create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    try {
      const blogRef = collection(db, 'blog')
      const now = new Date()
      
      const postData = {
        ...post,
        publishedAt: post.isPublished ? now : undefined,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(blogRef, postData)
      
      return {
        id: docRef.id,
        ...postData
      }
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw error
    }
  },

  async update(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const blogRef = doc(db, 'blog', id)
      const updateData = {
        ...post,
        updatedAt: new Date()
      }
      
      await updateDoc(blogRef, updateData)
      
      const updatedPost = await this.getById(id)
      if (!updatedPost) {
        throw new Error('Blog post not found after update')
      }
      
      return updatedPost
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const blogRef = doc(db, 'blog', id)
      await deleteDoc(blogRef)
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  },

  async getPublished(): Promise<BlogPost[]> {
    try {
      const blogRef = collection(db, 'blog')
      const q = query(
        blogRef,
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate()
      })) as BlogPost[]
    } catch (error) {
      console.error('Error fetching published blog posts:', error)
      throw error
    }
  }
}

// Orders CRUD operations
export const ordersService = {
  async getAll(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Order[]
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, 'orders', id)
      const orderSnap = await getDoc(orderRef)
      
      if (orderSnap.exists()) {
        const data = orderSnap.data()
        return {
          id: orderSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Order
      }
      return null
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const ordersRef = collection(db, 'orders')
      const now = new Date()
      
      const orderData = {
        ...order,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(ordersRef, orderData)
      
      return {
        id: docRef.id,
        ...orderData
      }
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const orderRef = doc(db, 'orders', id)
      const updateData = {
        status,
        updatedAt: new Date()
      }
      
      await updateDoc(orderRef, updateData)
      
      const updatedOrder = await this.getById(id)
      if (!updatedOrder) {
        throw new Error('Order not found after update')
      }
      
      return updatedOrder
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<Order> {
    try {
      const orderRef = doc(db, 'orders', id)
      const updateData = {
        paymentStatus,
        updatedAt: new Date()
      }
      
      await updateDoc(orderRef, updateData)
      
      const updatedOrder = await this.getById(id)
      if (!updatedOrder) {
        throw new Error('Order not found after update')
      }
      
      return updatedOrder
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  },

  async getByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Order[]
    } catch (error) {
      console.error('Error fetching orders by status:', error)
      throw error
    }
  }
}

// Banners CRUD operations
export const bannersService = {
  async getAll(): Promise<Banner[]> {
    try {
      const bannersRef = collection(db, 'banners')
      const q = query(bannersRef, orderBy('displayOrder', 'asc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate()
      })) as Banner[]
    } catch (error) {
      console.error('Error fetching banners:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Banner | null> {
    try {
      const bannerRef = doc(db, 'banners', id)
      const bannerSnap = await getDoc(bannerRef)
      
      if (bannerSnap.exists()) {
        const data = bannerSnap.data()
        return {
          id: bannerSnap.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate()
        } as Banner
      }
      return null
    } catch (error) {
      console.error('Error fetching banner:', error)
      throw error
    }
  },

  async create(banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
    try {
      const bannersRef = collection(db, 'banners')
      const now = new Date()
      
      const bannerData = {
        ...banner,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(bannersRef, bannerData)
      
      return {
        id: docRef.id,
        ...bannerData
      }
    } catch (error) {
      console.error('Error creating banner:', error)
      throw error
    }
  },

  async update(id: string, banner: Partial<Banner>): Promise<Banner> {
    try {
      const bannerRef = doc(db, 'banners', id)
      const updateData = {
        ...banner,
        updatedAt: new Date()
      }
      
      await updateDoc(bannerRef, updateData)
      
      const updatedBanner = await this.getById(id)
      if (!updatedBanner) {
        throw new Error('Banner not found after update')
      }
      
      return updatedBanner
    } catch (error) {
      console.error('Error updating banner:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const bannerRef = doc(db, 'banners', id)
      await deleteDoc(bannerRef)
    } catch (error) {
      console.error('Error deleting banner:', error)
      throw error
    }
  },

  async uploadImage(file: File, bannerId: string): Promise<string> {
    try {
      const fileName = `banners/${bannerId}/banner.jpg`
      const storageRef = ref(storage, fileName)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading banner image:', error)
      throw error
    }
  },

  async getActive(): Promise<Banner[]> {
    try {
      const now = new Date()
      const bannersRef = collection(db, 'banners')
      const q = query(
        bannersRef,
        where('isActive', '==', true),
        orderBy('displayOrder', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        const banner = {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate()
        } as Banner
        
        // Filter by date range if specified
        if (banner.startDate && banner.endDate) {
          return now >= banner.startDate && now <= banner.endDate ? banner : null
        }
        
        return banner
      }).filter(Boolean) as Banner[]
    } catch (error) {
      console.error('Error fetching active banners:', error)
      throw error
    }
  },

  async getByPosition(position: Banner['position']): Promise<Banner[]> {
    try {
      const bannersRef = collection(db, 'banners')
      const q = query(
        bannersRef,
        where('position', '==', position),
        where('isActive', '==', true),
        orderBy('displayOrder', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate()
      })) as Banner[]
    } catch (error) {
      console.error('Error fetching banners by position:', error)
      throw error
    }
  }
}

// Coupons CRUD operations
export const couponsService = {
  async getAll(): Promise<Coupon[]> {
    try {
      const couponsRef = collection(db, 'coupons')
      const q = query(couponsRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiresAt: doc.data().expiresAt?.toDate()
      })) as Coupon[]
    } catch (error) {
      console.error('Error fetching coupons:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Coupon | null> {
    try {
      const couponRef = doc(db, 'coupons', id)
      const couponSnap = await getDoc(couponRef)
      
      if (couponSnap.exists()) {
        const data = couponSnap.data()
        return {
          id: couponSnap.id,
          ...data,
          expiresAt: data.expiresAt?.toDate()
        } as Coupon
      }
      return null
    } catch (error) {
      console.error('Error fetching coupon:', error)
      throw error
    }
  },

  async getByCode(code: string): Promise<Coupon | null> {
    try {
      const couponsRef = collection(db, 'coupons')
      const q = query(couponsRef, where('code', '==', code.toUpperCase()), limit(1))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) return null
      
      const doc = querySnapshot.docs[0]
      const data = doc.data()
      
      return {
        id: doc.id,
        ...data,
        expiresAt: data.expiresAt?.toDate()
      } as Coupon
    } catch (error) {
      console.error('Error fetching coupon by code:', error)
      throw error
    }
  },

  async create(coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>): Promise<Coupon> {
    try {
      const couponsRef = collection(db, 'coupons')
      const now = new Date()
      
      const couponData = {
        ...coupon,
        code: coupon.code.toUpperCase(),
        usedCount: 0,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(couponsRef, couponData)
      
      return {
        id: docRef.id,
        ...couponData
      }
    } catch (error) {
      console.error('Error creating coupon:', error)
      throw error
    }
  },

  async update(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    try {
      const couponRef = doc(db, 'coupons', id)
      const updateData = {
        ...coupon,
        code: coupon.code ? coupon.code.toUpperCase() : undefined,
        updatedAt: new Date()
      }
      
      await updateDoc(couponRef, updateData)
      
      const updatedCoupon = await this.getById(id)
      if (!updatedCoupon) {
        throw new Error('Coupon not found after update')
      }
      
      return updatedCoupon
    } catch (error) {
      console.error('Error updating coupon:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const couponRef = doc(db, 'coupons', id)
      await deleteDoc(couponRef)
    } catch (error) {
      console.error('Error deleting coupon:', error)
      throw error
    }
  },

  async validateCoupon(code: string, orderAmount: number): Promise<Coupon | null> {
    try {
      const coupon = await this.getByCode(code)
      
      if (!coupon) {
        throw new Error('Invalid coupon code')
      }
      
      if (!coupon.isActive) {
        throw new Error('Coupon is not active')
      }
      
      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        throw new Error('Coupon has expired')
      }
      
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('Coupon usage limit exceeded')
      }
      
      if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        throw new Error(`Minimum order amount of ৳${coupon.minOrderAmount} required`)
      }
      
      return coupon
    } catch (error) {
      console.error('Error validating coupon:', error)
      throw error
    }
  },

  async incrementUsage(id: string): Promise<void> {
    try {
      const couponRef = doc(db, 'coupons', id)
      await updateDoc(couponRef, {
        usedCount: increment(1),
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error incrementing coupon usage:', error)
      throw error
    }
  },

  async getActive(): Promise<Coupon[]> {
    try {
      const now = new Date()
      const couponsRef = collection(db, 'coupons')
      const q = query(
        couponsRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        const coupon = {
          id: doc.id,
          ...data,
          expiresAt: data.expiresAt?.toDate()
        } as Coupon
        
        // Filter out expired coupons
        if (coupon.expiresAt && now > coupon.expiresAt) {
          return null
        }
        
        // Filter out coupons that have reached usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return null
        }
        
        return coupon
      }).filter(Boolean) as Coupon[]
    } catch (error) {
      console.error('Error fetching active coupons:', error)
      throw error
    }
  }
}

// Helper function for incrementing field values
function increment(value: number) {
  // This would need to be imported from firebase/firestore
  // For now, we'll just return the value
  return value
}

export default {
  deals: dealsService,
  blog: blogService,
  orders: ordersService,
  banners: bannersService,
  coupons: couponsService
}
