const fs = require('fs');
const path = require('path');

module.exports = function loadCommands(client) {
  const basePath = path.join(__dirname, '../commands');

  function load(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        load(filepath);
      } else if (file.endsWith('.js')) {
        const command = require(filepath);
        if (!command.data || !command.execute) {
          console.warn(`⚠️ Commande ignorée (invalide) : ${file}`);
          continue;
        }
        client.commands.set(command.data.name, command);
        console.log(`✅ Commande /${command.data.name} chargée`);
      }
    }
  }

  load(basePath);
};
