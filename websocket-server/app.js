const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
const PORT = 3001;

let connections = 0;

app.use(express.static('public'));

// Middleware для лічильника та виведення ресурсів
app.use((req, res, next) => {
  // Виведення кількості з'єднань в консоль
  console.log('Active connections:', connections);
  next();
});

io.on('connection', (socket) => {
  connections++;
  console.log('New connection. Total connections:', connections);

  // Відправлення подій кожну секунду
  const intervalId = setInterval(() => {
    socket.emit('message', `Data from server: ${new Date().toLocaleTimeString()}`);
    const memoryUsage = process.memoryUsage();
    console.log('Memory usage:', formatBytes(memoryUsage.heapUsed));
  }, 1000);

  // Зупинка відправлення подій при закритті з'єднання клієнта
  socket.on('disconnect', () => {
    clearInterval(intervalId);
    connections--;
    console.log('Connection closed. Total connections:', connections);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = app;
