// crud-module.ts - Handles create, read, update, delete operations

import { Book } from './types';
import { addBook, updateBook, deleteBook } from './api-service';
import { showNotification } from './ui-utilities';

export class CrudManager {
  private addModalOverlay: HTMLElement | null;
  private editModalOverlay: HTMLElement | null;
  private deleteModalOverlay: HTMLElement | null;
  private addBookForm: HTMLFormElement | null;
  private editBookForm: HTMLFormElement | null;
  private allBooks: Book[] = [];
  private currentBookIdToDelete: string | null = null;
  private refreshBooksCallback: () => void;
  private removeFromCartCallback: (id: string) => void;

  constructor(books: Book[], refreshBooksCallback: () => void, removeFromCartCallback: (id: string) => void) {
    this.allBooks = books;
    this.refreshBooksCallback = refreshBooksCallback;
    this.removeFromCartCallback = removeFromCartCallback;

    // Initialize all modal elements
    this.addModalOverlay = document.getElementById("add-modal-overlay");
    this.editModalOverlay = document.getElementById("edit-modal-overlay");
    this.deleteModalOverlay = document.getElementById("delete-modal-overlay");
    this.addBookForm = document.getElementById("add-book-form") as HTMLFormElement;
    this.editBookForm = document.getElementById("edit-book-form") as HTMLFormElement;

    this.initAddBookButton();
    this.initModalEvents();
    this.initFormEvents();
  }

  public updateBooksList(books: Book[]): void {
    this.allBooks = books;
  }

  public openAddModal(): void {
    if (this.addModalOverlay) {
      this.addModalOverlay.classList.add('active');
      
      // Reset the form
      if (this.addBookForm) {
        this.addBookForm.reset();
      }
    }
  }

  public openEditModal(book: Book): void {
    if (this.editModalOverlay) {
      this.editModalOverlay.classList.add('active');
      
      // Populate form fields with book data
      this.populateEditForm(book);
    }
  }

  public openDeleteModal(bookId: string): void {
    if (this.deleteModalOverlay) {
      this.deleteModalOverlay.classList.add('active');
      this.currentBookIdToDelete = bookId;
    }
  }

  private initAddBookButton(): void {
    const addBookBtn = document.getElementById("add-book-btn");
    if (addBookBtn) {
      addBookBtn.addEventListener('click', () => this.openAddModal());
    }
  }

  private populateEditForm(book: Book): void {
    const editBookId = document.getElementById('edit-book-id') as HTMLInputElement;
    const editTitle = document.getElementById('edit-title') as HTMLInputElement;
    const editAuthor = document.getElementById('edit-author') as HTMLInputElement;
    const editYear = document.getElementById('edit-year') as HTMLInputElement;
    const editPages = document.getElementById('edit-pages') as HTMLInputElement;
    const editGenre = document.getElementById('edit-genre') as HTMLSelectElement;
    const editDescription = document.getElementById('edit-description') as HTMLTextAreaElement;
    const editPublisher = document.getElementById('edit-publisher') as HTMLInputElement;
    const editImage = document.getElementById('edit-image') as HTMLInputElement;
    const editPrice = document.getElementById('edit-price') as HTMLInputElement;
    
    if (editBookId) editBookId.value = book.id;
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

  private initModalEvents(): void {
    // Add book modal events
    const closeAddModal = document.getElementById("close-add-modal");
    if (closeAddModal && this.addModalOverlay) {
      closeAddModal.addEventListener('click', () => {
        this.addModalOverlay!.classList.remove('active');
      });
      
      this.addModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.addModalOverlay) {
          this.addModalOverlay!.classList.remove('active');
        }
      });
    }

    // Edit book modal events
    const closeEditModal = document.getElementById("close-edit-modal");
    if (closeEditModal && this.editModalOverlay) {
      closeEditModal.addEventListener('click', () => {
        this.editModalOverlay!.classList.remove('active');
      });
      
      this.editModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.editModalOverlay) {
          this.editModalOverlay!.classList.remove('active');
        }
      });
    }

    // Delete confirmation modal events
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    
    if (cancelDeleteBtn && this.deleteModalOverlay) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.deleteModalOverlay!.classList.remove('active');
        this.currentBookIdToDelete = null;
      });
    }

    if (this.deleteModalOverlay) {
      this.deleteModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.deleteModalOverlay) {
          this.deleteModalOverlay!.classList.remove('active');
          this.currentBookIdToDelete = null;
        }
      });
    }

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.handleDeleteConfirmation());
    }

    // Global ESC key handler for all modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  private closeAllModals(): void {
    if (this.addModalOverlay && this.addModalOverlay.classList.contains('active')) {
      this.addModalOverlay.classList.remove('active');
    }
    
    if (this.editModalOverlay && this.editModalOverlay.classList.contains('active')) {
      this.editModalOverlay.classList.remove('active');
    }
    
    if (this.deleteModalOverlay && this.deleteModalOverlay.classList.contains('active')) {
      this.deleteModalOverlay.classList.remove('active');
      this.currentBookIdToDelete = null;
    }
  }

  private async handleDeleteConfirmation(): Promise<void> {
    if (!this.currentBookIdToDelete) return;
    
    const success = await deleteBook(this.currentBookIdToDelete);
    
    // Close modal
    if (this.deleteModalOverlay) {
      this.deleteModalOverlay.classList.remove('active');
    }
    
    if (success) {
      // Remove from cart if present
      this.removeFromCartCallback(this.currentBookIdToDelete);
      
      // Refresh book list
      this.refreshBooksCallback();
      
      showNotification('Book deleted successfully!');
    } else {
      showNotification('Failed to delete book. Please try again.');
    }
    
    this.currentBookIdToDelete = null;
  }

  private initFormEvents(): void {
    // Add book form submission
    if (this.addBookForm) {
      this.addBookForm.addEventListener('submit', (e) => this.handleAddBookSubmit(e));
    }

    // Edit book form submission
    if (this.editBookForm) {
      this.editBookForm.addEventListener('submit', (e) => this.handleEditBookSubmit(e));
    }
  }

  private async handleAddBookSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    if (!this.addBookForm) return;
    
    const formData = new FormData(this.addBookForm);
    const bookData: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      bookData[key] = value as string;
    });
    
    // Add price field (random between $9.99 and $29.99)
    const price = (Math.random() * 20 + 9.99).toFixed(2);
    bookData['price'] = price;
    
    const success = await addBook(bookData);
    
    if (success) {
      // Close modal and refresh books
      if (this.addModalOverlay) {
        this.addModalOverlay.classList.remove('active');
      }
      
      // Refresh book list
      this.refreshBooksCallback();
      
      showNotification('Book added successfully!');
    } else {
      showNotification('Failed to add book. Please try again.');
    }
  }

  private async handleEditBookSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    if (!this.editBookForm) return;
    
    const formData = new FormData(this.editBookForm);
    const bookData: Record<string, string> = {};
    const bookId = (document.getElementById('edit-book-id') as HTMLInputElement).value;
    
    formData.forEach((value, key) => {
      if (key !== 'id') {
        bookData[key] = value as string;
      }
    });

    if (!bookData.price || bookData.price === 'undefined') {
      // Get the current price from the book being edited
      const book = this.allBooks.find(b => b.id === bookId);
      if (book) {
        bookData.price = book.price.toString();
      } else {
        // Fallback to a default price
        bookData.price = "9.99";
      }
    }
    
    const success = await updateBook(bookId, bookData);
    
    if (success) {
      // Close modal and refresh books
      if (this.editModalOverlay) {
        this.editModalOverlay.classList.remove('active');
      }
      
      // Refresh book list
      this.refreshBooksCallback();
      
      showNotification('Book updated successfully!');
    } else {
      showNotification('Failed to update book. Please try again.');
    }
  }
}