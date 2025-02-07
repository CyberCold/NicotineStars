async function loadProducts() {
    try {
        const response = await fetch('/data/brains.json'); 
        return await response.json();
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        return [];
    }
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
