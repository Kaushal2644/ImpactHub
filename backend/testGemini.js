require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function test() {
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-pro'
  ]

  for (const modelName of models) {
    try {
      console.log(`\nTesting ${modelName}...`)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent('Say hello in one word')
      console.log(`✅ ${modelName} works:`, result.response.text())
      break
    } catch (err) {
      console.log(`❌ ${modelName} failed:`, err.message.slice(0, 150))
    }
  }
}

test()