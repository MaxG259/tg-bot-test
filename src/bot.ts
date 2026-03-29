import 'dotenv/config'
import { Bot, session } from 'grammy'
import { AiAnswerHandler } from './handlers/ai-answer'
import { BotContext, SessionData } from './types/bot-types'

const BOT_TOKEN = process.env.BOT_TOKEN

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set in .env file')
}

export const bot = new Bot<BotContext>(BOT_TOKEN)

bot.use(
  session<SessionData, BotContext>({
    initial: () => ({
      waitingForAI: false,
    }),
  })
)

bot.command('start', (ctx) => {
  ctx.reply('Ё, я Big Bot 🎤 Спрашивай про рэп')
})

bot.on('message:text', async (ctx, next) => {
  const text = ctx.message?.text ?? ''
  const botUsername = ctx.me.username

  if (ctx.chat.type !== 'private' && !text.includes(`@${botUsername}`)) {
    return next() // игнорируем если не упоминают
  }

  return AiAnswerHandler(ctx, next)
})
