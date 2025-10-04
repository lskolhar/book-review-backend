# Backend Deployment Guide

## Vercel Deployment

### 1. Push to GitHub
```bash
# Create new repository on GitHub called "books-backend"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/books-backend.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `books-backend` repository
5. Set Root Directory to `./` (default)
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`

### 3. Environment Variables
In Vercel dashboard, add:
- `MONGODB_URI`: `mongodb+srv://ls_kolhar:MyPassword123@cluster0.bytuctd.mongodb.net/book-review-platform?retryWrites=true&w=majority&appName=Cluster0`
- `JWT_SECRET`: `your_super_secret_jwt_key_for_book_review_platform_12345`
- `NODE_ENV`: `production`

## Local Testing
```bash
npm install
npm run dev
```

## Getting Backend URL
After deployment, Vercel will give you a URL like:
`https://books-backend-yourname.vercel.app`

Use this URL (with `/api`) as `REACT_APP_API_URL` in frontend deployment.
