// modules/ui.ts
import { Book, BookStats } from '../types/types';
import { addToCart } from './cart';
import { openEditModal, openDeleteModal } from './modals';

export function displayBooks(books: Book[], allBooks: Book[]): void {
  const booksContainer = document.getElementById("books-container");
  
  if (!booksContainer) return;
  
  booksContainer.innerHTML = "";

  if (!books) {
    console.error("Books data is undefined or null");
    const errorMessage = document.createElement('div');
    errorMessage.className = 'no-results';
    errorMessage.textContent = 'Unable to load books. Please try again later.';
    booksContainer.appendChild(errorMessage);
    return;
  }

  if (books.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No books match your filters. Try adjusting your search criteria.';
    booksContainer.appendChild(noResults);
    return;
  }

  books.forEach((book) => {
    // Log each book to help debug ID issues
    console.log("Rendering book:", book.title, "ID:", book.id, "book_id:", book.book_id);

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    const bookImage = document.createElement("div");
    bookImage.className = "book-image";

    const image = document.createElement("img");
    image.className = "image";
    image.src = book.image;
    image.alt = book.title;

    const bookCategory = document.createElement("div");
    bookCategory.className = "book-category";
    bookCategory.textContent = book.genre;

    const bookActions = document.createElement("div");
    bookActions.className = "book-actions";

    // IMPORTANT CHANGE: Use the same ID field for all operations (prefer book.id, fallback to book.book_id)
    const bookId = book.id || book.book_id;

    if (!bookId) {
      console.error("Book ID is missing for book:", book.title);
      return; // Skip creating buttons if no ID is available
    }

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit-btn";
    editBtn.setAttribute("data-id", bookId);
    editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(book);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.setAttribute("data-id", bookId);
    deleteBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Log the ID being passed to delete modal
      console.log("Opening delete modal for book:", book.title, "with ID:", bookId);
      openDeleteModal(bookId);
    });

    bookActions.appendChild(editBtn);
    bookActions.appendChild(deleteBtn);

    bookImage.appendChild(image);
    bookImage.appendChild(bookCategory);
    bookImage.appendChild(bookActions);

    const bookInfo = document.createElement("div");
    bookInfo.className = "book-info";

    const bookTitle = document.createElement("h3");
    bookTitle.className = "book-title";
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.className = "book-author";
    bookAuthor.textContent = book.author;

    const bookMeta = document.createElement("div");
    bookMeta.className = "book-meta";

    const year = document.createElement("span");
    year.id = "year";
    year.textContent = book.year;

    const pages = document.createElement("span");
    pages.id = "pages";
    pages.textContent = `${book.pages} pages`;

    const price = document.createElement("span");
    price.id = "price";
    price.textContent = `$${Number(book.price).toFixed(2)}`;
    price.style.color = "var(--primary)";
    price.style.fontWeight = "bold";

    bookMeta.appendChild(year);
    bookMeta.appendChild(pages);
    bookMeta.appendChild(price);

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description;

    const bookPublisher = document.createElement("p");
    bookPublisher.className = "book-publisher";
    bookPublisher.textContent = book.publisher;

    const bookIdElement = document.createElement("p");
    bookIdElement.className = 'id-book';
    bookIdElement.textContent = bookId;
    bookIdElement.style.display = 'none';

    const buyBook = document.createElement("button");
    buyBook.className = "buy-book";
    buyBook.textContent = `Buy Now • $${Number(book.price).toFixed(2)}`;

    buyBook.addEventListener('click', function (e) {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      console.log("Buy book clicked:", target);
      let bookId: string | null = null;
      if (target && target.parentNode) {
        const idElement = target.parentNode.querySelector('.id-book') as HTMLElement;
        bookId = idElement ? idElement.textContent : null;
        console.log("Book ID for purchase:", bookId);
      }
      if (bookId) {
        addToCart(bookId, allBooks);
      }
    });

    bookInfo.appendChild(bookTitle);
    bookInfo.appendChild(bookAuthor);
    bookInfo.appendChild(bookMeta);
    bookInfo.appendChild(description);
    bookInfo.appendChild(bookPublisher);
    bookInfo.appendChild(bookIdElement);
    bookInfo.appendChild(buyBook);

    bookCard.appendChild(bookImage);
    bookCard.appendChild(bookInfo);

    bookCard.addEventListener('click', () => {
      showBookModal(book);
    });

    booksContainer.appendChild(bookCard);
  });
}

export function updateStats(stats: BookStats): void {
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

export function showBookModal(book: Book): void {
  const modal = document.createElement('div');
  modal.className = 'book-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <p><strong>Description:</strong> ${book.description}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <img src="${book.image}" alt="${book.title}">
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.close-button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}