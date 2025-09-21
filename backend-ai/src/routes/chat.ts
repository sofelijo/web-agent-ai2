import express from "express";
import { buildQAChain } from "../buildQAChain.js";

const router = express.Router();

type ChatMsg = { sender: "user" | "aska"; text: string };

// Daftar guru untuk acakan
const guruList = [
  
  "Pak Ilan",
  "Bu Kartika",
  "Pak Tomo",
  "Bu Yuni",
  "Pak Adi",
  "Bu Siti",
  "Bu Lutfi",
  "Bu Sarah",,
  "Pak Arief",
];

function pickRandomGuru() {
  return guruList[Math.floor(Math.random() * guruList.length)];
}

router.post("/", async (req, res) => {
  const { question, chatHistory = [] } = req.body as {
    question: string;
    chatHistory?: ChatMsg[];
  };

  try {
    const chain = await buildQAChain();

    // Format history menjadi teks linear
    const historyText = chatHistory
      .map((msg) => `${msg.sender === "user" ? "User" : "ASKA"}: ${msg.text}`)
      .join("\n");

    const response = await chain.invoke({
      input: question,
      chat_history: historyText,
      guru: pickRandomGuru(), // ✅ inject guru random di sini
    });

    res.json({
      answer: response,
    });
  } catch (err) {
    console.error("Error in /chat:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
