
const { GoalBlock } = require('mineflayer-pathfinder').goals;
const utils = require('./utils');
const memory = require('./memory');

async function craft(bot, itemName, amount = 1) {
  const id = bot.registry.itemsByName[itemName]?.id;
  if (!id) return bot.chat(`❌ Не знаю, как скрафтить ${itemName}`);
  const recipe = bot.recipesFor(id)[0];
  if (!recipe) return bot.chat(`❌ Нет рецепта для ${itemName}`);
  await bot.craft(recipe, amount, null);
}

module.exports = async function plan(bot) {
  const logCount = utils.countItem(bot, 'log');
  const hasPick = bot.inventory.items().some(i => i.name.includes('pickaxe'));

  if (!hasPick && logCount >= 3) {
    bot.chat('Крафчу верстак и деревянную кирку...');
    await craft(bot, 'crafting_table');
    const table = bot.inventory.items().find(i => i.name === 'crafting_table');
    if (table) {
      await bot.equip(table, 'hand');
      const pos = bot.entity.position.offset(1, 0, 0);
      await bot.placeBlock(bot.blockAt(pos.offset(0, -1, 0)), pos);
    }
    await craft(bot, 'wooden_pickaxe');
    return;
  }

  if (logCount < 5) {
    const tree = utils.findTree(bot);
    if (tree) {
      bot.chat('Иду за деревом...');
      bot.pathfinder.setGoal(new GoalBlock(tree.position.x, tree.position.y, tree.position.z));
    } else {
      bot.chat('Не вижу деревьев...');
    }
    return;
  }

  if (!memory.data.base) {
    bot.chat('Запоминаю текущее место как базу.');
    memory.data.base = bot.entity.position;
    return;
  }

  bot.chat('Иду копать шахту около базы...');
  const minePos = memory.data.base.offset(3, 0, 3);
  bot.pathfinder.setGoal(new GoalBlock(minePos.x, minePos.y, minePos.z));
}
