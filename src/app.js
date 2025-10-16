import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chatHistory", (history) => setMessages(history));
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
  }, []);

  const joinRoom = () => {
    socket.emit("joinRoom", room);
    setJoined(true);
  };

  const sendMessage = () => {
    const data = { room, user, message };
    socket.emit("sendMessage", data);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      {!joined ? (
        <div>
          <input placeholder="Your Name" value={user} onChange={e => setUser(e.target.value)} />
          <input placeholder="Room" value={room} onChange={e => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h3>Room: {room}</h3>
          <div style={{ height: "300px", overflowY: "scroll", border: "1px solid gray" }}>
            {messages.map((msg, index) => (
              <div key={index}><b>{msg.user}:</b> {msg.message}</div>
            ))}
          </div>
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type message..." />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
