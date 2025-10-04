const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { getReviews, addReview, updateReview, deleteReview, getUserReviews } = require('../controllers/reviewController');

const router = express.Router();

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ min: 10 })
    .withMessage('Review text must be at least 10 characters')
    .isLength({ max: 1000 })
    .withMessage('Review text cannot exceed 1000 characters')
];

// @route   GET /api/reviews/book/:bookId
// @desc    Get reviews for a specific book
// @access  Public
router.get('/book/:bookId', getReviews);

// @route   GET /api/reviews/user
// @desc    Get reviews by current user
// @access  Private
router.get('/user', auth, getUserReviews);

// @route   POST /api/reviews/book/:bookId
// @desc    Add a review for a book
// @access  Private
router.post('/book/:bookId', auth, reviewValidation, addReview);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (only author)
router.put('/:id', auth, reviewValidation, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (only author)
router.delete('/:id', auth, deleteReview);

module.exports = router;
