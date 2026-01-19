const BOT_TOKEN = "8235539837:AAEXwdmZp-wLQJTMvaEg12ZkFTMasgeA18Q";

const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf("BOT_TOKEN");

// Saytingiz internetga yuklangan bo'lishi shart (Vercel yoki GitHub Pages)
const WEB_LINK = "https://to-do-tg-bot.vercel.app";

bot.start((ctx) => {
  ctx.reply("Welcome to To Do List app! Click the button below to start this app.", Markup.keyboard([[Markup.button.webApp("To-Do List", WEB_LINK)]]).resize());
});

bot.launch();
console.log("Bot ishga tushdi...");
