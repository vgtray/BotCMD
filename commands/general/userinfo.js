const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Affiche les informations d'un utilisateur")
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription('Utilisateur à inspecter')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const embed = new EmbedBuilder()
      .setTitle(`📋 Informations sur ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '🤖 Bot ?', value: user.bot ? 'Oui' : 'Non', inline: true },
        { name: '📅 Création du compte', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false }
      );
    if (member) {
      embed.addFields(
        { name: '📆 Arrivé sur le serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: '🎭 Rôles', value: member.roles.cache.map(r => r.name).filter(r => r !== '@everyone').join(', ') || 'Aucun', inline: false }
      );
    }
    await interaction.reply({ embeds: [embed] });
  }
};
