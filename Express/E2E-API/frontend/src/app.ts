// app.ts
import { Book } from './types/types';
import { fetchBooks } from './services/bookService';
import { displayBooks, updateStats } from './modules/ui';
import { setupCartModal, setupAddBookModal, setupEditBookModal, setupDeleteModal, setupKeyboardEvents, setAllBooks } from './modules/modals';
import { setupCrudEventListeners } from './modules/crud';
import { setupCheckout } from './modules/cart';

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize
  let allBooks: Book[] = [];
  
  // Setup event listeners for filter and search
  setupFilterAndSearch();
  
  // Setup modals
  setupCartModal();
  setupAddBookModal();
  setupEditBookModal();
  setupDeleteModal();
  setupKeyboardEvents();
  
  // Setup CRUD operations
  setupCrudEventListeners();
  
  // Setup cart checkout
  setupCheckout();
  
  // Initial data fetch
  const { books, stats } = await fetchBooks();
  allBooks = books;
  setAllBooks(books);
  displayBooks(books, books);
  updateStats(stats);
  
  function setupFilterAndSearch() {
    const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
    const yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
    const sortBy = document.getElementById("sort-by") as HTMLSelectElement;
    const applyFiltersBtn = document.getElementById("apply-filters");
    const searchInput = document.querySelector(".search-bar input") as HTMLInputElement;
    
    function filterAndSortBooks() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const genre = genreFilter ? genreFilter.value : '';
      const yearRange = yearFilter ? yearFilter.value : '';
      const sortOption = sortBy ? sortBy.value : '';

      const params: Record<string, string> = {};

      if (searchTerm) params['search'] = searchTerm;
      if (genre) params['genre'] = genre;
      if (yearRange) params['yearRange'] = yearRange;
      if (sortOption) params['sortBy'] = sortOption;

      fetchBooks(params).then(({ books, stats }) => {
        allBooks = books;
        setAllBooks(books);
        displayBooks(books, books);
        updateStats(stats);
      });
    }

    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", filterAndSortBooks);
    }

    if (searchInput) {
      searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
          filterAndSortBooks();
        }
      });
    }
  }
});