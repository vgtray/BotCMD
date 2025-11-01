const { SlashCommandBuilder } = require('discord.js');
const { logSanction } = require('../../services/sanctions');
const { isAuthorized, isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à expulser').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison de l\'expulsion').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    

    if (!isAuthorized(interaction.user.id) && !isOwner(interaction.user.id)) {
      return interaction.reply("❌ Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    try {
      await interaction.guild.members.kick(target, { reason });
      await logSanction(target.id, interaction.user.id, 'kick', reason);
      interaction.reply(`✅ ${target.tag} a été expulsé pour : ${reason}`);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de l'expulsion.");
    }
  }
};
