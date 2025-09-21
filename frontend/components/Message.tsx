// src/components/Message.tsx

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

interface MessageProps {
  sender: "user" | "aska";
  text: string;
}

const AskaAvatar = () => (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
    </div>
);

const UserAvatar = () => (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    </div>
);

// --- Komponen Tombol Salin ---
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- PERBAIKAN DI SINI ---
  // Pastikan ada `return` untuk mengembalikan elemen JSX
  return (
    <button 
      onClick={handleCopy} 
      className="absolute -top-2 -right-2 rounded-full bg-zinc-800 p-1.5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
      aria-label="Salin teks"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      )}
    </button>
  );
};

export default function Message({ sender, text }: MessageProps) {
  const isUser = sender === "user";

  return (
    <div className={clsx("flex items-end gap-3 mb-4 px-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <AskaAvatar />}
      
      <div className="group relative">
        <div
          className={clsx(
            "max-w-full rounded-2xl px-4 py-2 text-sm text-white",
            "prose prose-sm prose-invert",
            "sm:max-w-[85%] md:max-w-[75%]",
            {
              "bg-zinc-700 rounded-br-none": isUser,
              "bg-purple-600 rounded-bl-none": !isUser,
            }
          )}
        >
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>

        {!isUser && text && <CopyButton text={text} />}
      </div>

      {isUser && <UserAvatar />}
    </div>
  );
}