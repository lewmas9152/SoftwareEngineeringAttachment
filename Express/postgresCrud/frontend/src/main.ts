import bookService from './services/bookService';
import bookDisplay from './components/bookDisplay';
import filtersManager from './components/filters'; // Import but don't need to use directly as it sets up its own event listeners
import './components/cart'; // Import for side effects (it sets up the cart)

// Initialize the application
document.addEventListener("DOMContentLoaded", async function() {
  try {
    // Initial data load
    const filters = new filtersManager();
    const { books, stats } = await bookService.fetchBooks();
    bookDisplay.displayBooks(books);
    bookDisplay.updateStats(stats);
  } catch (error) {
    console.error("Failed to initialize the application:", error);
  }
});