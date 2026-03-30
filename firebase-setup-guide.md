# Firebase Setup Guide for Mk Shop

## 🚨 **URGENT: Dashboard Not Working on Live Site**

The admin dashboard cannot add products because Firebase is not configured.

---

## **Step 1: Create Firebase Project**

1. Go to https://console.firebase.google.com
2. Click "Add project" 
3. Name it: `mk-shop-ecommerce`
4. Enable Google Analytics (optional)
5. Click "Create project"

---

## **Step 2: Enable Firebase Services**

### **Firestore Database**
1. Go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Click "Create"

### **Authentication**
1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

### **Storage**
1. Go to "Build" → "Storage"
2. Click "Get started"
3. Start in test mode
4. Click "Done"

---

## **Step 3: Get Firebase Configuration**

1. Go to "Project Settings" (⚙️ icon)
2. Scroll down to "Your apps" section
3. Click "Web app" (if not exists) or select existing
4. Copy the firebaseConfig object

It should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

---

## **Step 4: Update Environment Variables**

Create `.env.local` file in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Replace the values with your actual Firebase credentials.

---

## **Step 5: Test the Dashboard**

1. Restart your development server: `npm run dev`
2. Go to http://localhost:3000/dashboard
3. Try to add a product
4. Check browser console for Firebase connection status

---

## **Step 6: Deploy to Netlify**

1. Add Firebase config to Netlify environment variables
2. Deploy: `npm run build && netlify deploy --prod`
3. Test the live dashboard

---

## **🔥 Firestore Security Rules (Important!)**

Once working, update Firestore rules for security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read for everyone, write for authenticated users
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories - read for everyone, write for authenticated users  
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other collections - similar rules
    match /deals/{dealId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /blog/{blogId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /coupons/{couponId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## **🚀 Quick Test Commands**

```bash
# Test Firebase connection
npm run dev

# Check console for Firebase logs
# Look for: "Firebase initialized successfully"

# Test product creation
# Go to /dashboard/products and try adding a product
```

---

## **🆘 Troubleshooting**

### **Error: "Firebase not available"**
- Check environment variables in `.env.local`
- Restart development server
- Check Firebase project settings

### **Error: "permission-denied"**
- Update Firestore security rules
- Ensure user is authenticated
- Check Firebase Auth settings

### **Error: "network-request-failed"**
- Check internet connection
- Verify Firebase project ID
- Check API key validity

---

## **⚡ After Setup Works**

1. Remove test mode from Firestore
2. Set up proper security rules
3. Create admin user in Firebase Auth
4. Test all dashboard features

---

**🎯 The dashboard will work immediately after Firebase is configured!**
