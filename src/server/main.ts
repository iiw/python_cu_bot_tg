import express from "express";
import ViteExpress from "vite-express";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

(async () => {
  app.get("/hello", (_, res) => {
    res.send("Hello Vite + TypeScript!");
  });

  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000...")
  );

  const bot = new Telegraf(process.env.TG_TOKEN as string);

  // Set the bot API endpoint
  app.use(await bot.createWebhook({ domain: process.env.TG_DOMAIN as string }));

  bot.on("text", (ctx) => ctx.reply("Hello"));

  app.listen(process.env.TG_PORT, () =>
    console.log("Listening on port", process.env.TG_PORT)
  );
})();
