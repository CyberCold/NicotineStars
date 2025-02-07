let products = []; // Массив для хранения продуктов
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');

async function loadProducts() {
  try {
      const response = await fetch('/data/products.json');
      if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
      const products = await response.json();

      // Фильтрация по запросу
      const filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      const resultContainer = document.getElementById('resultContainer');
      filteredProducts.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
              <h2>${product.name}</h2>
              <p>Цена: ${product.price} руб.</p>
              <img src="${product.img}" alt="${product.name}" width="200">
          `;
          resultContainer.appendChild(productElement);
      });
  } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
  }
}

loadProducts(); // Загружаем товары при открытии result.html


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
