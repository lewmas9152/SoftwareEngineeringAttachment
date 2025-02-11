document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    fetch("http://localhost:3000/products")
      .then(response => response.json())
      .then(products => {
        products.forEach(product => {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");
  
          productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p><strong>Category:</strong> ${product.category}</p>
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock} available</p>
          `;
  
          productsContainer.appendChild(productDiv);
        });
      })
      .catch(error => console.error("Error fetching products:", error));
  });
  