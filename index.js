
require('dotenv').config();
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const aiLoop = require('./ai_core');
const chatAI = require('./chat_ai');
const fs = require('fs');

const bot = mineflayer.createBot({
  host: process.env.MC_HOST,
  port: parseInt(process.env.MC_PORT),
  username: process.env.MC_USERNAME
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);
  bot.chat('Привет! Я ИИ-бот и начинаю выживание...');
  setInterval(() => aiLoop(bot), 8000);
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  const reply = await chatAI(username, message);
  bot.chat(reply.slice(0, 100));
});
