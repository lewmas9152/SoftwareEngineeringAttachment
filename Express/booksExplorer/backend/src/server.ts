import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const _dirname = path.resolve();
const dataFilePath = path.join(_dirname, "src", "db", "data.json");

// Helper functions for file operations
const readBooksData = () => {
  try {
    const bookData = readFileSync(dataFilePath, "utf-8");
    return JSON.parse(bookData);
  } catch (error) {
    console.error("Error reading books data:", error);
    return { Books: [] };
  }
};

const writeBooksData = (data: any) => {
  try {
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing books data:", error);
    return false;
  }
};

// Get all books with filtering
app.get('/api/books', (req: Request, res: Response) => {
  try {
    const data = readBooksData();
    const books = data.Books;
    
    const { 
      search, 
      genre, 
      yearRange, 
      sortBy 
    } = req.query;

    let filteredBooks = [...books];

    if (search) {
      const searchTerm = (search as string).toLowerCase().trim();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase() === (genre as string).toLowerCase()
      );
    }

    if (yearRange) {
      switch(yearRange) {
        case 'pre-1900':
          filteredBooks = filteredBooks.filter(book => parseInt(book.year) < 1900);
          break;
        case '1900-1950':
          filteredBooks = filteredBooks.filter(book => 
            parseInt(book.year) >= 1900 && parseInt(book.year) <= 1950
          );
          break;
        case 'post-1950':
          filteredBooks = filteredBooks.filter(book => parseInt(book.year) > 1950);
          break;
      }
    }

    if (sortBy) {
      switch(sortBy) {
        case 'title-asc':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'year-asc':
          filteredBooks.sort((a, b) => parseInt(a.year) - parseInt(b.year));
          break;
        case 'year-desc':
          filteredBooks.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case 'pages-asc':
          filteredBooks.sort((a, b) => parseInt(a.pages) - parseInt(b.pages));
          break;
        case 'pages-desc':
          filteredBooks.sort((a, b) => parseInt(b.pages) - parseInt(a.pages));
          break;
      }
    }

    const stats = {
      totalBooks: filteredBooks.length,
      avgPages: filteredBooks.length 
        ? Math.round(filteredBooks.reduce((sum, book) => sum + parseInt(book.pages), 0) / filteredBooks.length)
        : 0,
      oldestBook: filteredBooks.length 
        ? Math.min(...filteredBooks.map(book => parseInt(book.year)))
        : null,
      uniqueGenres: new Set(filteredBooks.map(book => book.genre)).size
    };

    res.json({
      books: filteredBooks,
      stats
    });
  } catch (error) {
    console.error("Error filtering books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single book by ID
app.get('/api/books/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = readBooksData();
    const book = data.Books.find((b: any) => b.id === id);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json(book);
  } catch (error) {
    console.error("Error getting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new book
app.post('/api/books', (req: Request, res: Response) => {
  try {
    const { title, author, year, pages, genre, description, imageUrl } = req.body;
    
    // Validate required fields
    if (!title || !author || !year || !pages || !genre) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const data = readBooksData();
    
    const newBook = {
      id: uuidv4(),
      title,
      author,
      year: String(year),
      pages: String(pages),
      genre,
      description: description || "",
      imageUrl: imageUrl || ""
    };
    
    data.Books.push(newBook);
    
    if (writeBooksData(data)) {
      res.status(201).json(newBook);
    } else {
      res.status(500).json({ error: "Failed to save book" });
    }
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a book
app.put('/api/books/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = readBooksData();
    const bookIndex = data.Books.findIndex((b: any) => b.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    // Update book properties
    data.Books[bookIndex] = {
      ...data.Books[bookIndex],
      ...updates,
      id // Ensure ID doesn't change
    };
    
    // Convert year and pages to string if they're provided as numbers
    if (updates.year) data.Books[bookIndex].year = String(updates.year);
    if (updates.pages) data.Books[bookIndex].pages = String(updates.pages);
    
    if (writeBooksData(data)) {
      res.json(data.Books[bookIndex]);
    } else {
      res.status(500).json({ error: "Failed to update book" });
    }
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a book
app.delete('/api/books/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data =   readBooksData();
    const bookIndex = data.Books.findIndex((b: any) => b.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const deletedBook = data.Books[bookIndex];
    data.Books.splice(bookIndex, 1);
    
    if (writeBooksData(data)) {
      res.json({ message: "Book deleted successfully", book: deletedBook });
    } else {
      res.status(500).json({ error: "Failed to delete book" });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Root route handler
app.get('/', (req: Request, res: Response) => {
  const data = readBooksData();
  res.json({ message: "Books API - Use /api/books endpoint to access book data" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;