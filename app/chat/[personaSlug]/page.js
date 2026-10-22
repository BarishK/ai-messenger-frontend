"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ChatPage() {
  const params = useParams();
  const personaSlug = params?.personaSlug;
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!personaSlug) return;

    const fetchChatHistory = async () => {
      try {
        const res = await api.get(`/chat/${personaSlug}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Geçmiş mesajlar yüklenemedi:", err);
      }
    };

    fetchChatHistory();
  }, [personaSlug, router]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    setInputMessage("");

    setMessages((prev) => [...prev, { sender: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await api.post(`/chat/${personaSlug}`, { message: userText });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: res.data.aiResponse },
      ]);
    } catch (err) {
      console.error("Mesaj gönderme hatası:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Bir hata oluştu, lütfen tekrar dene." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
        >
          ← Geri
        </button>
        <h1 className="font-semibold capitalize text-lg">{personaSlug}</h1>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl rounded-bl-none text-sm text-gray-400 animate-pulse">
              Yazıyor...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2"
      >
        <input
          type="text"
          placeholder="Bir mesaj yazın..."
          className="flex-1 p-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 text-sm"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
        >
          Gönder
        </button>
      </form>
    </div>
  );
}
