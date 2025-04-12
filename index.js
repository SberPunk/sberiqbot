
require('dotenv').config();
const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const extractState = require('./state_extractor');
const getActionFromAI = require('./agent_core');
const executeAction = require('./action_parser');
const memory = require('./memory');

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
  memory.load();

  setInterval(async () => {
    try {
      const state = extractState(bot);
      const action = await getActionFromAI(state);
      if (action) {
        await executeAction(bot, action);
      }
    } catch (err) {
      console.log('[AGENT ERROR]', err.message);
    }
  }, 1000);
});

bot.on('chat', async (username, message) => {
  if (username === bot.username) return;
  if (!message.toLowerCase().includes('@бот')) return;

  const prompt = `Игрок "${username}" пишет: "${message}". Ответь коротко и по делу. Не рассуждай.`;
  const reply = await getActionFromAI({ promptOnly: true, prompt });
  if (reply) bot.chat(reply.slice(0, 100));
});

process.on('exit', () => memory.save());
process.on('SIGINT', () => process.exit());
