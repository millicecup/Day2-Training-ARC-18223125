// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoryFilters = document.getElementById('category-filters');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');

// State
let products = [];
let categories = [];
let activeCategory = 'all';

// Fetch products from the API
async function fetchProducts() {
    try {
        console.log('Fetching products...'); // Debug log
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        products = data.products;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        categories = ['all', ...uniqueCategories];
        
        // Hide loading message
        loadingMessage.style.display = 'none';
        
        // Render categories and products
        renderCategoryFilters();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'Failed to load products. Please try again later.';
        errorMessage.style.display = 'block';
    }
}

// Render category filter buttons
function renderCategoryFilters() {
    categoryFilters.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `category-btn ${category === activeCategory ? 'active' : ''}`;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        button.addEventListener('click', () => {
            activeCategory = category;
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Re-render products with filter
            renderProducts();
        });
        
        categoryFilters.appendChild(button);
    });
}

// Render products based on active filter
function renderProducts() {
    productsGrid.innerHTML = '';
    
    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(product => product.category === activeCategory);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Generate star rating HTML
    const rating = product.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    if (hasHalfStar) {
        starsHTML += '½';
    }
    
    card.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
        <div class="product-content">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price}</p>
            <div class="product-rating">
                <span class="stars">${starsHTML}</span>
                <span>(${product.rating})</span>
            </div>
            <div class="product-details">
                <p class="product-description">${product.description}</p>
            </div>
            <button class="toggle-details">Show More</button>
        </div>
    `;
    
    // Add event listener for toggle details button
    const toggleButton = card.querySelector('.toggle-details');
    const details = card.querySelector('.product-details');
    
    toggleButton.addEventListener('click', () => {
        details.classList.toggle('show');
        toggleButton.textContent = details.classList.contains('show') ? 'Show Less' : 'Show More';
    });
    
    return card;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    fetchProducts();
});