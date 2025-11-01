const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { fetchVotes } = require('../../services/vote');
const { logoUrl } = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Affiche des statistiques sur les votes du serveur'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await fetchVotes();
      if (!res?.players) return interaction.editReply("❌ Aucune donnée reçue depuis l'API.");

      const totalVotes = res.players.reduce((sum, p) => sum + p.votes, 0);
      const totalVoters = res.players.length;

      const embed = new EmbedBuilder()
        .setTitle("📊 Statistiques de votes")
        .setColor(0x9B59B6)
        .addFields(
          { name: "Total des votes (mois en cours)", value: `${totalVotes}`, inline: true },
          { name: "Nombre de voteurs uniques", value: `${totalVoters}`, inline: true }
        )
        .setThumbnail(logoUrl)
        .setFooter({ text: `Données fournies par l’API Top-Serveurs` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("Erreur API stats:", err);
      return interaction.editReply("❌ Erreur lors de la récupération des statistiques.");
    }
  }
};
