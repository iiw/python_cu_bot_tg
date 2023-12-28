import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { message } from "telegraf/filters";
import { MessageEntity } from "telegraf/types";
import { spawnSync } from "child_process";
const fs = require("node:fs/promises");
var crypto = require("crypto");

dotenv.config();

const bot = new Telegraf(process.env.TG_TOKEN as string);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.on(message("text"), async (ctx) => {
  try {
    let isMention = false;
    // const entity: MessageEntity.PreMessageEntity | undefined =
    //   ctx.message?.entities?.find(
    //     (e) => e.type === "pre"
    //   ) as MessageEntity.PreMessageEntity;
    // let isPython = entity?.language === "python";
    if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
      isMention =
        ctx.message?.entities?.find((e) => e.type === "mention") !== undefined;
      // isPython = true
    } else {
      isMention = ctx.chat.type === "private";
    }

    const code = ctx.message.text.replace("@python_cu_bot", "");

    if (isMention) {
      const name = crypto.randomBytes(20).toString("hex");
      var filename = `./${name}.py`;
      let fh = await fs.open(filename, "a");
      fh.write(code, 0, "utf-8");
      await fh.close();

      // const results: string[] = [];
      const python3 = await spawnSync("python3", [filename], { timeout: 2000 });
      await fs.unlink(filename);
      const output = python3.output.toString().slice(0, 1000);
      ctx.replyWithHTML(
        `<i>The work is done, ${ctx.from.first_name}!</i>\n\n<pre>${output}</pre>`
      );
    } else {
      // do nothing
    }
  } catch (e) {
    ctx.reply("Sorry, I'm machine learning engineer. I code Python!");
    console.log(e);
  }
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
