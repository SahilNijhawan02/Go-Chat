package ws

import (
	"encoding/json"
	"go-chat-app/internal/db"
	"go-chat-app/internal/models"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var clients = make(map[*websocket.Conn]string)
var broadcast = make(chan []byte)
var mu sync.Mutex

// Handle incoming WebSocket connections
func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	// First message = username
	_, usernameMsg, err := conn.ReadMessage()
	if err != nil {
		log.Println("Username read error:", err)
		conn.Close()
		return
	}
	username := string(usernameMsg)

	// Add client safely
	mu.Lock()
	clients[conn] = username
	mu.Unlock()

	log.Println(username, "connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println(username, "disconnected")

			mu.Lock()
			delete(clients, conn)
			mu.Unlock()

			conn.Close()
			break
		}

		// ✅ Create structured message
		message := models.Message{
			User:    username,
			Content: string(msg),
			Time:    time.Now().Format("15:04"),
		}

		// ✅ Store in DB (temporary string format)
		_, err = db.DB.Exec(
			"INSERT INTO messages(content) VALUES($1)",
			message.User+": "+message.Content,
		)
		if err != nil {
			log.Println("DB error:", err)
		}

		// ✅ Convert to JSON
		jsonMsg, err := json.Marshal(message)
		if err != nil {
			log.Println("JSON error:", err)
			continue
		}

		// ✅ Send to channel
		broadcast <- jsonMsg
	}
}

// Broadcast messages to all clients
func HandleMessages() {
	for {
		msg := <-broadcast

		// Copy clients (avoid locking during network I/O)
		mu.Lock()
		clientsCopy := make([]*websocket.Conn, 0, len(clients))
		for client := range clients {
			clientsCopy = append(clientsCopy, client)
		}
		mu.Unlock()

		// Send message to all clients
		for _, client := range clientsCopy {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Println("Write error:", err)

				mu.Lock()
				client.Close()
				delete(clients, client)
				mu.Unlock()
			}
		}
	}
}
