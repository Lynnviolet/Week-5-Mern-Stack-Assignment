import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
export default socket;

// ===== 📁 client/src/components/ChatRoom.js =====
import React from 'react';

function ChatRoom({ messages, typingUser, reactToMessage }) {
  return (
    <div style={{ border: '1px solid gray', padding: '1rem', height: 300, overflowY: 'scroll' }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.username}</strong> [{msg.time}]: {msg.msg}
          {msg.reaction && <span> {msg.reaction}</span>}
          <button onClick={() => reactToMessage(index)}>👍</button>
        </div>
      ))}
      {typingUser && <p><em>{typingUser} is typing...</em></p>}
    </div>
  );
}

export default ChatRoom;

// ===== 📁 client/src/components/PrivateChat.js =====
import React from 'react';

function PrivateChat({ username, usersOnline, privateTo, setPrivateTo, privateMessage, setPrivateMessage, sendPrivate, privateMessages }) {
  return (
    <div>
      <h4>Send Private Message</h4>
      <select value={privateTo} onChange={(e) => setPrivateTo(e.target.value)}>
        <option value="">Select user</option>
        {usersOnline.filter(user => user !== username).map((user, idx) => (
          <option key={idx} value={user}>{user}</option>
        ))}
      </select>
      <input value={privateMessage} onChange={(e) => setPrivateMessage(e.target.value)} placeholder="Private message" />
      <button onClick={sendPrivate}>Send</button>

      <h4>Private Messages</h4>
      {privateMessages.map((pm, i) => (
        <div key={i}>
          <strong>{pm.from}</strong> [@ {pm.time}]: {pm.msg}
        </div>
      ))}
    </div>
  );
}

export default PrivateChat;

// ===== 📁 client/src/App.js =====
import React, { useEffect, useState } from 'react';
import socket from './socket';
import ChatRoom from './components/ChatRoom';
import PrivateChat from './components/PrivateChat';

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [usersOnline, setUsersOnline] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const [privateTo, setPrivateTo] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [privateMessages, setPrivateMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => setMessages((prev) => [...prev, data]));
    socket.on('typing', (name) => {
      setTypingUser(name);
      setTimeout(() => setTypingUser(''), 2000);
    });
    socket.on('userList', (list) => setUsersOnline(list));
    socket.on('readReceipt', (data) => setLastRead(data));
    socket.on('privateMessage', (data) => setPrivateMessages((prev) => [...prev, data]));
    socket.on('reaction', ({ index }) => {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[index]) updated[index].reaction = '👍';
        return updated;
      });
    });
    return () => socket.disconnect();
  }, []);

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessages((prev) => [...prev, { username, msg: message, time: new Date().toLocaleTimeString() }]);
      setMessage('');
    }
  };

  const handleTyping = () => socket.emit('typing');

  const sendPrivate = () => {
    if (privateTo && privateMessage.trim()) {
      socket.emit('privateMessage', { to: privateTo, msg: privateMessage });
      setPrivateMessages((prev) => [...prev, { from: username, msg: privateMessage, time: new Date().toLocaleTimeString() }]);
      setPrivateMessage('');
    }
  };

  const reactToMessage = (index) => socket.emit('reaction', { index });

  if (!isJoined) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Enter your name to join the chat</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Welcome, {username} 👋</h2>
      <p>Online: {usersOnline.join(', ')}</p>

      <ChatRoom messages={messages} typingUser={typingUser} reactToMessage={reactToMessage} />

      <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleTyping} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>

      {lastRead && <p><em>🕓 Last message read at {lastRead.time}</em></p>}

      <hr />
      <PrivateChat
        username={username}
        usersOnline={usersOnline}
        privateTo={privateTo}
        setPrivateTo={setPrivateTo}
        privateMessage={privateMessage}
        setPrivateMessage={setPrivateMessage}
        sendPrivate={sendPrivate}
        privateMessages={privateMessages}
      />
    </div>
  );
}

export default App;
