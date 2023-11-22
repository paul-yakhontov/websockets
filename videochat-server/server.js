//імпорт залежностей
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

//Ініціалізація Express та HTTP-сервер

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

//Встановлюємо базовий роут

app.get("/", (req, res) => {
  res.send("Video chat server is running");
});

//Обробка подій через Socket.io
io.on("connection", (socket) => {
  console.log("New user connected");

  // Обробка подій WebRTC

  socket.on("call", (call) => {
    socket.broadcast.emit("call", call);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("cancel-candidate", (candidate) => {
    socket.broadcast.emit("cancel-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
