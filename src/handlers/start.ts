import { Keyboard } from 'grammy'
import { Hears } from '../consts/hears'
import { BotContext } from '../types/bot-types'

const keyboard = new Keyboard()
  .text(Hears.AI_HELPER)
  .text(Hears.TEST_GENERATOR)
  .text(Hears.HELP)
  .resized()
  .persistent()

export async function startHandler(ctx: BotContext) {
  const name = ctx.from?.first_name ?? 'Легенда'

  await ctx.reply(
    `Привет, ${name}!      
Я твой универсальный ассистент. Вот что я умею:

🔒 *VPN*
/vpn — помощь с подключением VPN
/vpn\\_protocols — какой протокол выбрать
/vpn\\_fix — не работает VPN? разберём

🤖 *AI Ассистент*
/ai — задать любой вопрос

🖼 *Работа с изображениями* 
/img\\_crop — обрезать фото
/img\\_resize — изменить размер
/img\\_compress — сжать качество
/img\\_convert — конвертировать формат (jpg, png, webp)

📚 *Обучение*
/test — сгенерировать тест по теме
/explain — объяснить концепцию простыми словами

⚙️ *Прочее*
/help — список всех команд
        `,
    { reply_markup: keyboard }
  )
}
