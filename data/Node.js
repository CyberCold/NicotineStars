const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Путь к файлу, где будут храниться пользователи
const USERS_FILE = 'User.json';

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Чтение файла пользователей
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') return res.status(500).send("Error reading users file");

        // Если файл пустой, создаём пустой массив пользователей
        let users = data ? JSON.parse(data) : [];

        // Проверка на существование пользователя с таким же email
        const userExists = users.find(user => user.email === email);
        if (userExists) {
            return res.status(400).send("User with this email already exists.");
        }

        // Создание нового пользователя
        const newUser = {
            id: Date.now().toString(),
            email,
            password, // В реальности пароль должен быть хеширован
            address: 'Some address', // Пример адреса
            orders: [] // Пустой список заказов
        };

        // Добавляем нового пользователя в список
        users.push(newUser);

        // Сохраняем пользователей в файл
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send("Error writing to file");
            res.status(200).send({ success: true });
        });
    });
});

// Вход пользователя
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Чтение файла пользователей
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading users file");

        let users = JSON.parse(data);

        // Поиск пользователя с данным email и паролем
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            res.status(200).send({ success: true, userId: user.id, user });
        } else {
            res.status(400).send("Invalid credentials");
        }
    });
});

// Получение информации о пользователе
app.get('/get-user-info', (req, res) => {
    const userId = req.query.userId;

    // Чтение файла пользователей
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading users file");

        let users = JSON.parse(data);

        // Поиск пользователя по ID
        const user = users.find(user => user.id === userId);

        if (user) {
            res.status(200).send({ user });
        } else {
            res.status(404).send("User not found");
        }
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
