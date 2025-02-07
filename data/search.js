async function loadProducts() {
    try {
        const response = await fetch('/data/products.json'); // Указание на путь к файлу
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        products = await response.json();
        
        // Здесь добавляем продукты на страницу
        const productsContainer = document.getElementById('productsContainer'); // контейнер на странице
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Цена: ${product.price}</p>
            `;
            productsContainer.appendChild(productElement);
        });

    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

loadProducts(); // Загружаем продукты при запуске скрипта

function search(query) {
    if (!query) {
        searchResultsList.innerHTML = '';
        return;
    }

    loadProducts().then(products => {
        const filteredResults = products.filter(item => {
            return item.name.toLowerCase().includes(query.toLowerCase()) ||
                   item.aliases.some(alias => alias.toLowerCase().includes(query.toLowerCase()));
        });

        displayResults(filteredResults);
    });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function searchProducts(query, products) {
    query = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.aliases.some(alias => alias.toLowerCase().includes(query))
    );
}

async function displayResults() {
    const query = getQueryParam('q');
    if (!query) {
        console.log("Нет запроса.");
        return;
    }

    const products = await loadProducts();
    console.log("Загруженные товары:", products);

    const results = searchProducts(query, products);
    console.log("Результаты поиска:", results);

    const resultsContainer = document.getElementById('results');

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>Товар не найден.</p>";
        return;
    }

    resultsContainer.innerHTML = results.map(product => `
        <div class="product">
            <img src="${product.img || 'https://via.placeholder.com/100'}" alt="${product.name}">
            <div>
                <p>${product.name}</p>
                <p>${product.price} €</p>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', displayResults);
