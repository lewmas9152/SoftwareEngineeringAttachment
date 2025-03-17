// modules/crud.ts
import { fetchBooks, addBook, updateBook } from '../services/bookService';
import { displayBooks, updateStats } from './ui';
import { showNotification } from '../utils/utils';
import { setAllBooks } from './modals';

export function setupCrudEventListeners(): void {
  setupAddBookForm();
  setupEditBookForm();
}

function setupAddBookForm(): void {
  const addBookForm = document.getElementById('add-book-form') as HTMLFormElement;
  const addModalOverlay = document.getElementById('add-modal-overlay');
  
  if (addBookForm) {
    addBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(addBookForm);
      const bookData: Record<string, string | number> = {};

      formData.forEach((value, key) => {
        bookData[key] = value as string;
      });

      // Add price field (random between $9.99 and $29.99)
      const price = (Math.random() * 20 + 9.99).toFixed(2);
      bookData['price'] = price;
      bookData['created_by'] = 1;

      // Convert numeric fields to numbers
      if (bookData['year']) bookData['year'] = parseInt(bookData['year'] as string);
      if (bookData['pages']) bookData['pages'] = parseInt(bookData['pages'] as string);

      try {
        await addBook(bookData);

        // Close modal
        if (addModalOverlay) {
          addModalOverlay.classList.remove('active');
        }

        // Refresh book list
        const { books, stats } = await fetchBooks();
        setAllBooks(books);
        displayBooks(books, books);
        updateStats(stats);
      } catch (error) {
        console.error("Error in add book submit handler:", error);
      }
    });
  }
}

function setupEditBookForm(): void {
  const editBookForm = document.getElementById('edit-book-form') as HTMLFormElement;
  const editModalOverlay = document.getElementById('edit-modal-overlay');
  
  if (editBookForm) {
    editBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get the book ID from the data attribute we set on the form
      const bookId = editBookForm.getAttribute('data-book-id');

      // Debug log to check the ID before submission
      console.log("Submitting edit form for book ID:", bookId);

      // Add validation for bookId
      if (!bookId) {
        console.error("Book ID is missing or undefined");
        showNotification('Cannot update book: Book ID is missing');
        return; // Exit early if no bookId
      }

      const formData = new FormData(editBookForm);
      const bookData: Record<string, string> = {};

      formData.forEach((value, key) => {
        // Make sure we're not including any ID fields in the data
        if (key !== 'id' && key !== 'book_id' && key !== 'edit-book-id') {
          bookData[key] = value as string;
        }
      });

      try {
        await updateBook(bookId, bookData);

        // Close modal
        if (editModalOverlay) {
          editModalOverlay.classList.remove('active');
        }

        // Refresh book list
        const { books, stats } = await fetchBooks();
        setAllBooks(books);
        displayBooks(books, books);
        updateStats(stats);
      } catch (error) {
        console.error("Error in edit book submit handler:", error);
      }
    });
  }
}