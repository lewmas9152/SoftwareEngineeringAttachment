var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bookService from './services/bookService';
import bookDisplay from './components/bookDisplay';
import filtersManager from './components/filters'; // Import but don't need to use directly as it sets up its own event listeners
import './components/cart'; // Import for side effects (it sets up the cart)
// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initial data load
            const filters = new filtersManager();
            const { books, stats } = yield bookService.fetchBooks();
            bookDisplay.displayBooks(books);
            bookDisplay.updateStats(stats);
        }
        catch (error) {
            console.error("Failed to initialize the application:", error);
        }
    });
});
//# sourceMappingURL=main.js.map