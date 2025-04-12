
module.exports = function extractState(bot) {
  const pos = bot.entity.position;
  const inventory = bot.inventory.items().map(i => i.name + ' x' + i.count).join(', ');
  const nearbyBlocks = bot.findBlocks({ matching: () => true, maxDistance: 6, count: 10 })
    .map(p => {
      const b = bot.blockAt(p);
      return `${b.name} (${p.x},${p.y},${p.z})`;
    });

  return {
    prompt: `
Ты Minecraft-игрок.
Положение: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})
Еда: ${bot.food}/20
Здоровье: ${bot.health}/20
Инвентарь: ${inventory || 'пусто'}
Блоки рядом: ${nearbyBlocks.join(', ') || 'ничего интересного'}
Задача: выжить и развиться.

Что будешь делать?
Ответь ТОЛЬКО одной командой: goTo(x,y,z), dig(x,y,z), craft(item), build(type), say("текст").
    `.trim()
  };
};
