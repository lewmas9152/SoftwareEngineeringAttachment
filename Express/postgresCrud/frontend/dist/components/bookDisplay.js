import cartManager from './cart';
import { BookModalManager } from './modal';
export class BookDisplay {
    constructor(containerSelector = 'books-container') {
        this.booksContainer = document.getElementById(containerSelector);
        this.modalManager = new BookModalManager();
    }
    displayBooks(books) {
        if (!this.booksContainer)
            return;
        this.booksContainer.innerHTML = "";
        if (books.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No books match your filters. Try adjusting your search criteria.';
            this.booksContainer.appendChild(noResults);
            return;
        }
        books.forEach((result) => {
            var _a;
            const bookCard = document.createElement("div");
            bookCard.className = "book-card";
            const bookImage = document.createElement("div");
            bookImage.className = "book-image";
            const image = document.createElement("img");
            image.className = "image";
            image.src = result.image;
            image.alt = result.title;
            const bookCategory = document.createElement("div");
            bookCategory.className = "book-category";
            bookCategory.textContent = result.genre;
            bookImage.appendChild(image);
            bookImage.appendChild(bookCategory);
            const bookInfo = document.createElement("div");
            bookInfo.className = "book-info";
            const bookTitle = document.createElement("h3");
            bookTitle.className = "book-title";
            bookTitle.textContent = result.title;
            const bookAuthor = document.createElement("p");
            bookAuthor.className = "book-author";
            bookAuthor.textContent = result.author;
            const bookMeta = document.createElement("div");
            bookMeta.className = "book-meta";
            const year = document.createElement("span");
            year.id = "year";
            year.textContent = result.year;
            const pages = document.createElement("span");
            pages.id = "pages";
            pages.textContent = `${result.pages} pages`;
            const price = document.createElement("span");
            price.id = "price";
            price.textContent = `$${result.price.toFixed(2)}`;
            price.style.color = "var(--primary)";
            price.style.fontWeight = "bold";
            bookMeta.appendChild(year);
            bookMeta.appendChild(pages);
            bookMeta.appendChild(price);
            const description = document.createElement("p");
            description.className = "book-description";
            description.textContent = result.description;
            const bookPublisher = document.createElement("p");
            bookPublisher.className = "book-publisher";
            bookPublisher.textContent = result.publisher;
            const bookId = document.createElement("p");
            bookId.className = 'id-book';
            bookId.textContent = result.id;
            bookId.style.display = 'none';
            const buyBook = document.createElement("button");
            buyBook.className = "buy-book";
            buyBook.textContent = `Buy Now • $${result.price.toFixed(2)}`;
            buyBook.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = e.target;
                let bookId = null;
                if (target && target.parentNode) {
                    const idElement = target.parentNode.querySelector('.id-book');
                    bookId = idElement ? idElement.textContent : null;
                }
                if (bookId) {
                    cartManager.addToCart(bookId, books);
                }
            });
            bookInfo.appendChild(bookTitle);
            bookInfo.appendChild(bookAuthor);
            bookInfo.appendChild(bookMeta);
            bookInfo.appendChild(description);
            bookInfo.appendChild(bookPublisher);
            bookInfo.appendChild(bookId);
            bookInfo.appendChild(buyBook);
            bookCard.appendChild(bookImage);
            bookCard.appendChild(bookInfo);
            bookCard.addEventListener('click', () => {
                this.modalManager.showBookModal(result);
            });
            (_a = this.booksContainer) === null || _a === void 0 ? void 0 : _a.appendChild(bookCard);
        });
    }
    updateStats(stats) {
        const totalBooksElement = document.getElementById("total-books");
        if (totalBooksElement) {
            totalBooksElement.textContent = stats.totalBooks.toString();
        }
        const avgPagesElement = document.getElementById("avg-pages");
        if (avgPagesElement) {
            avgPagesElement.textContent = stats.avgPages.toString();
        }
        const oldestBookElement = document.getElementById("oldest-book");
        if (oldestBookElement && stats.oldestBook !== null) {
            oldestBookElement.textContent =
                stats.oldestBook < 0 ? `${Math.abs(stats.oldestBook)} BCE` : stats.oldestBook.toString();
        }
        const genresCountElement = document.getElementById("genres-count");
        if (genresCountElement) {
            genresCountElement.textContent = stats.uniqueGenres.toString();
        }
    }
}
export default new BookDisplay();
//# sourceMappingURL=bookDisplay.js.map