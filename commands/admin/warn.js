const { SlashCommandBuilder } = require('discord.js');
const { logSanction } = require('../../services/sanctions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Avertir un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à avertir').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison de l\'avertissement').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    
    try {
      await logSanction(target.id, interaction.user.id, 'warn', reason);
      interaction.reply(`✅ ${target.tag} a été averti pour : ${reason}`);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de l'avertissement.");
    }
  }
};
