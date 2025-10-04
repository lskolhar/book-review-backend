const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');

// Get reviews for a book
const getReviews = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookId } = req.params;
    const { rating, reviewText } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      bookId,
      userId: req.user._id,
      rating: parseInt(rating),
      reviewText
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name');

    res.status(201).json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewId = req.params.id;
    const { rating, reviewText } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = parseInt(rating);
    review.reviewText = reviewText;

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name');

    res.json({
      success: true,
      review: populatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error while updating review' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error while deleting review' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

module.exports = { getReviews, addReview, updateReview, deleteReview, getUserReviews };
