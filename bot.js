const { Telegraf, Markup } = require("telegraf");

// Tokenni o'zgaruvchiga oling
const BOT_TOKEN = "8232438511:AAGD3PX6F90Qdf6WB9Nml3wIFpyy4IBseqc";

// O'zgaruvchini Telegraf'ga uzating (tirnoqlarsiz!)
const bot = new Telegraf(BOT_TOKEN);

const WEB_LINK = "https://to-do-tg-bot.vercel.app";

bot.start((ctx) => {
  ctx.reply("Welcome to To Do List app! Click the button below to start this app.", Markup.keyboard([[Markup.button.webApp("To-Do List", WEB_LINK)]]).resize());
});

bot
  .launch()
  .then(() => console.log("Bot muvaffaqiyatli ishga tushdi..."))
  .catch((err) => console.error("Botni ishga tushirishda xatolik:", err));

// Botni silliq to'xtatish (Xosting uchun muhim)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
