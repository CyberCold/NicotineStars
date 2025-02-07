async function displayProducts() {
    console.log("Функция displayProducts запущена");
    const products = await loadProducts(); // Данные о товарах загружаются
    if (!products || products.length === 0) {
        console.error("Ошибка: товары не загружены!");
        return;
    }
    console.log("Товары:", products);

    const productsContainer = document.getElementById('products-list');
    if (!productsContainer) {
        console.error("Ошибка: контейнер 'products-list' не найден!");
        return;
    }

    productsContainer.innerHTML = products.length === 0
        ? "<p>Нет доступных товаров.</p>"
        : products.map(product => `
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
let products = []; // Декларируем переменную для хранения продуктов

let products = []; // Декларируем переменную для хранения продуктов

async function loadProducts() {
    try {
        const response = await fetch('/data/products.json'); // Указание на путь к файлу
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        products = await response.json();
        console.log("Загруженные товары:", products); // Логируем продукты для проверки

        // Проверяем, есть ли контейнер для вывода товаров
        const productsContainer = document.getElementById('productsContainer');
        if (!productsContainer) {
            throw new Error("Контейнер для товаров не найден");
        }

        // Очищаем контейнер перед добавлением новых элементов
        productsContainer.innerHTML = '';

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
