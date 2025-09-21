"use client";

import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { ScrollArea } from "./ui/scroll-area";

export type ChatMsg = { sender: "user" | "aska"; text: string };

interface ChatBoxProps {
  messages: ChatMsg[];
  loading: boolean;
}

export default function ChatBox({ messages, loading }: ChatBoxProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [emoji, setEmoji] = useState("🤔");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ganti emoji setiap 600ms saat loading
  useEffect(() => {
    if (!loading) return;
    const emotes = ["🤔", "💭", "🧠", "💡"];
    let i = 0;
    const interval = setInterval(() => {
      setEmoji(emotes[i % emotes.length]);
      i++;
    }, 600);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <ScrollArea className="h-full w-full">
      {messages.map((msg, idx) => (
        <Message key={idx} sender={msg.sender} text={msg.text} />
      ))}

      {loading && (
        <div className="text-purple-400 text-sm italic mt-2 ml-2 flex items-center gap-1">
          <span>ASKA lagi mikir</span>
          <span>{emoji}</span>
          <span className="dots-loading" />
        </div>
      )}

      <div ref={endRef} />
    </ScrollArea>
  );
}
