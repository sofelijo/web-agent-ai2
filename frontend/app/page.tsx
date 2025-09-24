"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type ChatMsg } from "@/components/ChatBox";

const NAVBAR_HEIGHT = "65px";

export default function Home() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: "aska",
      text: `Haii 👋 aku ASKA 🤖✨, Agent AI super canggih di SDN Semper Barat 01. Siap bantu semua pertanyaanmu! 📚✨

📝 Bantu ASKA jadi lebih baik dengan isi Form Feedback:  
[form feedback](https://forms.gle/iddvLkc4dZxxCTNx8)

🤖 Cobain versi Telegram:  
[@tanyaaska](https://t.me/tanyaaska_bot)

📘 Isi Pengetahuan ASKA :
- Profil sekolah 
- Regulasi SPMB, KJP, dan administrasi
- Kalender Akademik
- Tanya jawab seputar sekolah
`,
    },
  ]);


  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://web-agent-ai.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          chatHistory: [...messages, userMsg],
        }),
      });

      const data = await res.json(); // ← di sinilah res digunakan dengan benar

      const askaReply: ChatMsg = {
        sender: "aska",
        text: data.answer ?? "Maaf ya, ASKA belum bisa jawab 😅",
      };
      setMessages((prev) => [...prev, askaReply]);
    } catch (err) {
      console.error("ASKA error:", err);
    } finally {
      setLoading(false);
    }

  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT})` }}
    >
      <div className="flex-1 overflow-y-auto p-4">
        <ChatBox messages={messages} loading={loading} />
      </div>

      <div className="w-full bg-zinc-900 p-4">
        <div className="mx-auto flex w-full max-w-3xl gap-2">
          <Input
            className="bg-zinc-700 text-white border-zinc-600 placeholder:text-zinc-400"
            placeholder="Tanya ASKA ✨..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
          />
          <Button
            className="bg-purple-600 hover:bg-pink-500 text-white"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Tunggu..." : "Kirim 🚀"}
          </Button>
        </div>
      </div>
    </div>
  );
}
