document.addEventListener("DOMContentLoaded", function () {
  booksContainer = document.getElementById("books-container");

  async function fetchData() {
    const data = await fetch("http://localhost:3000/Books");
    const dataJson = await data.json();
    return dataJson;
  }

  fetchData().then((results) => {
    booksContainer.innerHTML = "";
    results.forEach((result) => {
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
      bookCategory.innerHTML = result.genre;
      bookImage.appendChild(image);
      bookImage.appendChild(bookCategory);

      const bookInfo = document.createElement("div");
      bookInfo.className = "book-info";
      const bookTitle = document.createElement("h3");
      bookTitle.className = "book-title";
      bookTitle.innerHTML = result.title;
      const bookAuthor = document.createElement("p");
      bookAuthor.className = "book-author";
      bookAuthor.innerHTML = result.author;
      const bookMeta = document.createElement("div");
      bookMeta.className = "book-meta";
      const year = document.createElement("span");
      year.id = "year";
      year.innerHTML = result.year;
      const pages = document.createElement("span");
      pages.id = "pages";
      pages.innerHTML = result.pages;
      bookMeta.appendChild(year);
      bookMeta.appendChild(pages);
      const description = document.createElement("p");
      description.className = "book-description";
      description.innerHTML = result.description;
      const bookPublisher = document.createElement("p");
      bookPublisher.className = "book-publisher";
      bookPublisher.innerHTML = result.publisher;
      bookInfo.appendChild(bookTitle);
      bookInfo.appendChild(bookAuthor);
      bookInfo.appendChild(bookMeta);
      bookInfo.appendChild(description);
      bookInfo.appendChild(bookPublisher);

      bookCard.appendChild(bookImage);
      bookCard.append(bookInfo);
      booksContainer.appendChild(bookCard);
    });
  });
});
