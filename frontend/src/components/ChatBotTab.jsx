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
      const res = await fetch('http://localhost:4000/api/chat/message', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error('Server response was not ok');
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
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
          <div className="chat-header">
            <h3>T-Mobile Assistant</h3>
          </div>
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot-message loading">Thinking...</div>}
          </div>
          <div className="chat-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about T-Mobile..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
              rows={1}
            />
            <button
              onClick={sendMessage}
              className="send-button"
              disabled={!input.trim() || loading}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? 'Close Chat' : 'Personal Chat'}
      </button>
    </div>
  );
}