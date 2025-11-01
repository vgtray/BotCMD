const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Affiche depuis combien de temps le bot est en ligne"),
  async execute(interaction, client) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Commande réservée aux admins.", flags: 64 });
    }

    const now = Date.now();
    const diff = now - client.startTime;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const embed = new EmbedBuilder()
      .setTitle("⏱️ Uptime du bot")
      .setDescription(`En ligne depuis : **${days}j ${hours}h ${minutes}min ${seconds}s**`)
      .setColor(0x40e0d0)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
