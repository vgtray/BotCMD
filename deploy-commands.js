const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token, clientId } = require('./config/config');


const guildIds = ['1318679153137942609'];

const commands = [];


const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, 'commands', folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {

    for (const guildId of guildIds) {
      console.log(`🧹 Suppression des commandes GUILD pour la guild ${guildId}...`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
      console.log(`✅ Commandes guild supprimées pour ${guildId}.`);
    }


    console.log('🧹 Suppression de TOUTES les commandes GLOBAL...');
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log('✅ Anciennes commandes globales supprimées.');


    console.log('🚀 Déploiement des commandes globales...');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Nouvelles commandes globales déployées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();
