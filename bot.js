const BOT_TOKEN = "8235539837:AAEXwdmZp-wLQJTMvaEg12ZkFTMasgeA18Q";

const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf("BOT_TOKEN");

// Saytingiz internetga yuklangan bo'lishi shart (Vercel yoki GitHub Pages)
const WEB_LINK = "https://sizning-saytingiz-manzili.vercel.app";

bot.start((ctx) => {
  ctx.reply("Xush kelibsiz! Tasklaringizni boshqarish uchun pastdagi tugmani bosing.", Markup.keyboard([[Markup.button.webApp("To-Do List", WEB_LINK)]]).resize());
});

bot.launch();
console.log("Bot ishga tushdi...");
