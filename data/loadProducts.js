async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);

        const data = await response.json();
        console.log('Загруженные продукты:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return [];
    }
}

async function displayProducts() {
    console.log("Функция displayProducts запущена");
    const products = await loadProducts();
    console.log("Товары:", products);

    const productsContainer = document.getElementById('products-list');
    if (!productsContainer) {
        console.error("Ошибка: контейнер 'products-list' не найден!");
        return;
    }

    if (products.length === 0) {
        console.warn("Нет доступных товаров!");
        productsContainer.innerHTML = "<p>Нет доступных товаров.</p>";
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.img}" alt="${product.name}" />
            <p>${product.name}</p>
            <p>Цена: ${product.price} €</p>
            <button onclick="window.location.href='result.html?q=${encodeURIComponent(product.name)}'">
                Искать этот товар
            </button>
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", displayProducts);
