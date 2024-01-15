// Import required modules
const { createServer } = require("http");
const { Server } = require("socket.io");

// Create an HTTP server and attach Socket.IO to it
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Define an object to store users
const users = {};

// Event listener for a new connection
io.on("connection", (socket) => {
  // Event listener for a new user joining
  socket.on("new-user-joined", (Name) => {
    console.log("New user joined:", Name);
    users[socket.id] = Name;
    socket.broadcast.emit("user-joined", Name);
  });

  // Event listener for sending messages
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      Name: users[socket.id],
    });
  });

  // Event listener for disconnection
  socket.on("disconnect", (Name) => {
    console.log("User left:", Name);
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// Listen on port 8000
httpServer.listen(8000, () => {
  console.log("Server is running on port 8000");
});
