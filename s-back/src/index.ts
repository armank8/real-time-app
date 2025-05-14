import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import Message from "./models/Message.js";
import { timeStamp } from "console";
await connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update this with your frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Socket.IO server is up and running");
});

// socket io
io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);

  // 1. Send previous messages
  const messages = await Message.find().sort({ timeStamp: 1 }).limit(50);
  socket.emit("load-messages", messages);  // sends to newly connected clients

  // 2. Receive new message
  socket.on("chat-message", async (msg) => {
    const newMsg = new Message({
      sender: "Anonymous", // You’ll replace with actual username later
      content: msg,
    });

    await newMsg.save();

    io.emit("chat-message", newMsg); // broadcast to all clients // emit entire message object
  });

  // Triggered when a client disconnects.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
