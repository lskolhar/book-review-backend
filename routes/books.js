const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { getBooks, getBookById, addBook, updateBook, deleteBook } = require('../controllers/bookController');

const router = express.Router();

const bookValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1 })
    .withMessage('Title cannot be empty'),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 1 })
    .withMessage('Author cannot be empty'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required'),
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() + 2 })
    .withMessage('Please provide a valid year')
];

// @route   GET /api/books
// @desc    Get all books with pagination, search, and filter
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post('/', auth, bookValidation, addBook);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private (only creator)
router.put('/:id', auth, bookValidation, updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private (only creator)
router.delete('/:id', auth, deleteBook);

module.exports = router;
