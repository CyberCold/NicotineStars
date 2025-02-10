document.addEventListener('DOMContentLoaded', function () {

    loadProducts();
    const menu = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const searchBar = document.querySelector('.search-bar');
    const cart = document.querySelector('.cart');
    const heart = document.querySelector('.heart');
    const account = document.querySelector('.account');
    const searchButton = document.querySelector('.search__button');
    const searchInput = document.getElementById('Search-In-Modal');
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

    document.querySelector('.search').addEventListener('click', function (event) {
        event.stopPropagation();
        if (!searchOpen) {
            searchBar.style.display = 'block'; // показываем поиск
            searchOpen = true;
            if (cartOpen) {
                cart.style.display = 'none'; // если корзина открыта, закрываем
                cartOpen = false;
            }
        } else {
            searchBar.style.display = 'none'; // если поиск уже открыт, скрываем
            searchOpen = false;
        }
    });

    function handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        const productName = event.target.dataset.productName;
        const productPrice = event.target.dataset.productPrice;
        const quantity = parseInt(event.target.closest('.product-card').querySelector('.quantity').innerText);
        const productImage = event.target.dataset.productImage; // Получаем URL изображения товара
    
        // Загружаем текущую корзину из localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        // Ищем товар в корзине
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity; // Увеличиваем количество, если товар уже в корзине
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity, image: productImage });
        }
    
        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart updated:", cart); // Выводим обновленную корзину в консоль
        alert(`${productName} Added to cart!`);
    }

    const cartContent = document.querySelector('.cart');
    
    

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

    // Функция для добавления товара в корзину
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        // Проверяем, есть ли товар в корзине
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;  // Увеличиваем количество, если товар уже есть
        } else {
            cart.push(product);  // Добавляем новый товар
        }
    
        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    
        console.log("Добавлено в корзину:", product.name);  // Для отладки
        console.log("Текущая корзина:", cart);  // Для отладки
    }
    
    // Обработчик события для кнопки "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                quantity: 1,
                id: this.getAttribute('data-id'),
                image: this.getAttribute('data-image') // Получаем URL изображения
            };

            // Добавляем товар в корзину
            addToCart(product);
        });
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
    
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            console.log("Cart items loaded:", cartItems);
    
            const cartContent = document.querySelector('.cart'); 
            cartContent.innerHTML = ''; 
            
            if (cartItems.length === 0) {
                cartContent.innerHTML = '<p>Your cart is empty.</p>'; 
            } else {
                let totalPrice = 0; 
    
                cartItems.forEach((item, index) => {
                    console.log("Товар в корзине:", item);
                    const productElement = document.createElement('div');
                    productElement.classList.add('cart-item');
                    productElement.innerHTML = `
                        <div class="cart-cart">
                            <div class="product-image-container">
                                <img src="${item.img}" alt="${item.name}" class="product-image">
                            </div>
                            <div class="product-name">${item.name}</div>
                            <div class="product-quantity">Count: ${item.quantity}</div>
                            <div class="product-price">Price: €${item.price}</div>
                            <button class="remove-item" data-index="${index}">Remove</button>
                        </div>
                    `;
                    cartContent.appendChild(productElement);
                    totalPrice += item.price * item.quantity;
                });
    
                const totalElement = document.createElement('div');
                totalElement.classList.add('cart-total');
                totalElement.innerHTML = `
                    <div class="total-price-text">Total price:</div>
                    <div class="total-price">€${totalPrice}</div>
                    <button class="go-to-delivery">Go to Delivery</button>
                `;
                cartContent.appendChild(totalElement);
    
                document.querySelector('.go-to-delivery').addEventListener('click', function() {
                    window.location.href = '/data/delivery.html'; 
                });
    
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function () {
                        let indexToRemove = parseInt(this.getAttribute('data-index'));
                        cartItems.splice(indexToRemove, 1); // Удаляем товар из массива
                        localStorage.setItem('cart', JSON.stringify(cartItems)); // Сохраняем обновлённый массив в localStorage
                        
                        // Обновляем содержимое корзины, но не закрываем её
                        updateCart();
                    });
                });
            }
        } else {
            cart.style.display = 'none';  
            cartOpen = false;
        }
    });

    document.querySelector('.logo').addEventListener('click', function() {
        window.location.href = 'Main.html'; 
    });

    
    // Функция для обновления содержимого корзины
    function updateCart() {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContent = document.querySelector('.cart'); 
        cartContent.innerHTML = '';
    
        if (cartItems.length === 0) {
            cartContent.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            let totalPrice = 0; 
    
            cartItems.forEach((item, index) => {
                const productElement = document.createElement('div');
                productElement.classList.add('cart-item');
                productElement.innerHTML = `
                    <div class="cart-cart">
                        <div class="product-image-container">
                            <img src="${item.img}" alt="${item.name}" class="product-image">
                        </div>
                        <div class="product-name">${item.name}</div>
                        <div class="product-quantity">Count: ${item.quantity}</div>
                        <div class="product-price">Price: €${item.price}</div>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                `;
                cartContent.appendChild(productElement);
                totalPrice += item.price * item.quantity;
            });
    
            const totalElement = document.createElement('div');
            totalElement.classList.add('cart-total');
            totalElement.innerHTML = `
                <div class="total-price-text">Total price:</div>
                <div class="total-price">€${totalPrice}</div>
                <button class="go-to-delivery">Go to Delivery</button>
            `;
            cartContent.appendChild(totalElement);
        }
    }
    
});

document.querySelectorAll('.tmenu_item').forEach(item => {
    let timeout;
    item.addEventListener('mouseenter', function() {
        clearTimeout(timeout); // Очищаем предыдущую задержку
        const submenu = this.querySelector('.submenu');
        if (submenu) {
            submenu.style.display = 'block'; // Показываем подменю
            submenu.style.opacity = 1; // Плавное появление
        }
    });

    item.addEventListener('mouseleave', function() {
        const submenu = this.querySelector('.submenu');
        if (submenu) {
            timeout = setTimeout(() => {
                submenu.style.opacity = 0; // Плавное исчезновение
                setTimeout(() => submenu.style.display = 'none', 300); // Скрываем подменю после анимации
            }, 200); // Задержка перед скрытием меню
        }
    });
});

document.querySelectorAll('.submenu').forEach(submenu => {
    submenu.addEventListener('mouseenter', function() {
        clearTimeout(timeout); // Очищаем задержку, если курсор на подменю
        this.style.display = 'block';
        this.style.opacity = 1;
    });

    submenu.addEventListener('mouseleave', function() {
        timeout = setTimeout(() => {
            this.style.opacity = 0; // Плавное исчезновение
            setTimeout(() => this.style.display = 'none', 300); // Скрываем подменю после анимации
        }, 200); // Задержка перед скрытием подменю
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".tmenu_item_link");

    menuItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation(); // <== Останавливаем всплытие

            const parent = this.parentElement;
            const submenu = parent.querySelector(".submenu");

            if (submenu) {
                if (submenu.classList.contains("open")) {
                    submenu.classList.remove("open");
                    submenu.style.display = "none";
                } else {
                    // Закрываем все другие открытые меню
                    document.querySelectorAll(".submenu.open").forEach(openMenu => {
                        openMenu.classList.remove("open");
                        openMenu.style.display = "none";
                    });

                    // Открываем текущее меню
                    submenu.style.display = "block";
                    submenu.classList.add("open");
                }
            }
        });
    });

    // Закрытие меню при клике вне него
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".tmenu_item")) {
            document.querySelectorAll(".submenu.open").forEach(openMenu => {
                openMenu.classList.remove("open");
                openMenu.style.display = "none";
            });
        }
    });
});
