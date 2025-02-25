interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: string;
  pages: string;
  price: number;
  image: string;
  publisher: string;
}


interface CartItem extends Book {
  quantity: number;
}

document.addEventListener("DOMContentLoaded", function () {
  // Type assertions for DOM elements
  const booksContainer = document.getElementById("books-container") as HTMLDivElement;
  const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
  const yearFilter = document.getElementById("year-filter") as HTMLSelectElement;
  const sortBy = document.getElementById("sort-by") as HTMLSelectElement;
  const applyFiltersBtn = document.getElementById("apply-filters") as HTMLButtonElement;
  const searchInput = document.querySelector(".search-bar input") as HTMLInputElement;
  const loadingContainer = document.getElementById("loading-container") as HTMLDivElement;
  const cartCountElement = document.querySelector(".cart-count") as HTMLSpanElement;
  const cartItemsContainer = document.querySelector(".cart-items") as HTMLDivElement;
  const cartEmptyMessage = document.querySelector(".cart-empty-message") as HTMLDivElement;
  const cartTotalItems = document.querySelector(".cart-total span:last-child") as HTMLSpanElement;
  const cartTotalPrice = document.createElement("div");
  cartTotalPrice.className = "cart-total";
  cartTotalPrice.innerHTML = "<span>Total Price:</span><span>$0.00</span>";
  const checkoutBtn = document.querySelector(".checkout-btn") as HTMLButtonElement;
  const cartFooter = document.querySelector(".cart-footer") as HTMLDivElement;

  // Add the total price element to cart footer
  cartFooter.insertBefore(cartTotalPrice, checkoutBtn);

  // Type annotations for arrays
  let cartItems: CartItem[] = [];
  let allBooks: Book[] = [];

  // Add return type to the function
  async function fetchData(): Promise<Book[]> {
    try {
      loadingContainer.style.display = "flex";
      const data = await fetch("http://localhost:3001/Books");
      const dataJson: Book[] = await data.json();
      loadingContainer.style.display = "none";
      return dataJson;
    } catch (error) {
      console.error("Error fetching data:", error);
      loadingContainer.style.display = "none";
      return [];
    }
  }

  // Initialize the app
  fetchData().then((books: Book[]) => {
    allBooks = books;
    displayBooks(books);
    updateStats(books);
  });

  // Add event listener for filter button
  applyFiltersBtn.addEventListener("click", function () {
    filterAndSortBooks();
  });

  // Add event listener for search input
  searchInput.addEventListener("keyup", function (event: KeyboardEvent) {
    if (event.key === "Enter") {
      filterAndSortBooks();
    }
  });

  function filterAndSortBooks(): void {
    loadingContainer.style.display = "flex";

    const searchTerm = searchInput.value.toLowerCase().trim();
    const genre = genreFilter.value;
    const yearRange = yearFilter.value;
    const sortOption = sortBy.value;

    // Filter books
    let filteredBooks = allBooks.filter((book: Book) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm);

      // Genre filter
      const matchesGenre = genre === "" || book.genre === genre;

      // Year filter
      let matchesYear = true;
      if (yearRange === "pre-1900") {
        matchesYear = parseInt(book.year) < 1900;
      } else if (yearRange === "1900-1950") {
        matchesYear =
          parseInt(book.year) >= 1900 && parseInt(book.year) <= 1950;
      } else if (yearRange === "post-1950") {
        matchesYear = parseInt(book.year) > 1950;
      }

      return matchesSearch && matchesGenre && matchesYear;
    });

    // Sort books
    switch (sortOption) {
      case "title-asc":
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "year-asc":
        filteredBooks.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case "year-desc":
        filteredBooks.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case "pages-asc":
        filteredBooks.sort((a, b) => parseInt(a.pages) - parseInt(b.pages));
        break;
      case "pages-desc":
        filteredBooks.sort((a, b) => parseInt(b.pages) - parseInt(a.pages));
        break;
    }

    displayBooks(filteredBooks);
    updateStats(filteredBooks);
    loadingContainer.style.display = "none";
  }

  // Add parameter type annotation
  function displayBooks(books: Book[]): void {
    booksContainer.innerHTML = "";

    if (books.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent =
        "No books match your filters. Try adjusting your search criteria.";
      booksContainer.appendChild(noResults);
      return;
    }

    books.forEach((result: Book) => {
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

      // Add price display
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
      bookId.className = "id-book";
      bookId.textContent = result.id.toString();
      bookId.style.display = "none";

      const buyBook = document.createElement("button");
      buyBook.className = "buy-book";
      buyBook.textContent = `Buy Now • $${result.price.toFixed(2)}`;

      // Add to cart click handler
      buyBook.addEventListener("click", function (e: MouseEvent) {
        e.stopPropagation(); // Stop event from triggering book modal
        const target = e.target as HTMLElement;
        const bookId = target.parentNode!.querySelector(".id-book")!.textContent!;
        addToCart(bookId, books);
      });

      bookInfo.appendChild(bookTitle);
      bookInfo.appendChild(bookAuthor);
      bookInfo.appendChild(bookMeta);
      bookInfo.appendChild(description);
      bookInfo.appendChild(bookPublisher);
      bookInfo.appendChild(bookId);
      bookInfo.appendChild(buyBook);

      // Add click handler for book details modal
      bookCard.addEventListener("click", () => {
        showBookModal(result);
      });

      bookCard.appendChild(bookImage);
      bookCard.append(bookInfo);
      booksContainer.appendChild(bookCard);
    });
  }

  // Add parameter and return type annotations
  function updateStats(books: Book[]): void {
    const totalBooksElement = document.getElementById("total-books") as HTMLElement;
    totalBooksElement.textContent = books.length.toString();

    if (books.length === 0) {
      const avgPagesElement = document.getElementById("avg-pages") as HTMLElement;
      const oldestBookElement = document.getElementById("oldest-book") as HTMLElement;
      const genresCountElement = document.getElementById("genres-count") as HTMLElement;
      
      avgPagesElement.textContent = "0";
      oldestBookElement.textContent = "N/A";
      genresCountElement.textContent = "0";
      return;
    }

    // Calculate average pages
    const totalPages = books.reduce(
      (sum, book) => sum + parseInt(book.pages),
      0
    );
    const avgPages = Math.round(totalPages / books.length);
    const avgPagesElement = document.getElementById("avg-pages") as HTMLElement;
    avgPagesElement.textContent = avgPages.toString();

    // Find oldest book
    const oldestYear = Math.min(...books.map((book) => parseInt(book.year)));
    const oldestBookElement = document.getElementById("oldest-book") as HTMLElement;
    oldestBookElement.textContent =
      oldestYear < 0 ? `${Math.abs(oldestYear)} BCE` : oldestYear.toString();

    // Count unique genres
    const uniqueGenres = new Set(books.map((book) => book.genre));
    const genresCountElement = document.getElementById("genres-count") as HTMLElement;
    genresCountElement.textContent = uniqueGenres.size.toString();
  }

  // Add showBookModal function type signature
  // This function wasn't implemented in the original code
  function showBookModal(book: Book): void {
    // Implementation would go here
  }

  // Cart functionality
  function addToCart(bookId: string, booksArray: Book[]): void {
    const bookToAdd = booksArray.find((book) => book.id.toString() === bookId);

    if (!bookToAdd) return;

    // Check if book is already in cart
    const existingItemIndex = cartItems.findIndex((item) => item.id.toString() === bookId);

    if (existingItemIndex !== -1) {
      // Book already in cart, increment quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new book to cart
      cartItems.push({
        ...bookToAdd,
        quantity: 1,
      });
    }

    // Update cart UI
    updateCartUI();

    // Show feedback
    showNotification(`Added "${bookToAdd.title}" to cart`);
  }

  function updateCartUI(): void {
    // Update cart count
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartCountElement.textContent = totalItems.toString();
    cartTotalItems.textContent = `${totalItems} ${
      totalItems === 1 ? "book" : "books"
    }`;

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Update total price display
    const priceElement = cartTotalPrice.querySelector("span:last-child") as HTMLElement;
    priceElement.textContent = `$${totalPrice.toFixed(2)}`;

    // Update cart items display
    renderCartItems();
  }

  function renderCartItems(): void {
    // Clear current cart items (except empty message)
    const itemElements = cartItemsContainer.querySelectorAll(".cart-item");
    itemElements.forEach((item) => item.remove());

    // Show/hide empty message
    if (cartItems.length === 0) {
      cartEmptyMessage.style.display = "block";
      checkoutBtn.disabled = true;
      return;
    } else {
      cartEmptyMessage.style.display = "none";
      checkoutBtn.disabled = false;
    }

    // Add each cart item
    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-author">${item.author}</p>
          <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn decrease-quantity" data-id="${
                item.id
              }">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn btn2 increase-quantity" data-id="${
                item.id
              }">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
            <span class="item-total">$${(item.price * item.quantity).toFixed(
              2
            )}</span>
            <button class="remove-item" data-id="${item.id}">
              <i class="fa fa-trash" aria-hidden="true"></i>
              Remove
            </button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    addCartItemEventListeners();
  }

  function addCartItemEventListeners(): void {
    // Increment quantity
    const increaseButtons = document.querySelectorAll(".increase-quantity");
    increaseButtons.forEach((button) => {
      button.addEventListener("click", function (this: HTMLElement) {
        const id = this.getAttribute("data-id")!;
        incrementCartItem(id);
      });
    });

    // Decrement quantity
    const decreaseButtons = document.querySelectorAll(".decrease-quantity");
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function (this: HTMLElement) {
        const id = this.getAttribute("data-id")!;
        decrementCartItem(id);
      });
    });

    // Remove item
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", function (this: HTMLElement) {
        const id = this.getAttribute("data-id")!;
        removeCartItem(id);
      });
    });
  }

  function incrementCartItem(id: string): void {
    const itemIndex = cartItems.findIndex((item) => item.id.toString() === id);
    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += 1;
      updateCartUI();
    }
  }

  function decrementCartItem(id: string): void {
    const itemIndex = cartItems.findIndex((item) => item.id.toString() === id);
    if (itemIndex !== -1) {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        // If quantity would be 0, remove the item
        removeCartItem(id);
        return;
      }
      updateCartUI();
    }
  }

  function removeCartItem(id: string): void {
    cartItems = cartItems.filter((item) => item.id.toString() !== id);
    updateCartUI();
    showNotification("Item removed from cart");
  }

  function showNotification(message: string): void {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--primary);
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(10px)";

      // Remove from DOM after fade out
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Cart modal functionality
  const cartButton = document.getElementById("cart-button") as HTMLButtonElement;
  const cartOverlay = document.getElementById("cart-overlay") as HTMLDivElement;
  const cartModal = document.querySelector(".cart-modal") as HTMLDivElement;
  const closeCart = document.getElementById("close-cart") as HTMLElement;

  // Open cart modal
  cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("active");
    cartModal.classList.add("active");
  });

  // Close cart modal
  const closeCartModal = (): void => {
    cartOverlay.classList.remove("active");
    cartModal.classList.remove("active");
  };

  closeCart.addEventListener("click", closeCartModal);
  cartOverlay.addEventListener("click", (e: MouseEvent) => {
    if (e.target === cartOverlay) {
      closeCartModal();
    }
  });

  // Close cart on escape key
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && cartOverlay.classList.contains("active")) {
      closeCartModal();
    }
  });

  // Add checkout button functionality
  checkoutBtn.addEventListener("click", function () {
    if (cartItems.length > 0) {
      const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      alert(
        `Proceeding to checkout!\nTotal: $${totalPrice.toFixed(
          2
        )}\nNumber of books: ${cartItems.reduce(
          (count, item) => count + item.quantity,
          0
        )}`
      );
      // Here you would redirect to a checkout page in a real application
    }
  });

  updateCartUI();
});