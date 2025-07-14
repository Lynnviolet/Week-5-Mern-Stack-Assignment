import React, { useEffect, useState } from 'react';
import socket from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [usersOnline, setUsersOnline] = useState([]);

  // Handle connection and events
  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('typing', (name) => {
      setTypingUser(name);
      setTimeout(() => setTypingUser(''), 2000);
    });

    socket.on('userList', (list) => {
      setUsersOnline(list);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('userList');
    };
  }, []);

  // Handle user joining chat
  const handleJoin = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
    }
  };

  // Emit typing event
  const handleTyping = () => {
    socket.emit('typing');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      {!isJoined ? (
        <div>
          <h2>Enter your name to join the chat</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username} 👋</h2>
          <p>Online users: {usersOnline.join(', ')}</p>

          <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'scroll', marginTop: '1rem' }}>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}</strong> [{msg.time}]: {msg.msg}
              </div>
            ))}
            {typingUser && <p><em>{typingUser} is typing...</em></p>}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

