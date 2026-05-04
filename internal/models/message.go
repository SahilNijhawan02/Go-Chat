package models

type Message struct {
	User    string `json:"user"`
	Content string `json:"content"`
	Time    string `json:"time"`
}
