# Week-5-Mern-Stack-Assignment

# 💬 Real-Time Chat App (Week 5 - MERN Stack Assignment)

This is a real-time chat application built with **Socket.io**, **React**, **Node.js**, and **Express**. It supports both **public and private messaging**, notifications, reactions, and real-time updates. This project demonstrates full-duplex communication, state management, and user experience optimizations using modern web technologies.

---

## 📌 Features Implemented

### ✅ Core Features
- 👤 Username-based user authentication
- 💬 Global chat room (public messaging)
- ⌛ Typing indicators
- 👥 Online/offline status display

### ✅ Advanced Chat Features (Task 3)
- ✉️ Private messaging between users
- 💗 Emoji reactions to messages
- 🕓 Read receipts for private messages

### ✅ Real-Time Notifications (Task 4)
- 🔔 Join/leave chat alerts
- 📩 New message notifications (UI + sound + browser popups)
- 🔴 Unread message counter

### ✅ Performance & UX Optimization (Task 5)
- 🔽 Message pagination ("Load More")
- 🔁 Reconnection logic on disconnect
- ✅ Message delivery acknowledgments
- 🔍 Message search bar
- 📱 Mobile-friendly responsive design

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+ installed
- Git & browser access

### Clone the Repository

```bash
git clone https://github.com/Lynnviolet/Week-5-Mern-Stack-Assignment.git
cd Week-5-Mern-Stack-Assignment

Start the Server

bash
Copy
Edit
cd server
npm install
npm run dev
3. Start the Client

bash
Copy
Edit
cd client
npm install
npm run dev

🗂️ Folder Structure

pgsql
Copy
Edit
Week-5-Mern-Stack-Assignment/
├── client/
│   ├── public/
│   │   └── notify.mp3           # Sound alert
│   └── src/
│       ├── App.js               # Main application logic
│       ├── socket.js            # Socket connection handler
│       └── components/
│           ├── ChatRoom.js      # Public chat messages
│           └── PrivateChat.js   # Direct/private messaging
├── server/
│   └── index.js                 # Express + Socket.io server

📚 Built With
React.js – UI and frontend logic

Tailwind CSS – Styling and responsiveness

Socket.io – Real-time communication

Express.js + Node.js – Backend server

Browser APIs – Notifications and sound alerts

👩‍💻 Author
Lynn Violet Wanjiru Kimotho
