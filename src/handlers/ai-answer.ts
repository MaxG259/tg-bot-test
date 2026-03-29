import { markdownToHtml } from '../lib/formatMarkdown'
import { askDeepSeek } from '../services/ai'
import { BotContext } from '../types/bot-types'

export async function AiAnswerHandler(
  ctx: BotContext,
  next: () => Promise<void>
) {
  const message = ctx.message?.text
  const isGroup = ctx.chat?.type !== 'private'

  // В группе отвечаем сразу, в личке — только если waitingForAI
  if (!isGroup && !ctx.session.waitingForAI) {
    return next()
  }

  if (!message) {
    return next()
  }

  ctx.session.waitingForAI = false

  const thinkingMessage = await ctx.reply('🎤')

  try {
    // Убираем упоминание бота из текста перед отправкой
    const cleanMessage = message.replace(/@\w+/g, '').trim()
    const response = await askDeepSeek(cleanMessage || message)
    await ctx.reply(markdownToHtml(response), { parse_mode: 'HTML' })

    if (!isGroup) {
      ctx.session.waitingForAI = true
    }
  } catch (error) {
    console.error(error)
    await ctx.reply('чёт сломался бро 💀')
  } finally {
    await ctx.api.deleteMessage(ctx.chat!.id, thinkingMessage.message_id)
  }

  return next()
}
