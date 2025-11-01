const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Affiche les informations du serveur Discord'),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`📌 Informations du serveur : ${guild.name}`)
      .setColor(0x40e0d0)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Membres', value: `${guild.memberCount}`, inline: true },
        { name: '🆔 ID', value: `${guild.id}`, inline: true },
        { name: '📆 Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
