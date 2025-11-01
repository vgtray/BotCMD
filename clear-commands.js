const { REST, Routes } = require('discord.js');
const { token, clientId } = require('./config/config');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🧹 Récupération des commandes globales...');
    const commands = await rest.get(Routes.applicationCommands(clientId));

    if (!commands.length) {
      return console.log('✅ Aucune commande à supprimer.');
    }

    console.log(`❗ ${commands.length} commande(s) à supprimer...`);

    for (const command of commands) {
      console.log(`⛔ Suppression de la commande : ${command.name}`);
      await rest.delete(
        Routes.applicationCommand(clientId, command.id)
      );
    }

    console.log('✅ Toutes les commandes globales ont été supprimées.');
  } catch (error) {
    console.error('❌ Erreur pendant la suppression des commandes :', error);
  }
})();