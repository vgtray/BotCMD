const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Affiche l'avatar d'un utilisateur")
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription('Utilisateur à afficher')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setImage(avatarUrl)
      .setColor(0x40e0d0);
    await interaction.reply({ embeds: [embed] });
  }
};
