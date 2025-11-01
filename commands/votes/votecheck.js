const { SlashCommandBuilder } = require('discord.js');
const { fetchVotes } = require('../../services/vote');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('votecheck')
    .setDescription('Vérifie si un utilisateur a voté')
    .addUserOption(opt =>
      opt.setName('utilisateur')
        .setDescription("Utilisateur à vérifier")
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('utilisateur');
    await interaction.deferReply();
    try {
      const res = await fetchVotes();
      const found = res?.players?.find(p =>
        p.discord_id === user.id ||
        p.playername.toLowerCase().includes(user.username.toLowerCase())
      );
      if (!found) return interaction.editReply(`❌ ${user.tag} n'a pas encore voté ce mois-ci.`);
      return interaction.editReply(`✅ ${user.tag} a voté **${found.votes} fois** ce mois-ci.`);
    } catch (err) {
      console.error("Erreur API votecheck:", err);
      return interaction.editReply("❌ Erreur lors de la vérification.");
    }
  }
};
