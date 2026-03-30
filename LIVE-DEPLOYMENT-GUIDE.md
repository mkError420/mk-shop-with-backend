# 🔥 Live Deployment Guide: Netlify + Firebase

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "mk-shop-ecommerce")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firebase Services
After project creation, enable these services:

#### Authentication
1. Go to "Authentication" → "Get started"
2. Enable "Email/Password" sign-in method
3. Click "Enable"

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for now)
3. Select a location (choose closest to your users)
4. Click "Create database"

#### Storage (Optional - for images)
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select a location
4. Click "Start"

## Step 2: Get Firebase Configuration

### 2.1 Web App Configuration
1. In Firebase Console, click "Project Settings" (gear icon)
2. Under "General" tab, click "Web app" → "Register app"
3. Enter app name: "MK Shop Web"
4. Click "Register app"
5. Copy the `firebaseConfig` object - you'll need these values

### 2.2 Service Account Key
1. In Project Settings, go to "Service accounts" tab
2. Click "Generate new private key"
3. Click "Generate key"
4. Download the JSON file
5. Open the JSON file and copy these values:
   - `project_id`
   - `client_email`
   - `private_key` (full key with newlines)

## Step 3: Configure Environment Variables

### 3.1 Create .env.local file
Create a file named `.env.local` in your project root with:

```env
# Firebase Web App Config (from Step 2.1)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Config (from Step 2.2)
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mk-shop-ecommerce.iam.gserviceaccount.com
```

## Step 4: Netlify Deployment

### 4.1 Push to GitHub (if not already)
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 4.2 Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Select your repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18`
7. Click "Create site"

### 4.3 Set Netlify Environment Variables
1. In Netlify dashboard, go to "Site settings" → "Build & deploy" → "Environment"
2. Add all the environment variables from Step 3.1
3. **Important**: For the private key, paste the entire key including newlines

## Step 5: Test Your Live Site

### 5.1 Check Deployment
After deployment, your site will be available at:
- Frontend: `https://your-site-name.netlify.app`
- Dashboard: `https://your-site-name.netlify.app/dashboard`

### 5.2 Test Functionality
1. **Frontend**: Browse products, categories, etc.
2. **Dashboard Login**: 
   - Go to `/dashboard/login`
   - Email: `mk.rabbani.cse@gmail.com`
   - Password: (You'll need to create this user in Firebase Auth)
3. **API Endpoints**: Test that data loads correctly

## Step 6: Create Admin User (Important!)

### 6.1 Create User via Firebase Console
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: `mk.rabbani.cse@gmail.com`
4. Password: Set a secure password
5. Click "Add user"

### 6.2 Alternative: Create via Code
You can also create the admin user by visiting your deployed site and using the registration endpoint.

## Step 7: Production Checklist

### 7.1 Security Settings
- [ ] Update Firestore security rules
- [ ] Update Storage security rules
- [ ] Remove test mode from database

### 7.2 Custom Domain (Optional)
1. In Netlify, go to "Domain settings"
2. Add your custom domain
3. Update DNS records as instructed

### 7.3 Monitoring
- [ ] Set up Netlify Analytics
- [ ] Monitor Firebase usage in console
- [ ] Check function logs in Netlify

## Troubleshooting

### Common Issues:
1. **Build fails**: Check Node version and environment variables
2. **API not working**: Verify Netlify environment variables
3. **Dashboard login fails**: Check Firebase Auth configuration
4. **Database errors**: Ensure Firestore is enabled and rules allow access

### Debug Commands:
```bash
# Check Netlify functions
netlify functions:list

# Check build logs
netlify logs

# Local testing with production env
npm run build && npm run start
```

## 🎉 You're Live!

Your e-commerce site is now live on Netlify with Firebase backend!
- **Frontend**: Fully functional product browsing
- **Dashboard**: Admin management system
- **API**: Serverless functions handling all operations
- **Database**: Firebase Firestore for data storage
- **Auth**: Firebase Authentication for admin access

## Next Steps:
1. Add your products through the dashboard
2. Customize the design and branding
3. Set up payment integration
4. Configure email notifications
5. Add analytics and monitoring
