import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { message } from "telegraf/filters";
import { spawnSync } from "child_process";
const fs = require("node:fs/promises");
var crypto = require("crypto");

dotenv.config();

const bot = new Telegraf(process.env.TG_TOKEN as string);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a code in Python language"));
bot.on(message("text"), async (ctx) => {
  try {
    let isMention = false;
    if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
      isMention =
        ctx.message?.entities?.find((e) => e.type === "mention") !==
          undefined && ctx.message.text.indexOf("@python_cu_bot") !== -1;
    } else {
      isMention = ctx.chat.type === "private";
    }

    const code = ctx.message.text.replace("@python_cu_bot", "");

    if (isMention) {
      const name = crypto.randomBytes(20).toString("hex");
      const filename = `./${name}.py`;
      let fh = await fs.open(filename, "a");
      fh.write(code, 0, "utf-8");
      await fh.close();

      const python3 = await spawnSync("python3", [filename], { timeout: 2000 });
      await fs.unlink(filename);
      const output = python3.output
        .filter((buffer) => buffer != null)
        .map((buffer) => buffer?.toString())
        .join("")
        .slice(0, 2000);
      ctx.replyWithHTML(
        `<i>The work is done, ${ctx.from.first_name}!</i>\n\n<pre>${output}</pre>`
      );
    } else {
      // do nothing
    }
  } catch (e) {
    ctx.reply("Sorry, I'm a machine learning engineer. I code in Python!");
    console.log(e);
  }
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
