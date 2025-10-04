const { validationResult } = require('express-validator');
const Book = require('../models/Book');

// Get all books with pagination
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    
    const { search, genre, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Genre filter
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);
    
    res.json({
      success: true,
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Calculate average rating
    const reviews = await require('../models/Review').find({ bookId: book._id });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    res.json({
      success: true,
      book,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};

// Add new book
const addBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, description, genre, year } = req.body;
    
    const book = new Book({
      title,
      author,
      description,
      genre,
      year: parseInt(year),
      addedBy: req.user._id
    });

    await book.save();
    
    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name email');
    
    res.status(201).json({
      success: true,
      book: populatedBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error while adding book' });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator of the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this book' });
    }

    const { title, author, description, genre, year } = req.body;
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.year = year ? parseInt(year) : book.year;

    await book.save();
    
    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name email');
    
    res.json({
      success: true,
      book: populatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error while updating book' });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the creator of the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete all reviews for this book
    await require('../models/Review').deleteMany({ bookId: book._id });
    
    await Book.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
