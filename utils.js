
function findTree(bot) {
  return bot.findBlock({
    matching: block => block.name.includes('log'),
    maxDistance: 32
  });
}

function countItem(bot, name) {
  return bot.inventory.items()
    .filter(item => item.name.includes(name))
    .reduce((acc, item) => acc + item.count, 0);
}

module.exports = {
  findTree,
  countItem
};
