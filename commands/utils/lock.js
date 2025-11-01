const { SlashCommandBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');
const { logToChannel } = require('../../services/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Verrouille le salon actuel'),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: '🚫 Non autorisé.', flags: 64 });
    }

    const channel = interaction.channel;
    try {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });
      await interaction.reply(`🔒 Le salon <#${channel.id}> a été verrouillé.`);
      logToChannel(`🔒 Salon verrouillé : <#${channel.id}> par ${interaction.user.tag}`, '🔒 Lock Salon', 'default', interaction.client);
    } catch (err) {
      console.error("Erreur lock :", err);
      await interaction.reply({ content: '❌ Erreur lors du verrouillage.', flags: 64 });
    }
  }
};
