import { useState } from "react";
import axios from "axios";
import chatbot from "@/assets/chat-bot.gif";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post(
        "http://localhost:5000/chat",
        { prompt: input }, // ✅ FIXED: gửi key "prompt"
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ để tương thích nếu backend set cookie/CORS
        }
      );
      setMessages([...newMessages, { role: "bot", text: res.data.response }]);
    } catch (err) {
      console.log("🚀 ~ sendMessage ~ err:", err);
      setMessages([
        ...newMessages,
        { role: "bot", text: "❌ Xin lỗi, đã có lỗi xảy ra!" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
        title="Chat với cửa hàng"
      >
        <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center">
          <img src={chatbot} alt="Chatbot icon" className="w-8 h-8" />
        </div>
      </button>

      {open && (
        <div className="mt-2 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] text-sm ${
                  m.role === "user"
                    ? "bg-blue-100 self-end text-right ml-auto"
                    : "bg-gray-100 self-start text-left mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
