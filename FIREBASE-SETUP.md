# 🔧 Firebase Admin User Setup

## Quick Setup Steps

### 1. Test Firebase Connection
Visit: http://localhost:3000/firebase-test
- Check if all environment variables are loaded
- Verify Firebase Auth is available

### 2. Create Admin User in Firebase Console
1. Go to: https://console.firebase.google.com
2. Select your project: `mk-shop-ecommerce`
3. Go to "Authentication" → "Users" tab
4. Click "Add user"
5. Enter:
   - **Email**: `mk.rabbani.cse@gmail.com`
   - **Password**: Choose a secure password
6. Click "Add user"

### 3. Test Dashboard Login
1. Go to: http://localhost:3000/dashboard/login
2. Enter credentials:
   - **Email**: `mk.rabbani.cse@gmail.com`
   - **Password**: The password you just created

### 4. Troubleshooting

#### If Firebase Auth not available:
- Check `.env.local` file exists and has correct values
- Restart development server: `npm run dev`
- Check browser console for initialization logs

#### If login fails:
- Verify user exists in Firebase Console
- Check email/password are correct
- Ensure Authentication is enabled in Firebase

#### Environment Variables Check:
Your `.env.local` should contain:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDkwcT77ctRI_rjgzFTNLW094oDb6O-GPs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mk-shop-ecommerce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mk-shop-ecommerce
# ... other variables
```

### 5. Next Steps After Login
Once logged in successfully:
1. Browse to different dashboard sections
2. Add products, categories, deals
3. Test all functionality locally
4. Deploy to Netlify using the deployment guide

## 🔥 Ready to Deploy!

After successful local testing:
1. Follow `LIVE-DEPLOYMENT-GUIDE.md`
2. Set same environment variables in Netlify
3. Deploy and test live site
