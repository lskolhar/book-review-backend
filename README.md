# 📚 Book Review Platform - Backend

A Node.js/Express REST API for the Book Review Platform with JWT authentication, MongoDB database, and comprehensive CRUD operations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Database models
│   ├── User.js
│   ├── Book.js
│   └── Review.js
├── routes/              # API routes
│   ├── auth.js
│   ├── books.js
│   └── reviews.js
├── server.js            # Main server file
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/user` - Get user's reviews
- `POST /api/reviews/book/:bookId` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Health Check
- `GET /api/health` - Server health status

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Protected routes with middleware
- CORS configuration
- Environment variable security

## 📊 Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, minlength: 6),
  timestamps: true
}
```

### Book
```javascript
{
  title: String (required),
  author: String (required),
  description: String (required),
  genre: String (required),
  year: Number (required),
  addedBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

### Review
```javascript
{
  book: ObjectId (ref: 'Book'),
  user: ObjectId (ref: 'User'),
  rating: Number (required, min: 1, max: 5),
  reviewText: String (required),
  timestamps: true
}
```

## 🚀 Deployment (Vercel)

1. **Connect to Vercel**
   - Import project from GitHub
   - Set root directory to `backend`

2. **Environment Variables**
   - `MONGODB_URI`
   - `JWT_SECRET`

3. **Build Settings**
   - Build Command: `npm install`
   - Output Directory: `backend`

## 📝 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (if nodemon installed)
```

## 🔧 Development

### Adding New Routes
1. Create controller in `controllers/`
2. Create routes in `routes/`
3. Add middleware if needed
4. Import routes in `server.js`

### Database Connection
The server automatically connects to MongoDB using the connection string from environment variables.

### Error Handling
All routes include proper error handling with appropriate HTTP status codes and error messages.

---

**Backend API for Book Review Platform**
