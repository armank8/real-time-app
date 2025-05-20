import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import Message from "./models/Message.js";
import { timeStamp } from "console";
await connectDB();
import authRoutes from "./routes/auth.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update this with your frontend URL
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Socket.IO server is up and running");
});

app.use("/api/auth", authRoutes);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log(token);
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
      email: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("User not found"));

    socket.data.user = user; // Attach user to socket
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

// socket io
io.on("connection", async (socket) => {
  // console.log("A user connected:", socket.id);
  const user = socket.data.user;
  console.log(`${user.name} connected`);

  // 1. Send previous messages / Load messages
  const messages = await Message.find().sort({ timeStamp: 1 }).limit(50);
  socket.emit("load-messages", messages); // sends to newly connected clients

  // Receive + store + broadcast
  socket.on("chat-message", async (msg) => {
   
console.log("hell",msg);
    const newMsg = await Message.create({
      sender: user.name,
      content: msg.content,
    });

    await newMsg.save();

    io.emit("chat-message", newMsg); // broadcast to all clients // emit entire message object
  });

  // Triggered when a client disconnects.
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// PORT & Listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
