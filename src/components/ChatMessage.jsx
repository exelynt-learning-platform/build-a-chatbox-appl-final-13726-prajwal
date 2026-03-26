import React from "react";

const roleLabels = {
  user: "You",
  assistant: "AI"
};

const ChatMessage = React.memo(function ChatMessage({ message }) {
  const label = roleLabels[message.role] || message.role;
  return (
    <div className={`message-row ${message.role}`}>
      <div className="message-bubble">
        <div className="message-meta">{label}</div>
        <div className="message-text">{message.content}</div>
      </div>
    </div>
  );
});

export default ChatMessage;
