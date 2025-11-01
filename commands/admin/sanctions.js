const { SlashCommandBuilder } = require('discord.js');
const { getSanctions } = require('../../services/sanctions');
const { isAuthorized, isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sanctions')
    .setDescription('Voir l\'historique des sanctions d\'un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à vérifier').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    

    if (!isAuthorized(interaction.user.id) && !isOwner(interaction.user.id)) {
      return interaction.reply("❌ Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    try {
      const sanctions = await getSanctions(target.id);
      if (sanctions.length === 0) return interaction.reply(`Aucune sanction trouvée pour ${target.tag}`);
      
      const sanctionList = sanctions.map(sanction => `${sanction.type} - ${sanction.reason} (${sanction.timestamp})`).join('\n');
      interaction.reply(`Historique des sanctions de ${target.tag} :\n${sanctionList}`);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de la récupération des sanctions.");
    }
  }
};
