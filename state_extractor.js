
const memory = require('./memory');

module.exports = function extractState(bot) {
  const pos = bot.entity.position;
  const inventory = bot.inventory.items().map(i => i.name + ' x' + i.count).join(', ');
  const nearbyBlocks = bot.findBlocks({ matching: () => true, maxDistance: 6, count: 6 })
    .map(p => {
      const b = bot.blockAt(p);
      return `${b.name} (${p.x},${p.y},${p.z})`;
    });

  if (!memory.data.base && bot.food > 10) {
    memory.data.base = { x: Math.floor(pos.x), y: Math.floor(pos.y), z: Math.floor(pos.z) };
    memory.save();
  }

  return {
    prompt: `
Ты Minecraft-бот. Твоя цель — расширить базу и добывать ресурсы для выживания.
Координаты: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})
Еда: ${bot.food}/20
ХП: ${bot.health}/20
Инвентарь: ${inventory || 'ничего'}
Рядом: ${nearbyBlocks.join(', ') || 'пусто'}
База: ${memory.data.base ? `(${memory.data.base.x},${memory.data.base.y},${memory.data.base.z})` : 'не выбрана'}
Выполни только 1 действие без объяснений: goTo(x,y,z), dig(x,y,z), craft(item), build(type), say("...")
    `.trim()
  };
};
