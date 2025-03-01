// Debounce function to limit the number of calls to the search filter
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Функция для загрузки продуктов
async function loadProducts() {
    try {
        console.log("Загрузка данных...");
        const response = await fetch('/data/products.json'); // Получаем данные
        if (!response.ok) {
            console.error('Ошибка загрузки данных:', response.status);
            return;
        }
        const products = await response.json();
        console.log('Загруженные продукты:', products);

        
        displaySearchResults(products);

        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function () {
                const query = searchInput.value.toLowerCase();
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    product.aliases.some(alias => alias.toLowerCase().includes(query))
                );
                displaySearchResults(filteredProducts);
            }, 300));
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}


function addToCart(product, quantity) {
    console.log(`Добавлено в корзину: ${product.name} x ${quantity}`);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

loadProducts();

const addToCartBtn = productElement.querySelector('.add-to-cart');


addToCartBtn.addEventListener('click', function() {
    const productId = product.id;
    const productName = product.name;
    const productPrice = product.price;
    const quantity = parseInt(quantitySpan.textContent);

    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} добавлен в корзину!`);
});
