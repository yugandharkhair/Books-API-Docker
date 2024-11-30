const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Book = require('./models/book');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/booksdb';

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Seed data function
async function seedData() {
  try {
    // Check if we already have books
    const count = await Book.countDocuments();
    if (count === 0) {
      // Add initial books only if database is empty
      const initialBooks = [
        {
          title: "The Shadow's Edge",
          author: "Elena Blackwood",
          year: 2020
        },
        {
          title: "Digital Dreams",
          author: "Marcus Chen",
          year: 2019
        }
      ];

      await Book.insertMany(initialBooks);
      console.log('Seed data inserted successfully');
    } else {
      console.log('Database already has books, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Connect to MongoDB and seed data
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return seedData(); // Seed data after successful connection
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes remain the same as before
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Create new book
app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});