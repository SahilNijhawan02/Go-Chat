package handlers

import (
	"net/http"

	"go-chat-app/internal/ws"
)

func ChatWebSocketHandler(w http.ResponseWriter, r *http.Request) {
	ws.HandleConnections(w, r)
}
