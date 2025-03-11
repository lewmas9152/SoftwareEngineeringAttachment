import { FilterParams } from '../models/types';
import bookService from '../services/bookService';
import bookDisplay from './bookDisplay';

export class FiltersManager {
  private genreFilter: HTMLSelectElement | null;
  private yearFilter: HTMLSelectElement | null;
  private sortBy: HTMLSelectElement | null;
  private applyFiltersBtn: HTMLElement | null;
  private searchInput: HTMLInputElement | null;

  constructor() {
    this.genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
    this.yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
    this.sortBy = document.getElementById("sort-by") as HTMLSelectElement;
    this.applyFiltersBtn = document.getElementById("apply-filters");
    this.searchInput = document.querySelector(".search-bar input") as HTMLInputElement;

    this.initEventListeners();
  }

  private initEventListeners(): void {
    if (this.applyFiltersBtn) {
      this.applyFiltersBtn.addEventListener("click", () => this.filterAndSortBooks());
    }
    
    if (this.searchInput) {
      this.searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          this.filterAndSortBooks();
        }
      });
    }
  }

  public async filterAndSortBooks(): Promise<void> {
    const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
    const genre = this.genreFilter ? this.genreFilter.value : '';
    const yearRange = this.yearFilter ? this.yearFilter.value : '';
    const sortOption = this.sortBy ? this.sortBy.value : '';

    const params: FilterParams = {};

    if (searchTerm) params['search'] = searchTerm;
    if (genre) params['genre'] = genre;
    if (yearRange) params['yearRange'] = yearRange;
    if (sortOption) params['sortBy'] = sortOption;

    const { books, stats } = await bookService.fetchBooks(params);
    bookDisplay.displayBooks(books);
    bookDisplay.updateStats(stats);
  }
}

export default FiltersManager;