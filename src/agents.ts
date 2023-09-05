import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { OpenAI } from "langchain/llms/openai"
import { SerpAPI } from "langchain/tools"


export async function executeAgents() {
    const model = new OpenAI({ temperature: 0 })
    const tools = [
      new SerpAPI(process.env.SERPAPI_API_KEY, {
        location: "Bangkok Thailand",
        hl: "en",
        gl: "th"
      })
    ]
    
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
      verbose: true
    })
    
    const input = "How many people in Bangkok of Thailand?"
    
    const result = await executor.call({
      input
    })
    
    console.log(result)
}
