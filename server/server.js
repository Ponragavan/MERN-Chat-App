const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const cors = require("cors");

const app = express();
dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.DB_URL)
  .then((con) => {
    console.log(`MongoDB connected to the host : ${con.connection.host}`);
  })
  .catch((error) => {
    console.log(error);
  });

// JSON
app.use(express.json());

// CORS usage
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));

// Route middleware
app.use("/api/auth", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const server = app.listen(5000, console.log("Server listening on port 5000"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log("User connected", userData._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("Chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    socket.leave(userData._id);
  });
});
