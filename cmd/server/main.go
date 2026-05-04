package main

import (
	"log"
	"net/http"
	"os"

	"go-chat-app/internal/db"
	"go-chat-app/internal/handlers"
	"go-chat-app/internal/ws"
)

func main() {
	// Initialize database
	db.Init()

	// Start message broadcaster
	log.Println("HandleMessages started")
	go ws.HandleMessages()

	// Routes
	http.HandleFunc("/ws", handlers.ChatWebSocketHandler)
	http.Handle("/", http.FileServer(http.Dir("./web/frontend/build")))

	// 🔥 FIX: use dynamic port for Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback for local
	}

	log.Println("🚀 Server running on port:", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Server failed:", err)
	}
}
