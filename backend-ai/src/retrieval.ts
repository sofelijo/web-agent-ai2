
import fs from "fs-extra";
import path from "path";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

export async function createRetriever() {
  const kbPath = path.resolve("..", "KB", "kecerdasan.md");
  const fileContent = await fs.readFile(kbPath, "utf-8");

  // ✅ Preprocessing: gabungkan nama + jabatan jadi 1 kalimat
  const cleanContent = fileContent.replace(
    /### (.+?)\n- \*\*Jabatan:\*\* (.+?)\n/g,
    (_, nama, jabatan) => `${nama} adalah ${jabatan}.\n`
  );

  // ✅ Split dokumen
  const splitter = new MarkdownTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments([cleanContent]);

  console.log("📄 Jumlah dokumen di vector store:", docs.length); // Debug log

  // ✅ Buat vector store
  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await FaissStore.fromDocuments(docs, embeddings);

  return vectorstore.asRetriever();
}
