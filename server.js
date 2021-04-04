require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = require("express")();
const http = require("http").Server(app);
const PORT = process.env.PORT || 8000;
const io = require("socket.io")(http, { cors: { origins: "*" } });

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.emit("connection", socket.id);
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.emit("disconnection", userId);
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
