console.log("📦 Import des modules...");
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token, guildId } = require('./config/config');
const loadCommands = require('./utils/loadCommands');
const loadEvents = require('./utils/loadEvents');

console.log("🛠️ Initialisation du client...");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,  
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.startTime = Date.now();
console.log("📂 Chargement des commandes...");
loadCommands(client);
console.log("📂 Chargement des événements...");
loadEvents(client); 
console.log("📡 Tentative de connexion à Discord...");
client.login(token);
client.on("error", (err) => {
  console.error("❌ Erreur Discord client :", err);
});
client.on("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  console.log(`🟢 Bot redémarré à ${new Date().toLocaleTimeString()}`);
});
