const { SlashCommandBuilder } = require('discord.js');
const { fetchVotes, buildVoteEmbed, buildVoteButtonRow } = require('../../services/vote');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topvoteurs')
    .setDescription('Affiche le classement en direct des meilleurs voteurs'),
  async execute(interaction) {
    await interaction.deferReply();
    const result = await fetchVotes();
    if (!result || !result.players) {
      return interaction.editReply("❌ Impossible de récupérer les votes.");
    }

    const embed = buildVoteEmbed(result.players);
    if (!embed) return interaction.editReply("Aucun vote détecté.");
    return interaction.editReply({ embeds: [embed], components: [buildVoteButtonRow()] });
  }
};
