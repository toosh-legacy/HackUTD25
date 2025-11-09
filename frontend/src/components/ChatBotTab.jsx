import React, { useState } from 'react';
import '../css/ChatBotTab.css';

export default function ChatBotTab() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chat-bot-container">
      {isOpen && (
        <div className="chat-content">
          <p>Welcome to Personal Chat!</p>
        </div>
      )}

      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? (
          // Up arrow
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 15 12 9 18 15" />
          </svg>
        ) : (
          // Down arrow
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
        <span className="chat-label">Personal Chat</span>
      </button>
    </div>
  );
}
