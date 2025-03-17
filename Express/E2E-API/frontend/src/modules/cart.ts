// modules/cart.ts
import { Book, CartItem } from '../types/types';
import { showNotification } from '../utils/utils';

let cartItems: CartItem[] = [];

export function getCartItems(): CartItem[] {
  return [...cartItems];
}

export function addToCart(bookId: string | number, allBooks: Book[]): void {
  console.log("addToCart called with ID:", bookId);
  
  // Try to find the book using both string and number comparisons
  const bookToAdd = allBooks.find((book) => {
    const bookObjectId = book.id || book.book_id;
    return bookObjectId == bookId; // Use loose equality to match across types
  });
  
  console.log("Book found for cart:", bookToAdd);
  
  if (!bookToAdd) {
    console.error("Could not find book with ID:", bookId);
    // Debug: Log all book IDs to see what's available
    console.log("Available book IDs:", allBooks.map(book => book.id || book.book_id));
    return;
  }
  
  const existingItemIndex = cartItems.findIndex(item => {
    const itemId = item.id || item.book_id;
    return itemId == bookId; // Use loose equality
  });
  
  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += 1;
  } else {
    cartItems.push({
      ...bookToAdd,
      quantity: 1
    });
  }
  
  updateCartUI();
  showNotification(`Added "${bookToAdd.title}" to cart`);
}

export function incrementCartItem(id: string): void {
  const itemIndex = cartItems.findIndex(item => 
    String(item.id) === String(id) || String(item.book_id) === String(id)
  );
  if (itemIndex !== -1) {
    cartItems[itemIndex].quantity += 1;
    updateCartUI();
  }
}

export function decrementCartItem(id: string): void {
  const itemIndex = cartItems.findIndex(item => 
    String(item.id) === String(id) || String(item.book_id) === String(id)
  );
  if (itemIndex !== -1) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
    } else {
      removeCartItem(id);
      return;
    }
    updateCartUI();
  }
}

export function removeCartItem(id: string): void {
  cartItems = cartItems.filter(item => 
    String(item.id) !== String(id) && String(item.book_id) !== String(id)
  );
  updateCartUI();
  showNotification("Item removed from cart");
}

export function removeBookFromCart(bookId: string): void {
  cartItems = cartItems.filter(item => 
    item.id !== bookId && item.book_id !== bookId
  );
  updateCartUI();
}

function updateCartUI(): void {
  const cartCountElement = document.querySelector(".cart-count");
  const cartTotalItems = document.querySelector(".cart-total span:last-child");
  const cartTotalPrice = document.querySelector(".cart-total:last-of-type span:last-child") as HTMLElement;
  const cartEmptyMessage = document.querySelector(".cart-empty-message") as HTMLElement;
  const checkoutBtn = document.querySelector(".checkout-btn") as HTMLButtonElement;
  
  if (!cartCountElement) return;

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  if (cartCountElement) {
    cartCountElement.textContent = totalItems.toString();
  }
  if (cartTotalItems) {
    cartTotalItems.textContent = `${totalItems} ${totalItems === 1 ? 'book' : 'books'}`;
  }

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  if (cartTotalPrice) {
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  }

  renderCartItems();
}

function renderCartItems(): void {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartEmptyMessage = document.querySelector(".cart-empty-message") as HTMLElement;
  const checkoutBtn = document.querySelector(".checkout-btn") as HTMLButtonElement;
  
  if (!cartItemsContainer || !cartEmptyMessage || !checkoutBtn) return;

  const itemElements = cartItemsContainer.querySelectorAll('.cart-item');
  itemElements.forEach(item => item.remove());

  if (cartItems.length === 0) {
    cartEmptyMessage.style.display = 'block';
    checkoutBtn.disabled = true;
    return;
  } else {
    cartEmptyMessage.style.display = 'none';
    checkoutBtn.disabled = false;
  }

  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    // Use consistent ID approach
    const itemId = item.id || item.book_id;

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.title}</h3>
        <p class="cart-item-author">${item.author}</p>
        <p class="cart-item-price">$${Number(item.price).toFixed(2)} each</p>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn decrease-quantity" data-id="${itemId}">
              <i class="fa fa-minus" aria-hidden="true"></i>
            </button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn btn2 increase-quantity" data-id="${itemId}">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div>
          <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item" data-id="${itemId}">
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
  const increaseButtons = document.querySelectorAll('.increase-quantity');
  increaseButtons.forEach(button => {
    button.addEventListener('click', function (this: HTMLElement) {
      const id = this.getAttribute('data-id');
      if (id) {
        incrementCartItem(id);
      }
    });
  });

  const decreaseButtons = document.querySelectorAll('.decrease-quantity');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', function (this: HTMLElement) {
      const id = this.getAttribute('data-id');
      if (id) {
        decrementCartItem(id);
      }
    });
  });

  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', function (this: HTMLElement) {
      const id = this.getAttribute('data-id');
      if (id) {
        removeCartItem(id);
      }
    });
  });
}

export function setupCheckout(): void {
  const checkoutBtn = document.querySelector(".checkout-btn");
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (cartItems.length > 0) {
        const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        alert(`Proceeding to checkout!\nTotal: $${totalPrice.toFixed(2)}\nNumber of books: ${cartItems.reduce((count, item) => count + item.quantity, 0)}`);
      }
    });
  }
}