document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("products-container")
    const categoryFilters = document.getElementById("category-filters")
    let products = []
    const categories = new Set()
  
    // Fetch products from our local API
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        products = data.products
        renderProducts(products)
        renderCategoryFilters()
      })
      .catch((error) => console.error("Error:", error))
  
    function renderProducts(productsToRender) {
      productsContainer.innerHTML = ""
      productsToRender.forEach((product) => {
        const productElement = createProductElement(product)
        productsContainer.appendChild(productElement)
        categories.add(product.category)
      })
    }
  
    function createProductElement(product) {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.innerHTML = `
              <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
              <h2 class="product-title">${product.title}</h2>
              <p class="product-price">$${product.price}</p>
              <p class="product-rating">Rating: ${product.rating}/5</p>
              <p class="product-description">${product.description}</p>
          `
      return productCard
    }
  
    function renderCategoryFilters() {
      categoryFilters.innerHTML = '<button class="filter-button active" data-category="all">All</button>'
      categories.forEach((category) => {
        const button = document.createElement("button")
        button.className = "filter-button"
        button.textContent = category
        button.dataset.category = category
        categoryFilters.appendChild(button)
      })
  
      categoryFilters.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-button")) {
          const category = e.target.dataset.category
          document.querySelectorAll(".filter-button").forEach((btn) => btn.classList.remove("active"))
          e.target.classList.add("active")
  
          if (category === "all") {
            renderProducts(products)
          } else {
            const filteredProducts = products.filter((product) => product.category === category)
            renderProducts(filteredProducts)
          }
        }
      })
    }
  })
  
  