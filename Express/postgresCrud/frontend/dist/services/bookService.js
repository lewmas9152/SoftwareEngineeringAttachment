var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BookService {
    constructor(baseUrl = 'http://localhost:4000/api/books', loadingContainerId = 'loading-container') {
        this.baseUrl = baseUrl;
        this.loadingContainer = document.getElementById(loadingContainerId);
    }
    fetchBooks() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            try {
                if (this.loadingContainer) {
                    this.loadingContainer.style.display = "flex";
                }
                const queryParams = new URLSearchParams(params).toString();
                const url = `${this.baseUrl}${queryParams ? `?${queryParams}` : ''}`;
                const response = yield fetch(url);
                const data = yield response.json();
                if (this.loadingContainer) {
                    this.loadingContainer.style.display = "none";
                }
                return data;
            }
            catch (error) {
                console.error("Error fetching books:", error);
                if (this.loadingContainer) {
                    this.loadingContainer.style.display = "none";
                }
                return { books: [], stats: { totalBooks: 0, avgPages: 0, oldestBook: null, uniqueGenres: 0 } };
            }
        });
    }
}
export default new BookService();
//# sourceMappingURL=bookService.js.map