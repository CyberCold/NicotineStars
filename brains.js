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
    const userId = getUserId(); // Получаем ID пользователя (например, из sessionStorage или cookie)
    
    // Отправляем данные на сервер
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, product })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Ответ от сервера:", data);
    })
    .catch(error => {
        console.error("Ошибка при отправке данных:", error);
    });
}

// Изменяем обработчик кнопки "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = {
            name: this.getAttribute('data-name'),
            price: parseFloat(this.getAttribute('data-price')),
            quantity: 1,
            id: this.getAttribute('data-id'),
            image: this.getAttribute('data-image')
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
    
            updateCart();
        } else {
            cart.style.display = 'none';  
            cartOpen = false;
        }
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
    }
     
});


document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".tmenu_item");

    menuItems.forEach(item => {
        const submenu = item.querySelector(".submenu");

        if (!submenu) return;

        let hideTimeout; // Таймер скрытия подменю

        item.addEventListener("mouseenter", function () {
            clearTimeout(hideTimeout);
            closeAllSubmenus(); // Закрываем все остальные подменю
            submenu.style.display = 'block';
        });

        item.addEventListener("mouseleave", function (event) {
            hideTimeout = setTimeout(() => {
                if (!submenu.contains(event.relatedTarget)) {
                    submenu.style.display = 'none';
                }
            }, 100);
        });

        submenu.addEventListener("mouseenter", function () {
            clearTimeout(hideTimeout);
        });

        submenu.addEventListener("mouseleave", function (event) {
            if (!submenu.contains(event.relatedTarget)) {
                submenu.style.display = 'none';
            }
        });
    });

    function closeAllSubmenus() {
        document.querySelectorAll(".submenu").forEach(submenu => {
            submenu.style.display = 'none';
        });
    }
});

const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/add-to-cart', (req, res) => {
    const { userId, product } = req.body;

    // Чтение данных пользователей из файла
    fs.readFile('Users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Ошибка при чтении данных");
        }

        let users = JSON.parse(data);
        let user = users.find(user => user.id === userId);

        if (user) {
            // Проверяем, есть ли корзина, если нет - создаём
            if (!user.cart) {
                user.cart = [];
            }

            // Проверяем, есть ли товар в корзине
            const existingProductIndex = user.cart.findIndex(item => item.id === product.id);
            if (existingProductIndex !== -1) {
                user.cart[existingProductIndex].quantity += 1;  // Увеличиваем количество
            } else {
                user.cart.push(product);  // Добавляем новый товар
            }

            // Сохраняем данные пользователей обратно в файл
            fs.writeFile('Users.json', JSON.stringify(users, null, 2), 'utf8', (err) => {
                if (err) {
                    return res.status(500).send("Ошибка при сохранении данных");
                }

                res.status(200).send("Товар добавлен в корзину");
            });
        } else {
            res.status(404).send("Пользователь не найден");
        }
    });
});

app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});

// Функция для получения корзины пользователя с сервера
function getCart(userId) {
    fetch(`/get-cart?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        // Обновляем корзину на странице, используя данные с сервера
        updateCart(data.cart);
    })
    .catch(error => {
        console.error("Ошибка при получении данных корзины:", error);
    });
}
