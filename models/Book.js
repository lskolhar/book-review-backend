const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than current year + 2']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual field for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId',
  justOne: false
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
