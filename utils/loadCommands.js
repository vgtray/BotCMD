const fs = require('fs');
const path = require('path');

module.exports = function loadCommands(client) {
  const basePath = path.join(__dirname, '../commands'); // Dossier contenant les commandes

  function load(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        load(filepath);  // Si c'est un sous-dossier, appelle récursivement la fonction
      } else if (file.endsWith('.js')) {
        const command = require(filepath);  // Charge la commande
        if (!command.data || !command.execute) {
          console.warn(`⚠️ Commande ignorée (invalide) : ${file}`);
          continue;
        }
        client.commands.set(command.data.name, command); // Ajoute la commande à la collection
        console.log(`✅ Commande /${command.data.name} chargée`);  // Log pour chaque commande chargée
      }
    }
  }

  load(basePath);  // Lance la fonction de chargement des commandes
};
