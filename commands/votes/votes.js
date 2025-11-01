const { SlashCommandBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');

const { fetchVotes, buildVoteEmbed, buildVoteButtonRow } = require('../../services/vote');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('votes')
    .setDescription('Affiche le top 10 des voteurs'),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Non autorisé.", flags: 64 });
    }

    await interaction.deferReply();
    const result = await fetchVotes();
    if (!result) return interaction.editReply("❌ Erreur API.");
    const embed = buildVoteEmbed(result.players);
    if (!embed) return interaction.editReply("Aucun vote trouvé.");
    await interaction.editReply({ embeds: [embed], components: [buildVoteButtonRow()] });
  }
};
