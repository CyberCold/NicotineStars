let products = []; // Массив для хранения продуктов

// Функция для загрузки продуктов
async function loadProducts() {
    try {
        const response = await fetch('/data/products.json'); // Путь к JSON-файлу
        console.log('Ответ от сервера:', response);
        
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        
        products = await response.json();
        console.log('Загружены продукты:', products); // Логируем данные для проверки
        
        if (products.length === 0) {
            console.log('Продукты не были загружены!');
        } else {
            displayProducts(); // Вызываем функцию отображения данных
        }
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Функция для отображения продуктов
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Очищаем список перед выводом новых данных

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <h2>${product.name}</h2>
            <p>Цена: ${product.price} руб.</p>
            <img src="${product.img}" alt="${product.name}" width="200">
        `;
        productList.appendChild(productElement);

        // Сохраняем продукт в localStorage при выборе
        productElement.addEventListener('click', () => {
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'result.html'; // Переход к результатам
        });
    });
}

// Загружаем продукты при запуске скрипта
loadProducts();
