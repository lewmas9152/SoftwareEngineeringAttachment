// modules/modals.ts
import { Book } from '../types/types';
import { fetchBooks } from '../services/bookService';
import { displayBooks, updateStats } from './ui';
import { removeBookFromCart } from './cart';
import { updateBook, deleteBook } from '../services/bookService';

let currentBookIdToDelete: string | null = null;
let allBooks: Book[] = [];

export function setAllBooks(books: Book[]): void {
    // Check if books is an array before using the spread operator
    if (Array.isArray(books)) {
      allBooks = [...books];
    } else {
      console.error("Received non-array value for books:", books);
      allBooks = []; // Reset to empty array if invalid input
    }
  }

export function setupCartModal(): void {
  const cartButton = document.getElementById('cart-button');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartModal = document.querySelector('.cart-modal');
  const closeCart = document.getElementById('close-cart');

  if (cartButton && cartOverlay && closeCart && cartModal) {
    cartButton.addEventListener('click', () => {
      cartOverlay.classList.add('active');
      cartModal.classList.add('active');
    });

    const closeCartModal = () => {
      cartOverlay.classList.remove('active');
      cartModal.classList.remove('active');
    };

    closeCart.addEventListener('click', closeCartModal);
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        closeCartModal();
      }
    });
  }
}

export function setupAddBookModal(): void {
  const addBookBtn = document.getElementById('add-book-btn');
  const addModalOverlay = document.getElementById('add-modal-overlay');
  const closeAddModal = document.getElementById('close-add-modal');
  const addBookForm = document.getElementById('add-book-form') as HTMLFormElement;

  if (addBookBtn && addModalOverlay) {
    addBookBtn.addEventListener('click', () => {
      openAddModal();
    });
  }

  if (closeAddModal && addModalOverlay) {
    closeAddModal.addEventListener('click', () => {
      addModalOverlay.classList.remove('active');
    });

    addModalOverlay.addEventListener('click', (e) => {
      if (e.target === addModalOverlay) {
        addModalOverlay.classList.remove('active');
      }
    });
  }
}

export function openAddModal(): void {
  const addModalOverlay = document.getElementById('add-modal-overlay');
  const addBookForm = document.getElementById('add-book-form') as HTMLFormElement;
  
  if (addModalOverlay) {
    addModalOverlay.classList.add('active');

    // Reset the form
    if (addBookForm) {
      addBookForm.reset();
    }
  }
}

export function openEditModal(book: Book): void {
  const editModalOverlay = document.getElementById('edit-modal-overlay');
  const editBookForm = document.getElementById('edit-book-form') as HTMLFormElement;
  
  if (editModalOverlay && book) {
    editModalOverlay.classList.add('active');

    // Get the correct ID field (either book_id or id)
    const bookId = book.id || book.book_id;

    if (!bookId) {
      console.error("Book ID is missing for book:", book.title);
      return; // Skip creating buttons if no ID is available
    }

    // Debug log to verify we have a valid book ID
    console.log("Opening edit modal for book:", book.title, "with ID:", bookId);

    // Store the book ID directly in a data attribute on the form itself
    if (editBookForm) {
      editBookForm.setAttribute('data-book-id', bookId);
    }

    const editTitle = document.getElementById('edit-title') as HTMLInputElement;
    const editAuthor = document.getElementById('edit-author') as HTMLInputElement;
    const editYear = document.getElementById('edit-year') as HTMLInputElement;
    const editPages = document.getElementById('edit-pages') as HTMLInputElement;
    const editGenre = document.getElementById('edit-genre') as HTMLSelectElement;
    const editDescription = document.getElementById('edit-description') as HTMLTextAreaElement;
    const editPublisher = document.getElementById('edit-publisher') as HTMLInputElement;
    const editImage = document.getElementById('edit-image') as HTMLInputElement;
    const editPrice = document.getElementById('edit-price') as HTMLInputElement;

    if (editTitle) editTitle.value = book.title;
    if (editAuthor) editAuthor.value = book.author;
    if (editYear) editYear.value = book.year;
    if (editPages) editPages.value = book.pages;
    if (editGenre) editGenre.value = book.genre;
    if (editDescription) editDescription.value = book.description;
    if (editPublisher) editPublisher.value = book.publisher;
    if (editImage) editImage.value = book.image;
    if (editPrice) editPrice.value = book.price.toString();
  }
}

export function setupEditBookModal(): void {
  const editModalOverlay = document.getElementById('edit-modal-overlay');
  const closeEditModal = document.getElementById('close-edit-modal');
  
  if (closeEditModal && editModalOverlay) {
    closeEditModal.addEventListener('click', () => {
      editModalOverlay.classList.remove('active');
    });

    editModalOverlay.addEventListener('click', (e) => {
      if (e.target === editModalOverlay) {
        editModalOverlay.classList.remove('active');
      }
    });
  }
}

export function openDeleteModal(bookId: string): void {
  const deleteModalOverlay = document.getElementById('delete-modal-overlay');
  
  if (deleteModalOverlay) {
    deleteModalOverlay.classList.add('active');
    currentBookIdToDelete = bookId;
    console.log("Delete modal opened for book ID:", bookId);
  }
}

export function setupDeleteModal(): void {
  const deleteModalOverlay = document.getElementById('delete-modal-overlay');
  const cancelDeleteBtn = document.getElementById('cancel-delete');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  
  if (cancelDeleteBtn && deleteModalOverlay) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModalOverlay.classList.remove('active');
      currentBookIdToDelete = null;
    });
  }

  if (deleteModalOverlay) {
    deleteModalOverlay.addEventListener('click', (e) => {
      if (e.target === deleteModalOverlay) {
        deleteModalOverlay.classList.remove('active');
        currentBookIdToDelete = null;
      }
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!currentBookIdToDelete) {
        console.error("No book ID to delete");
        return;
      }

      console.log("Attempting to delete book with ID:", currentBookIdToDelete);

      try {
        await deleteBook(currentBookIdToDelete);

        // Close modal
        if (deleteModalOverlay) {
          deleteModalOverlay.classList.remove('active');
        }

        // Remove from cart if present
        const bookIdToDelete = currentBookIdToDelete; // Store locally before resetting
        removeBookFromCart(bookIdToDelete);

        // Refresh book list
        const { books, stats } = await fetchBooks();
        setAllBooks(books);
        displayBooks(books, books);
        updateStats(stats);
      } finally {
        // Reset the current book ID to delete
        currentBookIdToDelete = null;
      }
    });
  }
}

export function setupKeyboardEvents(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const addModalOverlay = document.getElementById('add-modal-overlay');
      const editModalOverlay = document.getElementById('edit-modal-overlay');
      const deleteModalOverlay = document.getElementById('delete-modal-overlay');
      const cartOverlay = document.getElementById('cart-overlay');

      if (addModalOverlay && addModalOverlay.classList.contains('active')) {
        addModalOverlay.classList.remove('active');
      }
      
      if (editModalOverlay && editModalOverlay.classList.contains('active')) {
        editModalOverlay.classList.remove('active');
      }
      
      if (deleteModalOverlay && deleteModalOverlay.classList.contains('active')) {
        deleteModalOverlay.classList.remove('active');
        currentBookIdToDelete = null;
      }

      if (cartOverlay && cartOverlay.classList.contains('active')) {
        cartOverlay.classList.remove('active');
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
          cartModal.classList.remove('active');
        }
      }
    }
  });
}