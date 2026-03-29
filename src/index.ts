import http from 'http'
import { bot } from './bot'
import { globalContext, YCContext } from './config/context'

export const handler = async function (event: any, context: YCContext) {
  globalContext.context = context

  try {
    await bot.init()
    await bot.handleUpdate(JSON.parse(event.body))
  } catch (e) {
    console.error('Failed to handle update:', (e as Error).message)
  }

  return { statusCode: 200, body: '' }
}

if (!process.env.FUNCTION_NAME) {
  bot.start({
    onStart: () => {
      console.log('Bot started')
    },
  })
}

const PORT = process.env.PORT || 3000
http
  .createServer((_, res) => {
    res.writeHead(200)
    res.end('Bot is alive!')
  })
  .listen(PORT)
