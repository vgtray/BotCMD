const { SlashCommandBuilder } = require('discord.js');
const { logSanction } = require('../../services/sanctions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Enlever le mute d\'un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à unmute').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    
    if (!muteRole) return interaction.reply("❌ Le rôle Mute n'existe pas sur ce serveur.");

    try {
      const member = interaction.guild.members.cache.get(target.id);
      await member.roles.remove(muteRole);
      interaction.reply(`✅ ${target.tag} a été dé-mute.`);
    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de la suppression du mute.");
    }
  }
};
