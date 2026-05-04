package main

import (
	"log"
	"net/http"

	"go-chat-app/internal/db"
	"go-chat-app/internal/handlers"
	"go-chat-app/internal/ws"
)

func main() {
	// Initialize database
	db.Init()

	// Start message broadcaster
	go ws.HandleMessages()

	// Routes
	http.HandleFunc("/ws", handlers.ChatWebSocketHandler)

	log.Println("🚀 Server running on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Server failed:", err)
	}
}
