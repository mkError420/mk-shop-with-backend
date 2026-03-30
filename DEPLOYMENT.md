# Netlify + Firebase Deployment Guide

This guide will help you deploy your e-commerce site to Netlify with Firebase backend integration.

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Generate Service Account credentials

2. **Netlify Account**
   - Create account at https://netlify.com
   - Connect your GitHub repository

## Environment Variables Setup

### In Firebase Console:
Get these values from Firebase Project Settings > Service Accounts:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### In Netlify Dashboard:
Set these environment variables in Site Settings > Build & deploy > Environment:

1. **Firebase Public Config:**
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

2. **Firebase Admin Config:**
   - `FIREBASE_ADMIN_TYPE=service_account`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY` (full private key with newlines)
   - `FIREBASE_ADMIN_CLIENT_EMAIL`

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. In Netlify, click "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`
5. Add environment variables (see above)
6. Deploy

### Option 2: Manual Deployment
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=.next`

## Important Notes

### API Routes
- Netlify handles API routes through serverless functions
- All `/api/*` requests are automatically redirected
- No additional configuration needed

### Database
- Uses Firestore as backend database
- Local development uses `data/db.json`
- Production uses Firebase Firestore

### Authentication
- Firebase Auth handles user authentication
- Dashboard login requires valid credentials
- Session management handled by Firebase

### Static Assets
- Images and static files served from Firebase Storage
- Next.js Image optimization works with Firebase URLs
- Product images stored in Firebase Storage bucket

## Troubleshooting

### API Not Working
- Check environment variables in Netlify dashboard
- Verify Firebase project settings
- Check Netlify function logs

### Dashboard Login Issues
- Verify Firebase Auth configuration
- Check user roles in Firestore
- Clear browser cache

### Build Errors
- Ensure Node.js version 18
- Check all environment variables are set
- Verify Firebase private key format

## Production URLs

After deployment:
- Frontend: `https://your-site.netlify.app`
- Dashboard: `https://your-site.netlify.app/dashboard`
- API: `https://your-site.netlify.app/api/*`

## Monitoring

- **Netlify**: Check Functions logs in Netlify dashboard
- **Firebase**: Monitor Firestore usage in Firebase console
- **Performance**: Use Netlify Analytics and Firebase Performance Monitoring
