document.addEventListener('DOMContentLoaded', function () {

    const menu = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const searchBar = document.querySelector('.search-bar');
    const cart = document.querySelector('.cart');
    const heart = document.querySelector('.heart');
    const account = document.querySelector('.account');
    const searchButton = document.querySelector('.search__button');  // Кнопка поиска
    const searchInput = document.getElementById('Search-In-Modal');  // Поле ввода
    const searchResultsList = document.getElementById('predictive-search-results-list');
    
    let menuOpen = false;
    let searchOpen = false;
    let cartOpen = false;

    if (searchBar) {
        searchBar.classList.add("icons");
    }

    menuToggle.addEventListener('click', function (event) {
        if (menuOpen) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
        menuOpen = !menuOpen;
        event.stopPropagation();
    });

    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 800) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.classList.remove('active');
                menuOpen = false;
            }
            if (!searchBar.contains(event.target) && event.target !== document.querySelector('.search')) {
                searchBar.style.display = 'none';
                searchOpen = false;
            }
            if (!cart.contains(event.target) && event.target !== document.querySelector('.cart-icon')) {
                cart.style.display = 'none';
                cartOpen = false;
            }
            if (!heart.contains(event.target) && event.target !== document.querySelector('.heart')) {
                heart.classList.remove('active');
            }
            if (!account.contains(event.target) && event.target !== document.querySelector('.account')) {
                account.classList.remove('active');
            }
        }
    });

    document.querySelector('.search').addEventListener('click', function (event) {
        event.stopPropagation();
        if (!searchOpen) {
            searchBar.style.display = 'block';
            searchOpen = true;
            if (cartOpen) {
                cart.style.display = 'none';
                cartOpen = false;
            }
        } else {
            searchBar.style.display = 'none';
            searchOpen = false;
        }
    });

    document.querySelector('.cart-icon').addEventListener('click', function (event) {
        event.stopPropagation();
        if (!cartOpen) {
            cart.style.display = 'block';
            cartOpen = true;
            if (searchOpen) {
                searchBar.style.display = 'none';
                searchOpen = false;
            }
        } else {
            cart.style.display = 'none';
            cartOpen = false;
        }
    });

    heart.addEventListener('click', function (event) {
        event.stopPropagation();
        heart.classList.toggle('active');
    });

    account.addEventListener('click', function (event) {
        window.location.href = "User.html";
    });

    document.addEventListener('DOMContentLoaded', function () {
        const searchForm = document.getElementById('search-form');  // Форма поиска
        const searchInput = document.getElementById('Search-In-Modal'); // Поле ввода
    
        // Логируем, что скрипт загружен
        console.log("Скрипт загружен, готовы к обработке отправки формы!");
    
        // Код для перенаправления на страницу с результатами поиска
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Предотвращаем стандартное поведение формы
    
            const query = searchInput.value.trim();  // Получаем запрос из поля (с удалением лишних пробелов)
    
            // Логируем запрос
            console.log('Поиск начат. Запрос: ', query);
    
            if (query) {
                // Если запрос не пустой, переходим на новую страницу
                console.log('Переход на страницу result.html');
                window.location.href = `.data/result.html?q=${encodeURIComponent(query)}`;
            } else {
                // Логируем, если запрос пустой
                console.log('Запрос пустой, редирект не происходит');
            }
        });
    });
    
    
    

    // Пример данных для поиска товаров
    const products = [
        { id: 1, name: "Icebrg Ice Mint", aliases: "Iceberg, Iceberg Ice Mint", price: 7 },
        { id: 2, name: "Cuba Cherry", aliases: "Cuba, Cuba cherry", price: 7 },
        { id: 3, name: "Cuba Black Currant", aliases: "Cuba, Cuba Black Currant", price: 7 }
    ];

    // Функция для отображения результатов поиска
    function displayResults(results) {
        searchResultsList.innerHTML = '';  // Очистить текущие результаты

        if (results.length === 0) {
            searchResultsList.innerHTML = '<li>No results found</li>';
        } else {
            results.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                li.addEventListener('click', function () {
                    // При клике на результат, можно выполнить действия, например:
                    searchInput.value = item.name;
                    searchResultsList.innerHTML = '';  // Очистить результаты
                });
                searchResultsList.appendChild(li);
            });
        }
    }

    // Функция для фильтрации данных товаров
    function search(query) {
        if (!query) {
            searchResultsList.innerHTML = '';  // Если ничего не введено, скрыть результаты
            return;
        }

        const filteredResults = products.filter(item => {
            return item.name.toLowerCase().includes(query.toLowerCase()) ||
                   item.aliases.toLowerCase().includes(query.toLowerCase());
        });

        displayResults(filteredResults);
    }

    // Добавление события на ввод в поле поиска
    searchInput.addEventListener('input', function () {
        search(searchInput.value);
    });

});
