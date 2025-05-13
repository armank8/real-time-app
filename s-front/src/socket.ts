import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // match backend port

export default socket;
