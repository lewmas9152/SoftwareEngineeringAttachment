import { Book, CartItem } from '../models/types';
import notificationService from './notification';

export class CartManager {
  private cartItems: CartItem[] = [];
  private cartCountElement: Element | null;
  private cartItemsContainer: Element | null;
  private cartEmptyMessage: Element | null;
  private cartTotalItems: Element | null;
  private cartTotalPrice: HTMLElement;
  private checkoutBtn: Element | null;

  constructor() {
    this.cartCountElement = document.querySelector(".cart-count");
    this.cartItemsContainer = document.querySelector(".cart-items");
    this.cartEmptyMessage = document.querySelector(".cart-empty-message");
    this.cartTotalItems = document.querySelector(".cart-total span:last-child");
    
    this.cartTotalPrice = document.createElement("div");
    this.cartTotalPrice.className = "cart-total";
    this.cartTotalPrice.innerHTML = "<span>Total Price:</span><span>$0.00</span>";
    
    this.checkoutBtn = document.querySelector(".checkout-btn");
    
    const cartFooter = document.querySelector(".cart-footer");
    if (cartFooter && this.checkoutBtn) {
      cartFooter.insertBefore(this.cartTotalPrice, this.checkoutBtn);
    }

    this.initializeCartUI();
  }

  private initializeCartUI(): void {
    const cartButton = document.getElementById('cart-button');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.getElementById('close-cart');
    
    if (cartButton && cartOverlay && closeCart && cartModal) {
      cartButton.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        cartModal.classList.add('active');
      });
      
      const closeCartModal = () => {
        cartOverlay.classList.remove('active');
        cartModal.classList.remove('active');
      };
      
      closeCart.addEventListener('click', closeCartModal);
      cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
          closeCartModal();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartOverlay.classList.contains('active')) {
          closeCartModal();
        }
      });
    }
    
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (this.cartItems.length > 0) {
          const totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          alert(`Proceeding to checkout!\nTotal: $${totalPrice.toFixed(2)}\nNumber of books: ${this.cartItems.reduce((count, item) => count + item.quantity, 0)}`);
        }
      });
    }

    this.updateCartUI();
  }

  public addToCart(bookId: string, booksArray: Book[]): void {
    const bookToAdd = booksArray.find((book: Book) => book.id === bookId);
    
    if (!bookToAdd) return;
    
    const existingItemIndex = this.cartItems.findIndex(item => item.id === bookId);
    
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      this.cartItems.push({
        ...bookToAdd,
        quantity: 1
      });
    }
    
    this.updateCartUI();
    notificationService.showNotification(`Added "${bookToAdd.title}" to cart`);
  }

  private incrementCartItem(id: string): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].quantity += 1;
      this.updateCartUI();
    }
  }
  
  private decrementCartItem(id: string): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
      } else {
        this.removeCartItem(id);
        return;
      }
      this.updateCartUI();
    }
  }
  
  private removeCartItem(id: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.updateCartUI();
    notificationService.showNotification("Item removed from cart");
  }

  private updateCartUI(): void {
    if (!this.cartCountElement || !this.cartTotalItems || !this.cartTotalPrice) return;
    
    const totalItems = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    if (this.cartCountElement) {
      this.cartCountElement.textContent = totalItems.toString();
    }
    if (this.cartTotalItems) {
      this.cartTotalItems.textContent = `${totalItems} ${totalItems === 1 ? 'book' : 'books'}`;
    }
    
    const totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const priceElement = this.cartTotalPrice.querySelector('span:last-child');
    if (priceElement) {
      priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    this.renderCartItems();
  }
  
  private renderCartItems(): void {
    if (!this.cartItemsContainer || !this.cartEmptyMessage || !this.checkoutBtn) return;
    
    const itemElements = this.cartItemsContainer.querySelectorAll('.cart-item');
    itemElements.forEach(item => item.remove());
    
    if (this.cartItems.length === 0) {
      (this.cartEmptyMessage as HTMLElement).style.display = 'block';
      (this.checkoutBtn as HTMLButtonElement).disabled = true;
      return;
    } else {
      (this.cartEmptyMessage as HTMLElement).style.display = 'none';
      (this.checkoutBtn as HTMLButtonElement).disabled = false;
    }
    
    this.cartItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
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
              <button class="quantity-btn decrease-quantity" data-id="${item.id}">
                <i class="fa fa-minus" aria-hidden="true"></i>
              </button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn btn2 increase-quantity" data-id="${item.id}">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-id="${item.id}">
              <i class="fa fa-trash" aria-hidden="true"></i>
              Remove
            </button>
          </div>
        </div>
      `;
      if(this.cartItemsContainer)
      this.cartItemsContainer.appendChild(cartItem);
    });
    
    this.addCartItemEventListeners();
  }
  
  private addCartItemEventListeners(): void {
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.getAttribute('data-id');
        if (id) {
          this.incrementCartItem(id);
        }
      });
    });
    
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.getAttribute('data-id');
        if (id) {
          this.decrementCartItem(id);
        }
      });
    });
    
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.getAttribute('data-id');
        if (id) {
          this.removeCartItem(id);
        }
      });
    });
  }
}

export default new CartManager();