/* This TypeScript code is setting up a server using Express.js and Socket.io for real-time
communication. Here's a breakdown of what the code is doing: */
import { connectDB } from "./startup/db";
import { logger } from "./startup/logger";
import { prod } from "./startup/prod";
import { routes } from "./startup/routes";
import express from "express";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/userModel";


const app = express();
// app.set("view engine", "ejs")

logger;
routes(app);
connectDB();
prod(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers: { userId: string; socketId: string }[] = [];


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;

  if (userId) {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("online users", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);

    socket.on("sendMessage", (message) => {
      const recipientSocket = onlineUsers.find(
        (user) => user.userId === message.recipientId
      );
      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit("getMessage", message);
      } else {
        console.warn("Recipient not found:", message.recipientId);
        // You can emit an error message to the sender here
      }

    });
  }

  socket.on("disconnect", (reason) => {
    console.log("User disconnected:", reason, socket.id);
    if (userId) {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("User disconnected", socket.id);
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});
  

const server = httpServer.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});

export default server;
