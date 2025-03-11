import { BooksResponse, FilterParams } from '../models/types';

export class BookService {
  private baseUrl: string;
  private loadingContainer: HTMLElement | null;

  constructor(baseUrl: string = 'http://localhost:4000/api/books', loadingContainerId: string = 'loading-container') {
    this.baseUrl = baseUrl;
    this.loadingContainer = document.getElementById(loadingContainerId);
  }

  async fetchBooks(params: FilterParams = {}): Promise<BooksResponse> {
    try {
      if (this.loadingContainer) {
        this.loadingContainer.style.display = "flex";
      }

      const queryParams = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}${queryParams ? `?${queryParams}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();

      if (this.loadingContainer) {
        this.loadingContainer.style.display = "none";
      }

      return data;
    } catch (error) {
      console.error("Error fetching books:", error);
      if (this.loadingContainer) {
        this.loadingContainer.style.display = "none";
      }
      return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
    }
  }
}

export default new BookService();