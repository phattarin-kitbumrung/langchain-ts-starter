import { OpenAI } from "langchain/llms/openai"
import { ConversationChain } from "langchain/chains"
import { BufferMemory } from "langchain/memory"
import { RedisChatMessageHistory } from "langchain/stores/message/redis"

const list = 
[
    {
        id: 1,
        name: 'Apple',
        price: 100
    },  
    {
        id: 2,
        name: 'Orange',
        price: 50
    },
    {
        id: 3,
        name: 'Banana',
        price: 99
    }
]

export async function conversationchain() {
    const model = new OpenAI({ temperature: 0 })
    const memory = new BufferMemory({
        chatHistory: new RedisChatMessageHistory({
          sessionId: new Date().toISOString(),
          sessionTTL: 300, 
          config: {
            url: "redis://localhost:6379", 
          },
        }),
    })
    const chain = new ConversationChain({ llm: model, memory })
    const res1 = await chain.call({ input: `What is the most expensive item from ${JSON.stringify(list)}` })
    const res2 = await chain.call({ input: "What is the most cheapest item?" })
    const res3 = await chain.call({ input: "How many items in the product list?" })

    console.log(res1)
    console.log(res2)
    console.log(res3)
}
