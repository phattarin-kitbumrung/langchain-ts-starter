import { CharacterTextSplitter, TokenTextSplitter } from "langchain/text_splitter"

export async function charactertextsplitter() {
    const text = "foo bar baz 123"

    const splitter = new CharacterTextSplitter({
        separator: " ",
        chunkSize: 1,
        chunkOverlap: 0,
    })
    
    const output = await splitter.createDocuments([text])
    console.log(output)
}

export async function tokentextsplitter() {
    const text = "foo bar baz 123"

    const splitter = new TokenTextSplitter({
      encodingName: "gpt2",
      chunkSize: 1,
      chunkOverlap: 0,
    })
    
    const output = await splitter.createDocuments([text])
    console.log(output)
}
