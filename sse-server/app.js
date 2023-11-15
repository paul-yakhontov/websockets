const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

let connections = 0;

// Middleware для лічильника та виведення ресурсів
app.use((req, res, next) => {
  // Виведення кількості з'єднань в консоль
  console.log('Active connections:', connections);

  next();
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Надсилання подій кожну секунду
  const intervalId = setInterval(() => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
    // Отримання і виведення інформації про використання пам'яті
    const memoryUsage = process.memoryUsage();
    console.log('Memory usage:', formatBytes(memoryUsage.heapUsed));
  }, 1000);

  // Зупинка відправлення подій при закритті з'єднання клієнта
  req.on('close', () => {
    clearInterval(intervalId);
    connections--;

    // Виведення повідомлення про закриття та зменшення лічильника
    console.log('Connection closed. Total connections:', connections);
  });

  // Збільшення лічильника при новому з'єднанні
  connections++;

  // Виведення повідомлення про нове з'єднання та збільшення лічильника
  console.log('New connection. Total connections:', connections);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

// Допоміжна функція для форматування розміру пам'яті в байтах
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
