document.addEventListener("DOMContentLoaded", function () {
    const booksContainer = document.getElementById("books-container");
    const genreFilter = document.getElementById("genre-filter");
    const yearFilter = document.getElementById("year-filter");
    const sortBy = document.getElementById("sort-by");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const searchInput = document.querySelector(".search-bar input");
    const loadingContainer = document.getElementById("loading-container");
    
    let allBooks = []; // Store all books for filtering
  
    async function fetchData() {
      try {
        loadingContainer.style.display = "flex"; // Show loading indicator
        const data = await fetch("http://localhost:3000/Books");
        const dataJson = await data.json();
        loadingContainer.style.display = "none"; // Hide loading indicator
        return dataJson;
      } catch (error) {
        console.error("Error fetching data:", error);
        loadingContainer.style.display = "none";
        return [];
      }
    }
  
    // Initialize the app
    fetchData().then((books) => {
      allBooks = books; // Store all books
      displayBooks(books);
      updateStats(books);
    });
    
    // Add event listener for filter button
    applyFiltersBtn.addEventListener("click", function() {
      filterAndSortBooks();
    });
    
    // Add event listener for search input
    searchInput.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        filterAndSortBooks();
      }
    });
    
    function filterAndSortBooks() {
      loadingContainer.style.display = "flex";
      
      const searchTerm = searchInput.value.toLowerCase().trim();
      const genre = genreFilter.value;
      const yearRange = yearFilter.value;
      const sortOption = sortBy.value;
      
      // Filter books
      let filteredBooks = allBooks.filter(book => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm);
        
        // Genre filter
        const matchesGenre = genre === '' || book.genre === genre;
        
        // Year filter
        let matchesYear = true;
        if (yearRange === 'pre-1900') {
          matchesYear = parseInt(book.year) < 1900;
        } else if (yearRange === '1900-1950') {
          matchesYear = parseInt(book.year) >= 1900 && parseInt(book.year) <= 1950;
        } else if (yearRange === 'post-1950') {
          matchesYear = parseInt(book.year) > 1950;
        }
        
        return matchesSearch && matchesGenre && matchesYear;
      });
      
      // Sort books
      switch(sortOption) {
        case 'title-asc':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'year-asc':
          filteredBooks.sort((a, b) => parseInt(a.year) - parseInt(b.year));
          break;
        case 'year-desc':
          filteredBooks.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case 'pages-asc':
          filteredBooks.sort((a, b) => parseInt(a.pages) - parseInt(b.pages));
          break;
        case 'pages-desc':
          filteredBooks.sort((a, b) => parseInt(b.pages) - parseInt(a.pages));
          break;
      }
      
      displayBooks(filteredBooks);
      updateStats(filteredBooks);
      loadingContainer.style.display = "none";
    }
  
    function displayBooks(books) {
      booksContainer.innerHTML = "";
      
      if (books.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No books match your filters. Try adjusting your search criteria.';
        booksContainer.appendChild(noResults);
        return;
      }
      
      books.forEach((result) => {
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
        
        bookMeta.appendChild(year);
        bookMeta.appendChild(pages);
        
        const description = document.createElement("p");
        description.className = "book-description";
        description.textContent = result.description;
        
        const bookPublisher = document.createElement("p");
        bookPublisher.className = "book-publisher";
        bookPublisher.textContent = result.publisher;
        
        bookInfo.appendChild(bookTitle);
        bookInfo.appendChild(bookAuthor);
        bookInfo.appendChild(bookMeta);
        bookInfo.appendChild(description);
        bookInfo.appendChild(bookPublisher);
  
        // Add click handler for book details modal
        bookCard.addEventListener('click', () => {
          showBookModal(result);
        });
  
        bookCard.appendChild(bookImage);
        bookCard.append(bookInfo);
        booksContainer.appendChild(bookCard);
      });
    }
    
    function updateStats(books) {
      document.getElementById("total-books").textContent = books.length;
      
      if (books.length === 0) {
        document.getElementById("avg-pages").textContent = "0";
        document.getElementById("oldest-book").textContent = "N/A";
        document.getElementById("genres-count").textContent = "0";
        return;
      }
      
      // Calculate average pages
      const totalPages = books.reduce((sum, book) => sum + parseInt(book.pages), 0);
      const avgPages = Math.round(totalPages / books.length);
      document.getElementById("avg-pages").textContent = avgPages;
      
      // Find oldest book
      const oldestYear = Math.min(...books.map(book => parseInt(book.year)));
      document.getElementById("oldest-book").textContent = 
        oldestYear < 0 ? `${Math.abs(oldestYear)} BCE` : oldestYear;
      
      // Count unique genres
      const uniqueGenres = new Set(books.map(book => book.genre));
      document.getElementById("genres-count").textContent = uniqueGenres.size;
    }
    
    function showBookModal(book) {
      const modal = document.getElementById("book-modal");
      modal.style.display = "flex";
      
      // Populate modal content
      const modalImg = modal.querySelector(".modal-book-image img");
      modalImg.src = book.image;
      modalImg.alt = book.title;
      
      modal.querySelector(".modal-title").textContent = book.title;
      modal.querySelector(".modal-author").textContent = `By ${book.author}`;
      
      // Update meta info
      const metaValues = modal.querySelectorAll(".meta-value");
      metaValues[0].textContent = book.year;
      metaValues[1].textContent = book.genre;
      metaValues[2].textContent = book.pages;
      metaValues[3].textContent = `#${book.id || '1'}`;
      
      modal.querySelector(".modal-description").textContent = book.description;
      modal.querySelector(".book-publisher strong").textContent = `Publisher: ${book.publisher}`;
      
      // Close modal event
      const closeModal = document.getElementById("close-modal");
      closeModal.addEventListener("click", function() {
        modal.style.display = "none";
      });
      
      // Close when clicking outside
      modal.addEventListener("click", function(e) {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  });