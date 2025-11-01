const { SlashCommandBuilder } = require('discord.js');
const { logSanction } = require('../../services/sanctions');
const { isAuthorized, isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à bannir').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison du ban').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    
    // Vérifier si l'utilisateur est un administrateur du bot ou le propriétaire du bot
    if (!isAuthorized(interaction.user.id) && !isOwner(interaction.user.id)) {
      return interaction.reply("❌ Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    try {
      await interaction.guild.members.ban(target, { reason });
      await logSanction(target.id, interaction.user.id, 'ban', reason);
      interaction.reply(`✅ ${target.tag} a été banni pour : ${reason}`);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors du ban.");
    }
  }
};
