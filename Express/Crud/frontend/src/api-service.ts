// api-service.ts - Handles all API interactions

import { Book, BookStats } from './types';

export async function fetchBooks(params: Record<string, string> = {}): Promise<{ books: Book[], stats: BookStats }> {
  try {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }

    const queryParams = new URLSearchParams(params).toString();
    const url = `http://localhost:5500/api/books${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }

    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
    return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
  }
}

export async function addBook(bookData: Record<string, string>): Promise<boolean> {
  try {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }
    
    const response = await fetch('http://localhost:5500/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    
    return true;
  } catch (error) {
    console.error("Error adding book:", error);
    return false;
  } finally {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}

export async function updateBook(bookId: string, bookData: Record<string, string>): Promise<boolean> {
  try {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }
    
    const response = await fetch(`http://localhost:5500/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return true;
  } catch (error) {
    console.error("Error updating book:", error);
    return false;
  } finally {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}

export async function deleteBook(bookId: string): Promise<boolean> {
  try {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }
    
    const response = await fetch(`http://localhost:5500/api/books/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  } finally {
    const loadingContainer = document.getElementById("loading-container");
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}