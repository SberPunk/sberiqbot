
const { GoalBlock } = require('mineflayer-pathfinder').goals;

module.exports = async function executeAction(bot, command) {
  if (command.startsWith('goTo')) {
    const [x, y, z] = command.match(/\d+/g).map(Number);
    bot.pathfinder.setGoal(new GoalBlock(x, y, z));
  }

  if (command.startsWith('dig')) {
    const [x, y, z] = command.match(/\d+/g).map(Number);
    const block = bot.blockAt({ x, y, z });
    if (block) {
      try {
        await bot.dig(block);
      } catch {}
    }
  }

  if (command.startsWith('craft')) {
    const item = command.match(/craft\(["'](.*?)["']\)/)[1];
    const id = bot.registry.itemsByName[item]?.id;
    const recipe = bot.recipesFor(id)?.[0];
    if (recipe) await bot.craft(recipe, 1, null);
  }

  if (command.startsWith('say')) {
    const text = command.match(/say\(["'](.*?)["']\)/)[1];
    bot.chat(text);
  }
};
