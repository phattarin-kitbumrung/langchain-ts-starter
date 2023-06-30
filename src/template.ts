import { LLMChain } from "langchain/chains"
import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"

export async function prompttemplate(city: string, country: string) {
    const model = new OpenAI({ temperature: 0 })
    const template = "How many people in {city} of {country}?"
    const prompt = new PromptTemplate({
      template,
      inputVariables: ["city","country"],
    })

    const chain = new LLMChain({ llm: model, prompt })
    const res = await chain.call({ city, country })
    console.log(res)
}
