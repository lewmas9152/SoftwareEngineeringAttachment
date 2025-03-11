var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bookService from '../services/bookService';
import bookDisplay from './bookDisplay';
export class FiltersManager {
    constructor() {
        this.genreFilter = document.getElementById("genre-filter");
        this.yearFilter = document.getElementById("year-filter");
        this.sortBy = document.getElementById("sort-by");
        this.applyFiltersBtn = document.getElementById("apply-filters");
        this.searchInput = document.querySelector(".search-bar input");
        this.initEventListeners();
    }
    initEventListeners() {
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
    filterAndSortBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase().trim() : '';
            const genre = this.genreFilter ? this.genreFilter.value : '';
            const yearRange = this.yearFilter ? this.yearFilter.value : '';
            const sortOption = this.sortBy ? this.sortBy.value : '';
            const params = {};
            if (searchTerm)
                params['search'] = searchTerm;
            if (genre)
                params['genre'] = genre;
            if (yearRange)
                params['yearRange'] = yearRange;
            if (sortOption)
                params['sortBy'] = sortOption;
            const { books, stats } = yield bookService.fetchBooks(params);
            bookDisplay.displayBooks(books);
            bookDisplay.updateStats(stats);
        });
    }
}
export default FiltersManager;
//# sourceMappingURL=filters.js.map