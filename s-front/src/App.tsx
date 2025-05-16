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

  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');
const [token, setToken] = useState(localStorage.getItem('token') || '');

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

  const register = async () => {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  window.location.reload();
};

const login = async () => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  window.location.reload();
};

  return (
    <div>
      <h1>Real-time Chat</h1>
      <form onSubmit={sendMessage}>
        <input type="text" className="input input-success outline-0"
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

