import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, sendMessage } from "./store/chatSlice";
import ChatMessage from "./components/ChatMessage";

export default function App() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || loading) {
      return;
    }
    dispatch(sendMessage(trimmed));
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChange = (event) => {
    if (error) {
      dispatch(clearError());
    }
    setDraft(event.target.value);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-title">
          <span className="badge">Chatbox</span>
          <h1>OpenAI Assistant</h1>
        </div>
        <p className="subtitle">
          Ask a question and receive a real-time response from the AI.
        </p>
      </header>

      <section className="chat-card">
        <div className="chat-window" ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="message-row assistant">
              <div className="message-bubble typing">
                <div className="message-meta">AI</div>
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="composer">
          <textarea
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={loading}
            aria-label="Message input"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !draft.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </section>
    </div>
  );
}
