
const plan = require('./planner');
const memory = require('./memory');

module.exports = async function aiLoop(bot) {
  try {
    memory.load(); // загрузка памяти

    if (bot.food < 10) {
      bot.chat('Я голоден, ищу еду...');
      const food = bot.inventory.items().find(i => i.name.includes('apple') || i.name.includes('cooked'));
      if (food) {
        await bot.equip(food, 'hand');
        await bot.consume();
        return;
      }
    }

    await plan(bot);
    memory.save(); // сохранение памяти
  } catch (err) {
    bot.chat('Ошибка ИИ: ' + err.message);
  }
}
