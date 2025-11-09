import React, { useState } from 'react';
import '../css/ChatBotTab.css';

const CHAT_BOT_URL = 'https://webchat.botframework.com/embed/qna-t-mobile-bot-bot?s=YOUR_SECRET_HERE'; // Replace with your actual chat bot URL

export default function ChatBotTab() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chat-bot-container">
      {isOpen && (
        <div className="chat-content">
          <div style={{ height: "100%", width: "100%" }}>
            <iframe
              src={CHAT_BOT_URL}
              width="100%"
              height="100%"
              frameBorder="0"
              title="chat-bot"
              style={{ borderRadius: "8px" }}
            />
          </div>
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
        <span className="chat-label">Need Help?</span>
      </button>
    </div>
  );
}
