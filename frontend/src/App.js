import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api/chat"; // Change this to your backend URL after deployment

export default function GeminiChat() {
  const [userId, setUserId] = useState("user1");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/history/${userId}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(console.error);
  }, [userId]);

  const sendPrompt = async () => {
    if (!prompt || !userId) return alert("Enter userId and prompt");

    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, userId }),
    });
    const text = await res.text();
    setResponse(text);
    setPrompt("");

    // Refresh history
    fetch(`${API_BASE}/history/${userId}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(console.error);
  };

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "#e0f2fe",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      }}
    >
      <h2 style={{ color: "#38bdf8", marginBottom: 20 }}>🤖 Gemini AI Chat</h2>

      <div style={{ marginBottom: 20 }}>
        <label>User ID: </label>
        <input
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{
            backgroundColor: "#1e293b",
            color: "#e0f2fe",
            border: "1px solid #38bdf8",
            padding: "5px 10px",
            borderRadius: 6,
          }}
        />
      </div>

      <div style={{ width: "100%", maxWidth: 600 }}>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: 20,
            borderRadius: 12,
            height: 400,
            overflowY: "auto",
            marginBottom: 20,
          }}
        >
          {history.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No chat history for this user.</div>
          ) : (
            history.map(chat => (
              <div key={chat.id} style={{ marginBottom: 15 }}>
                <div
                  style={{
                    backgroundColor: "#0ea5e9",
                    padding: 10,
                    borderRadius: 12,
                    marginBottom: 5,
                    alignSelf: "flex-end",
                    color: "#0f172a",
                  }}
                >
                  <b>You:</b> {chat.userMessage}
                </div>
                <div
                  style={{
                    backgroundColor: "#334155",
                    padding: 10,
                    borderRadius: 12,
                    color: "#e0f2fe",
                  }}
                >
                  <b>Gemini:</b> {chat.botResponse}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {new Date(chat.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <textarea
          rows={3}
          placeholder="Type your message..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#1e293b",
            color: "#e0f2fe",
            border: "2px solid #38bdf8",
            borderRadius: 8,
            outline: "none",
            resize: "none",
            boxShadow: "0 0 8px #38bdf8",
          }}
        />

        <button
          onClick={sendPrompt}
          style={{
            marginTop: 10,
            backgroundColor: "#38bdf8",
            color: "#0f172a",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 10px #38bdf8",
          }}
        >
          Send
        </button>

        {response && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ color: "#38bdf8" }}>Latest Response</h3>
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: 10,
                borderRadius: 8,
                whiteSpace: "pre-wrap",
                marginBottom: 10,
              }}
            >
              <strong style={{ color: "#38bdf8" }}>Prompt:</strong>{" "}
              {history.length > 0
                ? history[history.length - 1].userMessage
                : prompt}
            </div>
            <div
              style={{
                backgroundColor: "#334155",
                padding: 10,
                borderRadius: 8,
                whiteSpace: "pre-wrap",
              }}
            >
              <strong style={{ color: "#38bdf8" }}>Gemini:</strong> {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
