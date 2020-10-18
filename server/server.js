var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => res.send("hello!"));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (msg) => {
    console.log(msg);
    socket.broadcast.emit("message-broadcast", msg);
  });
  socket.on("user-typing", (user) => {
    socket.broadcast.emit("typing-broadcast", user);
  });
  socket.on("user-stopped-typing", (user) => {
    console.log("stopped typing");
    socket.broadcast.emit("typing-stopped-broadcast", user);
  });
  socket.on("message-read", () => {
    console.log("message-read");
    socket.broadcast.emit("message-read-broadcast");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
