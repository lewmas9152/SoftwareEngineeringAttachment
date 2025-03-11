import { Book } from '../models/types';

export class BookModalManager {
  showBookModal(book: Book): void {
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
}

export default new BookModalManager();