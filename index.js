
require('dotenv').config();
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const extractState = require('./state_extractor');
const getActionFromAI = require('./agent_core');
const executeAction = require('./action_parser');

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

  setInterval(async () => {
    const state = extractState(bot);
    const action = await getActionFromAI(state);
    if (action) {
      bot.whisper(bot.username, `🤖 AI решил: ${action}`);
      await executeAction(bot, action);
    }
  }, 8000);
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  if (!message.toLowerCase().includes('@бот')) return;

  const prompt = `Игрок "${username}" обращается: "${message}". Ответь кратко от имени Minecraft-бота.`;
  const reply = await getActionFromAI({ promptOnly: true, prompt });
  if (reply) bot.chat(reply.slice(0, 100));
});
// Мини-сервер, чтобы Railway думал что мы живы
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('🤖 Minecraft AGI Bot is running');
}).listen(PORT, () => {
  console.log(`[HTTP] Fake server listening on port ${PORT}`);
});
