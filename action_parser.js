
const { GoalBlock } = require('mineflayer-pathfinder').goals;

module.exports = async function executeAction(bot, command) {
  if (command.startsWith('goTo')) {
    const [x, y, z] = command.match(/-?\d+/g).map(Number);
    bot.pathfinder.setGoal(new GoalBlock(x, y, z));
  }

  if (command.startsWith('dig')) {
    const [x, y, z] = command.match(/-?\d+/g).map(Number);
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

  if (command.startsWith('build')) {
    const type = command.match(/build\(["'](.*?)["']\)/)[1];
    const pos = bot.entity.position;
    const placePos = {
      x: Math.floor(pos.x + 1),
      y: Math.floor(pos.y),
      z: Math.floor(pos.z)
    };
    const block = bot.inventory.items().find(i => i.name.includes(type));
    if (block) {
      try {
        await bot.equip(block, 'hand');
        await bot.placeBlock(bot.blockAt({ x: placePos.x, y: placePos.y - 1, z: placePos.z }), { x: placePos.x, y: placePos.y, z: placePos.z });
      } catch {}
    }
  }
};
