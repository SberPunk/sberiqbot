
const fs = require('fs');
const path = 'memory.json';

let data = { base: null };

function load() {
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }
}

function save() {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { load, save, data };
