// services/bookService.ts
import { Book, BookStats } from '../types/types';
import { showNotification } from '../utils/utils';

const API_URL = 'http://localhost:5500/api/books';

export async function fetchBooks(params: Record<string, string> = {}): Promise<{ books: Book[], stats: BookStats }> {
    const loadingContainer = document.getElementById("loading-container");
    
    try {
      if (loadingContainer) {
        loadingContainer.style.display = "flex";
      }
  
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_URL}${queryParams ? `?${queryParams}` : ''}`;
  
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched books raw data:", data);
  
      // Make sure we're returning the expected structure
      let formattedResponse: { books: Book[], stats: BookStats };
      
      if (Array.isArray(data)) {
        // If the API returns an array directly, transform it to the expected format
        formattedResponse = {
          books: data,
          stats: { totalBooks: data.length, avgPages: 0, oldestBook: null, uniqueGenres: 0 }
        };
      } else if (data && typeof data === 'object') {
        // If the API returns an object, make sure it has the expected properties
        formattedResponse = {
          books: Array.isArray(data.books) ? data.books : [],
          stats: data.stats || { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 }
        };
      } else {
        // Fallback for unexpected responses
        formattedResponse = { 
          books: [], 
          stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } 
        };
      }
  
      console.log("Formatted response:", formattedResponse);
  
      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }
  
      return formattedResponse;
    } catch (error) {
      console.error("Error fetching books:", error);
      if (loadingContainer) {
        loadingContainer.style.display = "none";
      }
      return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
    }
  }

export async function addBook(bookData: Record<string, string | number>): Promise<Book> {
  const loadingContainer = document.getElementById("loading-container");
  
  try {
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }

    console.log("Sending book data to server:", bookData);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    const responseData = await response.json();
    console.log("Server response for book creation:", responseData);

    if (!response.ok) {
      throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
    }

    showNotification('Book added successfully!');
    return responseData;
  } catch (error) {
    console.error("Error adding book:", error);
    showNotification('Failed to add book. Please try again.');
    throw error;
  } finally {
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}

export async function updateBook(bookId: string, bookData: Record<string, string>): Promise<Book> {
  const loadingContainer = document.getElementById("loading-container");
  
  try {
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }

    const response = await fetch(`${API_URL}/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    const responseData = await response.json();
    console.log("Server response for book update:", responseData);

    if (!response.ok) {
      throw new Error(`Failed to update book: ${response.status} ${response.statusText}`);
    }

    showNotification('Book updated successfully!');
    return responseData;
  } catch (error) {
    console.error("Error updating book:", error);
    showNotification('Failed to update book. Please try again.');
    throw error;
  } finally {
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}

export async function deleteBook(bookId: string): Promise<void> {
  const loadingContainer = document.getElementById("loading-container");
  
  try {
    if (loadingContainer) {
      loadingContainer.style.display = "flex";
    }

    const response = await fetch(`${API_URL}/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Try to get response data if available (might be empty for DELETE)
    const responseData = await response.json().catch(() => null);
    console.log("Server response for book deletion:", response.status, responseData);

    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
    }

    showNotification('Book deleted successfully!');
  } catch (error) {
    console.error("Error deleting book:", error);
    showNotification('Failed to delete book. Please try again.');
    throw error;
  } finally {
    if (loadingContainer) {
      loadingContainer.style.display = "none";
    }
  }
}