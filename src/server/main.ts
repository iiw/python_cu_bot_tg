import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { message } from "telegraf/filters";
import { MessageEntity } from "telegraf/types";
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
var crypto = require("crypto");

dotenv.config();

const bot = new Telegraf(process.env.TG_TOKEN as string);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
bot.on(message("text"), async (ctx) => {
  let isMention = false;
  if (ctx.chat.type === "group") {
    isMention =
      ctx.message?.entities?.find((e) => e.type === "mention") !== undefined;
  } else {
    isMention = ctx.chat.type === "private";
  }
  const entity: MessageEntity.PreMessageEntity | undefined =
    ctx.message?.entities?.find(
      (e) => e.type === "pre"
    ) as MessageEntity.PreMessageEntity;
  const isPython = entity?.language === "python";

  const code = ctx.message.text.replace("@python_cu_bot", "");

  if (isPython && isMention) {
    const name = crypto.randomBytes(20).toString("hex");
    var filename = `./${name}.py`;
    let fh = await fs.open(filename, "a");
    fh.write(code, 0, "utf-8");
    await fh.close();

    const python3 = spawn("python3", [filename]);
    const results: string[] = [];
    await new Promise((resolve) => {
      python3.stdout.on("data", (data: any) => {
        results.push(data.toString());
        console.log(data.toString());
      });
      python3.stderr.on("data", (data: any) => {
        results.push(data.toString());
        console.log(data.toString());
        resolve(1);
      });
      python3.on("close", () => {
        console.log("close");
        resolve(1);
      });
    });
    await fs.unlink(filename);
    ctx.reply(`The work is done!\n\n${results.join("\n")}`);
  } else if (isMention) {
    ctx.reply("Sorry, I'm machine learning engineer. I code Python!");
  } else {
    // do nothing
  }
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
