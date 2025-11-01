const { EmbedBuilder } = require('discord.js');
const { logsChannelId } = require('../config/config');

const colors = {
  default: 0x40e0d0,
  success: 0x57F287,
  error: 0xED4245,
  vote: 0x3498DB,
  stats: 0x9B59B6
};

async function logToChannel(message, title = "📝 Log du bot", type = "default", client) {
  try {
    const channel = await client.channels.fetch(logsChannelId);
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(colors[type] || colors.default)
      .setTimestamp();

    channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("❌ Impossible d’envoyer le log :", err);
  }
}

function logCommandStatus(client) {
  const total = client.commands.size;
  let ok = 0;

  for (const [, command] of client.commands) {
    if (command?.execute) ok++;
  }

  if (ok === total) {
    console.log(`✅ ${ok} commande(s) enregistrée(s) avec succès.`);
  } else {
    console.log(`⚠️ ${ok}/${total} commande(s) valides. Vérifie les erreurs.`);
  }
}

module.exports = {
  logToChannel,
  logCommandStatus
};
