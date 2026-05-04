# 💬 GoChat

A lightweight, concurrent **real-time chat application built in Go**, using WebSockets for communication and PostgreSQL for persistence.

👉 **Live Demo:** https://go-chat-h1jw.onrender.com/

---

## 🚀 Overview

GoChat is a backend-driven chat system designed to showcase **Golang concurrency in action**.

- Each user connection runs in a separate **goroutine**
- Messages flow through a centralized **channel-based broadcaster**
- Shared state is protected using **mutex**
- Messages are persisted in **PostgreSQL**

The frontend is minimal and acts only as a WebSocket client.

---

## ⚙️ Core Go Concepts Used

### 🔹 Goroutines
- Each client connection runs independently
- Enables scalable real-time communication

### 🔹 Channels
- A central `broadcast` channel manages message flow
- Decouples message producers and consumers

### 🔹 Mutex (`sync.Mutex`)
- Protects shared `clients` map
- Prevents race conditions during concurrent access

---

## 🧠 Architecture

```
Client → WebSocket → HandleConnections (goroutine)
                     ↓
                broadcast channel
                     ↓
            HandleMessages (single goroutine)
                     ↓
           All connected clients
```

---

## 🏗️ Tech Stack

### Backend (Primary)
- Go (Golang)
- Gorilla WebSocket
- PostgreSQL

### Frontend (Minimal)
- React.js
- Tailwind CSS

### Deployment
- Render (Backend + Database)

---

## 📂 Project Structure

```
go-chat-app/

cmd/server/main.go        → Entry point

internal/
  db/                     → Database connection
  handlers/               → HTTP handlers
  models/                 → Message struct
  ws/                     → WebSocket logic

web/frontend/             → UI (optional layer)
```

---

## 🔄 Request Flow

1. User enters username and connects to `/ws`
2. Server upgrades HTTP → WebSocket
3. Connection is handled in a goroutine
4. Message is:
   - Read from connection
   - Converted to struct
   - Sent to `broadcast` channel
5. Broadcaster sends message to all clients
6. Message is stored in PostgreSQL

---

## 🗄️ Database Schema

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_name TEXT,
    content TEXT,
    time TEXT
);
```

---

## ▶️ Running Locally

### Backend

```bash
go mod tidy
go run cmd/server/main.go
```

### Frontend

```bash
cd web/frontend
npm install
npm start
```

---

## 🌐 Deployment

- Backend hosted on Render  
- PostgreSQL hosted on Render  
- Frontend served via Go static files  

---

## 🔥 Key Highlights

- Demonstrates **real-world concurrency in Go**
- Clean separation of layers (handlers, ws, db)
- Efficient broadcast system using channels
- Persistent message storage

---

## 🚀 Future Improvements

- Chat rooms (multiple channels)
- Load previous messages on join
- Online/offline user tracking
- Typing indicators
- Authentication system

---

## 👨‍💻 Author

**Sahil Nijhawan**

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ and building on top of it!
