import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! How can I help with T-Mobile today?" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("/api/chat", { message: input });
      const reply = res.data.reply;
      setMessages([...newMessages, { from: "bot", text: reply }]);
    } catch {
      setMessages([...newMessages, { from: "bot", text: "Sorry, I had trouble connecting." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      {open ? (
        <div className="bg-white shadow-xl rounded-2xl w-80 h-96 flex flex-col">
          <div className="bg-pink-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <span>💬 T-Mobile Bot</span>
            <button onClick={() => setOpen(false)}>✖️</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${m.from==="bot" ? "bg-gray-100 text-left" : "bg-pink-100 text-right"}`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key==="Enter" && sendMessage()}
              className="flex-1 border rounded-l-lg p-2 text-sm"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-pink-600 text-white px-3 rounded-r-lg">Send</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-pink-600 text-white p-3 rounded-full shadow-lg text-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}
