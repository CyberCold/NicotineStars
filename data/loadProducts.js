// Загрузка данных из products.json
async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');  // Получаем данные из файла products.json
        if (!response.ok) {
            throw new Error('Не удалось загрузить товары');
        }
        const products = await response.json();  // Парсим данные как JSON
        return products;  // Возвращаем список товаров
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return [];  // Возвращаем пустой массив в случае ошибки
    }
}
