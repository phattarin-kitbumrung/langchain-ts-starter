import express from 'express'
import { conversationchain } from 'conversation.ts'
import { prompttemplate } from 'template.ts'
import { charactertextsplitter, tokentextsplitter } from 'textsplitter.ts'
import { createdocs, querydocs } from './pinecone.ts'

const app = express()
const port = 3000

app.listen(port, async () => {       
    console.log( `server started at http://localhost:${port}`)
    await conversationchain()
    await prompttemplate('Bangkok', 'Thailand')
    await charactertextsplitter()
    await tokentextsplitter()
    await createdocs()
    await querydocs()
})
