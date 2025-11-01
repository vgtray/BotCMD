const { SlashCommandBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');
const { logToChannel } = require('../../services/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Déverrouille le salon actuel'),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: '🚫 Non autorisé.', flags: 64 });
    }

    const channel = interaction.channel;
    try {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });
      await interaction.reply(`🔓 Le salon <#${channel.id}> a été déverrouillé.`);
      logToChannel(`🔓 Salon déverrouillé : <#${channel.id}> par ${interaction.user.tag}`, '🔓 Unlock Salon', 'default', interaction.client);
    } catch (err) {
      console.error("Erreur unlock :", err);
      await interaction.reply({ content: '❌ Erreur lors du déverrouillage.', flags: 64 });
    }
  }
};
