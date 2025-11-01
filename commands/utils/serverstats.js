const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription("Affiche des statistiques avancées du serveur"),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Commande réservée aux admins.", flags: 64 });
    }

    const guild = interaction.guild;
    const members = await guild.members.fetch();
    const total = members.size;
    const bots = members.filter(m => m.user.bot).size;
    const humans = total - bots;
    const online = members.filter(m => m.presence && m.presence.status !== 'offline').size;

    const embed = new EmbedBuilder()
      .setTitle('📊 Statistiques du serveur')
      .setColor(0x40e0d0)
      .addFields(
        { name: '👥 Membres totaux', value: `${total}`, inline: true },
        { name: '🙋‍♂️ Humains', value: `${humans}`, inline: true },
        { name: '🤖 Bots', value: `${bots}`, inline: true },
        { name: '🟢 En ligne', value: `${online}`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
