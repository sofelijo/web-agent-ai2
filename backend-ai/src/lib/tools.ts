import { Calculator } from "@langchain/community/tools/calculator";
import { createRetrieverTool } from "langchain/tools/retriever";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import fs from "fs/promises";
import path from "path";

// Fungsi untuk membuat retriever dari file markdown
async function createSchoolRetriever() {
  const filePath = path.resolve(process.cwd(), "../KB/kecerdasan.md");
// ganti sesuai path file KB-mu
  const content = await fs.readFile(filePath, "utf-8");

  const document = new Document({
    pageContent: content,
    metadata: { source: "kecerdasan.md" },
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments([document]);

  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  return vectorstore.asRetriever({ k: 3 });
}

// Fungsi utama yang menyiapkan semua tools yang dipakai ASKA
export async function getAskaTools() {
  const schoolRetriever = await createSchoolRetriever();

  const schoolInfoTool = createRetrieverTool(schoolRetriever, {
    name: "pencari_info_sekolah",
    description:
      "Gunakan alat ini untuk mencari informasi spesifik tentang sekolah, siswa, atau guru di SDN Semper Barat 01. Jangan gunakan untuk pertanyaan umum.",
  });

  const calculatorTool = new Calculator();

  return [schoolInfoTool, calculatorTool];
}
