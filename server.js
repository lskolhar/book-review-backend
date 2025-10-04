const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables with defaults
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_for_book_review_platform_12345";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ls_kolhar:MyPassword123@cluster0.bytuctd.mongodb.net/book-review-platform?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Export the app for Vercel
module.exports = app;

// Only start server if not in lambda environment
if (process.env.NODE_ENV !== 'production' || process.env.IS_LOCAL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
