import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/ChatBarTab.css';

export default function ChatBarTab() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-bar-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chat-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Content will go here */}
          </motion.div>
        )}
      </AnimatePresence>
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        )}
        <span className="chat-label">Personal Chat</span>
      </button>
    </div>
  );
}