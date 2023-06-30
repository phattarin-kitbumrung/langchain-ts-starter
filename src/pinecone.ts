import { OpenAI } from "langchain/llms/openai"
import { PineconeClient } from "@pinecone-database/pinecone"
import * as dotenv from "dotenv"
import { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { VectorDBQAChain } from "langchain/chains"
import { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/index.js"

dotenv.config()
let pineconeIndex: VectorOperationsApi

async function init() {
  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  })
  
  pineconeIndex = client.Index(process.env.PINECONE_INDEX as string)
}

export async function createdocs() {
  await init() 

  const docs = [
    new Document({
      metadata: { foo: "bar" },
      pageContent: "pinecone is a vector db",
    }),
    new Document({
      metadata: { foo: "bar" },
      pageContent: "the quick brown fox jumped over the lazy dog",
    }),
    new Document({
      metadata: { baz: "qux" },
      pageContent: "lorem ipsum dolor sit amet",
    }),
    new Document({
      metadata: { baz: "qux" },
      pageContent: "pinecones are the woody fruiting body and of a pine tree",
    }),
  ]
    
  await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
  })
}

export async function querydocs() { 
  await init()

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  )
  
  /* Search the vector DB independently with meta filters */
  const results = await vectorStore.similaritySearch("pinecone", 1, {
    foo: "bar",
  })
  console.log(results)
  /*
  [
    Document {
      pageContent: 'pinecone is a vector db',
      metadata: { foo: 'bar' }
    }
  ]
  */
  
  /* Use as part of a chain (currently no metadata filters) */
  const model = new OpenAI()
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  })
  const response = await chain.call({ query: "What is pinecone?" })
  console.log(response)
  /*
  {
    text: ' A pinecone is the woody fruiting body of a pine tree.',
    sourceDocuments: [
      Document {
        pageContent: 'pinecones are the woody fruiting body and of a pine tree',
        metadata: [Object]
      }
    ]
  }
  */
}
