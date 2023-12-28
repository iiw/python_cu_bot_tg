import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { message } from "telegraf/filters";

dotenv.config();

const bot = new Telegraf(process.env.TG_TOKEN as string);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
