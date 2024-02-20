const mongoose = require('mongoose');

async function checkMongoDB() {
    try {
        // Подключение к MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/movies', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Получение статуса сервера MongoDB
        const adminDb = mongoose.connection.db.admin();
        const serverStatus = await adminDb.command({ serverStatus: 1 });

        // Вывод информации о соединениях
        console.log('Connections:', serverStatus.connections);

        // Закрытие соединения
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Запуск функции проверки MongoDB
checkMongoDB();
