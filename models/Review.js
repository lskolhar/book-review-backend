const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [1000, 'Review text cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Prevents duplicate reviews from same user for same book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
