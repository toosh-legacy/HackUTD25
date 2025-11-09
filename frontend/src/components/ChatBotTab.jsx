import React, { useState } from 'react';
import '../css/ChatBotTab.css';

export default function ChatBotTab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || 'No response received.' },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to the chatbot.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-bot-container">
      {isOpen && (
        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="bot-message">Thinking...</div>}
          </div>
          <form onSubmit={sendMessage} className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about T-Mobile..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? 'Close Chat' : 'Personal Chat'}
      </button>
    </div>
  );
}
