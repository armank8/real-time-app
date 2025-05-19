// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import dayjs from "dayjs";

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timeStamp?: string;
}

interface ChatProps {
  token: string;
}

export default function Chat({ token }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("load-messages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on("chat-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socketRef.current?.emit("chat-message", newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-3 bg-white p-4 rounded-xl shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm font-semibold">{msg.sender}</p>
            <p>{msg.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {msg.timeStamp
                ? dayjs(msg.timeStamp).format("HH:mm:ss")
                : "just now"}
            </p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 border rounded-xl px-4 py-2 mr-2"
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
