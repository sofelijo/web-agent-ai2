import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { agentPrompt } from "./prompts/agentPrompt.js";
import {
  RunnableSequence,
  RunnablePassthrough,
  type Runnable,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function buildQAChain(): Promise<
  Runnable<{ input: string; chat_history?: string; guru?: string }, string>
> {
  const filePath = path.resolve("..", "KB", "kecerdasan.md");
  const content = await fs.readFile(filePath, "utf-8");

  const doc = new Document({
    pageContent: content,
    metadata: { source: "kecerdasan.md" },
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments([doc]);

  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  const retriever = vectorstore.asRetriever({ k: 3 });

  const llm = new ChatOpenAI({
    temperature: 0.3,
    modelName: "gpt-4o",
  });

  const chain: Runnable<{ input: string; chat_history?: string; guru?: string }, string> =
    RunnableSequence.from([
      RunnablePassthrough.assign({
        context: async (input: { input: string; chat_history?: string; guru?: string }) => {
          const docs = await retriever.invoke(input.input);
          return docs.map((d) => d.pageContent as string).join("\n\n");
        },
      }),
      agentPrompt,
      llm,
      new StringOutputParser(),
    ]);

  return chain;
}
