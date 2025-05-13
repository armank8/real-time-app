import React, { useEffect, useState } from 'react';
import socket from './socket';
import { debounce } from 'lodash';

const App: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, []);

  const emitMessage = debounce((message:string)=>{
    socket.emit('chat-message',message);
  })

  useEffect(()=>{
    if(message !== ''){
      // socket.emit('chat-message',message);
      emitMessage(message);
    }
  },[message]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
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
        {chat.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default App;

