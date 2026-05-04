import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    const socket = new WebSocket("wss://go-chat.onrender.com/ws");

    socket.onopen = () => {
      console.log("CONNECTED");
      wsRef.current = socket; // ✅ assign AFTER open
      socket.send(username);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onerror = (err) => {
      console.log("Socket error:", err);
    };

    socket.onclose = () => {
      console.log("Socket closed");
    };

    return () => socket.close();
  }, [joined, username]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!wsRef.current) {
      console.log("Socket not ready");
      return;
    }

    if (input.trim() === "") return;

    wsRef.current.send(input);
    setInput(""); // ✅ FIXED (clears textbox)
  };

  // 🔐 JOIN SCREEN
  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

        <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl w-80">
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome 👋
          </h1>

          <p className="text-gray-400 text-sm text-center mb-6">
            Enter your name to join the chat
          </p>

          <input
            className="w-full p-3 rounded-xl bg-white/10 border border-white/10 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition mb-4"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-xl font-semibold transition"
            onClick={() => {
              if (username.trim()) setJoined(true);
            }}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  // 💬 CHAT UI
  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div className="text-lg font-semibold">GoChat</div>
        <div className="text-sm text-gray-400">{username}</div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.user === username;

          return (
            <div
              key={i}
              className={`flex flex-col ${
                isMe ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-500 mb-1">
                {msg.user} • {msg.time}
              </span>

              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
        <input
          className="flex-1 p-3 rounded-xl bg-gray-900 outline-none border border-gray-700 focus:border-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 px-5 rounded-xl font-medium"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;