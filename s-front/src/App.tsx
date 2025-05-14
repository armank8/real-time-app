import React, { useEffect, useState } from 'react';
import socket from './socket';

type ChatMessage = {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
};

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.on('load-messages',(messages:ChatMessage[])=>{
      setChat(messages);
    })
    socket.on('chat-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('load-messages');
      socket.off('chat-message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(message);
    socket.emit('chat-message', message);
    setMessage('');
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {chat.map((msg) => (
          <p key={msg._id}>{msg.sender} : { msg.content}</p>
        ))}
      </div>
    </div>
  );
};

export default App;

