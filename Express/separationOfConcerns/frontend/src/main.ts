// index.ts - Main application entry point

import { Book, BookStats } from './types';
import { fetchBooks, addBook, updateBook, deleteBook } from './api-service';
import { displayBooks, showBookModal, updateStats } from './book-display';
import { CartManager, initCartModal } from './cart-module';
import { showNotification } from './ui-utilities';

class BookStore {
  private books: Book[] = [];
  private stats: BookStats = { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 };
  private cartManager: CartManager;
  private filters: Record<string, string> = {};
  private sortOption: string = 'title-asc';

  constructor() {
    this.cartManager = new CartManager();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Initialize cart modal
    initCartModal();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial books
    await this.loadBooks();
    
    // Setup add book modal events
    this.setupAddBookModal();
    
    // Setup edit book modal events
    this.setupEditBookModal();
    
    // Setup delete book modal events
    this.setupDeleteBookModal();
  }

  private async loadBooks(): Promise<void> {
    try {
      const data = await fetchBooks(this.filters);
      this.books = data.books;
      this.stats = data.stats;
      
      const booksContainer = document.getElementById("books-container");
      displayBooks(
        this.books,
        booksContainer,
        (book: Book) => this.openEditModal(book),
        (bookId: string) => this.openDeleteModal(bookId),
        (bookId: string, books: Book[]) => this.cartManager.addToCart(bookId, books)
      );
      
      updateStats(this.stats);
    } catch (error) {
      console.error("Error loading books:", error);
      showNotification("Failed to load books. Please try again later.");
    }
  }

  private setupEventListeners(): void {
    // Search functionality
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        this.filters.search = searchInput.value;
        this.loadBooks();
      });
    }
    
    // Genre filter
    const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
    if (genreFilter) {
      genreFilter.addEventListener("change", () => {
        if (genreFilter.value === "all") {
          delete this.filters.genre;
        } else {
          this.filters.genre = genreFilter.value;
        }
        this.loadBooks();
      });
    }
    
    // Year filter
    const yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
    if (yearFilter) {
      yearFilter.addEventListener("change", () => {
        if (yearFilter.value === "all") {
          delete this.filters.year;
        } else {
          this.filters.year = yearFilter.value;
        }
        this.loadBooks();
      });
    }
    
    // Price range filter
    const minPrice = document.getElementById("min-price") as HTMLInputElement;
    const maxPrice = document.getElementById("max-price") as HTMLInputElement;
    
    if (minPrice && maxPrice) {
      const applyPriceFilter = () => {
        const min = minPrice.value;
        const max = maxPrice.value;
        
        if (min) this.filters.minPrice = min;
        else delete this.filters.minPrice;
        
        if (max) this.filters.maxPrice = max;
        else delete this.filters.maxPrice;
        
        this.loadBooks();
      };
      
      minPrice.addEventListener("change", applyPriceFilter);
      maxPrice.addEventListener("change", applyPriceFilter);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        this.sortOption = sortSelect.value;
        this.filters.sort = this.sortOption;
        this.loadBooks();
      });
    }
    
    // Reset filters button
    const resetFilters = document.getElementById("reset-filters");
    if (resetFilters) {
      resetFilters.addEventListener("click", () => {
        this.resetAllFilters();
      });
    }
    
    // Add book button
    const addBookBtn = document.getElementById("add-book-btn");
    if (addBookBtn) {
      addBookBtn.addEventListener("click", () => {
        this.openAddModal();
      });
    }
  }

  private resetAllFilters(): void {
    // Reset search input
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
    
    // Reset genre filter
    const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
    if (genreFilter) {
      genreFilter.value = "all";
    }
    
    // Reset year filter
    const yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
    if (yearFilter) {
      yearFilter.value = "all";
    }
    
    // Reset price range
    const minPrice = document.getElementById("min-price") as HTMLInputElement;
    const maxPrice = document.getElementById("max-price") as HTMLInputElement;
    if (minPrice && maxPrice) {
      minPrice.value = "";
      maxPrice.value = "";
    }
    
    // Reset sort option
    const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.value = "title-asc";
    }
    
    // Clear all filters
    this.filters = {};
    this.sortOption = "title-asc";
    
    // Load books with reset filters
    this.loadBooks();
  }

  private setupAddBookModal(): void {
    const addModal = document.getElementById("add-book-modal");
    const addModalOverlay = document.getElementById("add-modal-overlay");
    const closeAddModal = document.getElementById("close-add-modal");
    const addBookForm = document.getElementById("add-book-form") as HTMLFormElement;
    
    if (addModal && addModalOverlay && closeAddModal && addBookForm) {
      // Close modal function
      const closeModal = () => {
        addModal.classList.remove("active");
        addModalOverlay.classList.remove("active");
        addBookForm.reset();
      };
      
      // Close button event
      closeAddModal.addEventListener("click", closeModal);
      
      // Click outside to close
      addModalOverlay.addEventListener("click", (e) => {
        if (e.target === addModalOverlay) {
          closeModal();
        }
      });
      
      // Escape key to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && addModal.classList.contains("active")) {
          closeModal();
        }
      });
      
      // Form submission
      addBookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addBookForm);
        const bookData: Record<string, string> = {};
        
        formData.forEach((value, key) => {
          bookData[key] = value.toString();
        });
        
        const success = await addBook(bookData);
        
        if (success) {
          closeModal();
          await this.loadBooks();
          showNotification("Book added successfully!");
        } else {
          showNotification("Failed to add book. Please try again.");
        }
      });
    }
  }

  private openAddModal(): void {
    const addModal = document.getElementById("add-book-modal");
    const addModalOverlay = document.getElementById("add-modal-overlay");
    
    if (addModal && addModalOverlay) {
      addModal.classList.add("active");
      addModalOverlay.classList.add("active");
    }
  }

  private setupEditBookModal(): void {
    const editModal = document.getElementById("edit-book-modal");
    const editModalOverlay = document.getElementById("edit-modal-overlay");
    const closeEditModal = document.getElementById("close-edit-modal");
    const editBookForm = document.getElementById("edit-book-form") as HTMLFormElement;
    
    if (editModal && editModalOverlay && closeEditModal && editBookForm) {
      // Close modal function
      const closeModal = () => {
        editModal.classList.remove("active");
        editModalOverlay.classList.remove("active");
      };
      
      // Close button event
      closeEditModal.addEventListener("click", closeModal);
      
      // Click outside to close
      editModalOverlay.addEventListener("click", (e) => {
        if (e.target === editModalOverlay) {
          closeModal();
        }
      });
      
      // Escape key to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && editModal.classList.contains("active")) {
          closeModal();
        }
      });
      
      // Form submission
      editBookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(editBookForm);
        const bookData: Record<string, string> = {};
        const bookId = formData.get("id")?.toString() || "";
        
        formData.forEach((value, key) => {
          if (key !== "id") {
            bookData[key] = value.toString();
          }
        });
        
        const success = await updateBook(bookId, bookData);
        
        if (success) {
          closeModal();
          await this.loadBooks();
          showNotification("Book updated successfully!");
        } else {
          showNotification("Failed to update book. Please try again.");
        }
      });
    }
  }

  private openEditModal(book: Book): void {
    const editModal = document.getElementById("edit-book-modal");
    const editModalOverlay = document.getElementById("edit-modal-overlay");
    const editBookForm = document.getElementById("edit-book-form") as HTMLFormElement;
    
    if (editModal && editModalOverlay && editBookForm) {
      // Fill the form with book data
      const idInput = editBookForm.querySelector("[name='id']") as HTMLInputElement;
      const titleInput = editBookForm.querySelector("[name='title']") as HTMLInputElement;
      const authorInput = editBookForm.querySelector("[name='author']") as HTMLInputElement;
      const descriptionInput = editBookForm.querySelector("[name='description']") as HTMLTextAreaElement;
      const genreInput = editBookForm.querySelector("[name='genre']") as HTMLInputElement;
      const yearInput = editBookForm.querySelector("[name='year']") as HTMLInputElement;
      const pagesInput = editBookForm.querySelector("[name='pages']") as HTMLInputElement;
      const priceInput = editBookForm.querySelector("[name='price']") as HTMLInputElement;
      const imageInput = editBookForm.querySelector("[name='image']") as HTMLInputElement;
      const publisherInput = editBookForm.querySelector("[name='publisher']") as HTMLInputElement;
      
      if (idInput) idInput.value = book.id;
      if (titleInput) titleInput.value = book.title;
      if (authorInput) authorInput.value = book.author;
      if (descriptionInput) descriptionInput.value = book.description;
      if (genreInput) genreInput.value = book.genre;
      if (yearInput) yearInput.value = book.year;
      if (pagesInput) pagesInput.value = book.pages;
      if (priceInput) priceInput.value = book.price.toString();
      if (imageInput) imageInput.value = book.image;
      if (publisherInput) publisherInput.value = book.publisher;
      
      // Show the modal
      editModal.classList.add("active");
      editModalOverlay.classList.add("active");
    }
  }

  private setupDeleteBookModal(): void {
    const deleteModal = document.getElementById("delete-book-modal");
    const deleteModalOverlay = document.getElementById("delete-modal-overlay");
    const closeDeleteModal = document.getElementById("close-delete-modal");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    
    if (deleteModal && deleteModalOverlay && closeDeleteModal && confirmDeleteBtn && cancelDeleteBtn) {
      // Close modal function
      const closeModal = () => {
        deleteModal.classList.remove("active");
        deleteModalOverlay.classList.remove("active");
        // Clear the book ID
        deleteModal.setAttribute("data-book-id", "");
      };
      
      // Close button event
      closeDeleteModal.addEventListener("click", closeModal);
      
      // Cancel button event
      cancelDeleteBtn.addEventListener("click", closeModal);
      
      // Click outside to close
      deleteModalOverlay.addEventListener("click", (e) => {
        if (e.target === deleteModalOverlay) {
          closeModal();
        }
      });
      
      // Escape key to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && deleteModal.classList.contains("active")) {
          closeModal();
        }
      });
      
      // Confirm delete event
      confirmDeleteBtn.addEventListener("click", async () => {
        const bookId = deleteModal.getAttribute("data-book-id");
        
        if (bookId) {
          const success = await deleteBook(bookId);
          
          if (success) {
            closeModal();
            await this.loadBooks();
            showNotification("Book deleted successfully!");
          } else {
            showNotification("Failed to delete book. Please try again.");
          }
        }
      });
    }
  }

  private openDeleteModal(bookId: string): void {
    const deleteModal = document.getElementById("delete-book-modal");
    const deleteModalOverlay = document.getElementById("delete-modal-overlay");
    
    if (deleteModal && deleteModalOverlay) {
      // Store the book ID for deletion
      deleteModal.setAttribute("data-book-id", bookId);
      
      // Find the book title to display in confirmation message
      const book = this.books.find(b => b.id === bookId);
      const bookTitleElement = deleteModal.querySelector(".book-title");
      
      if (bookTitleElement && book) {
        bookTitleElement.textContent = book.title;
      }
      
      // Show the modal
      deleteModal.classList.add("active");
      deleteModalOverlay.classList.add("active");
    }
  }
}

// Initialize the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new BookStore();
});

// Export the types for other modules
export { Book, BookStats, CartItem } from './types';