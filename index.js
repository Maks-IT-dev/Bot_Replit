require('dotenv').config();
const { Bot, GrammyError, HttpError, InlineKeyboard } = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
require('./server');

// Ініціалізація бота з токеном з процесу середовища

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error("BOT_TOKEN is not defined in the environment variables.");
    process.exit(1); // Вихід з програми, якщо токен не знайдено
}

const bot = new Bot(token);
bot.use(hydrate());

// Тепер використовуйте escapedMessage для відправки


// Команди бота
bot.api.setMyCommands([
    { command: "start", description: "Запуск бота" },
    { command: "menu", description: "Отримати меню" },
]);

// Команда /start
bot.command("start", async (ctx) => {
    await ctx.react("🔥");
    await ctx.reply("Привіт, я \\- бот\\. Тг канал: \\[це силка\\]\\(https://t\\.me//TestBotLearn\\)", {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true
    });
});


// Кнопки та обробка команд
const menuKeyboard = new InlineKeyboard()
    .text("Дізнатися статус замовлення", "order-status")
    .text("Звернутись в підтримку", "support");
const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back");

bot.command("menu", async (ctx) => {
    await ctx.reply("Виберіть пункт меню", { reply_markup: menuKeyboard });
});

bot.callbackQuery("order-status", async (ctx) => {
    await ctx.editMessageText("Статус замовлення: в дорозі", { reply_markup: backKeyboard });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
    await ctx.editMessageText("Напишіть Ваш запит", { reply_markup: backKeyboard });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
    await ctx.editMessageText("Виберіть пункт меню", { reply_markup: menuKeyboard });
    await ctx.answerCallbackQuery();
});

// Функція для обробки помилок
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
    } else {
        console.error("Unknown error:", e);
    }
});

// Запуск бота
bot.start();
