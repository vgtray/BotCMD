const { SlashCommandBuilder } = require('discord.js');
const { isAuthorized, isOwner } = require('../../utils/authorization');

const { blacklist, saveBlacklist } = require('../../services/blacklist');
const { logToChannel } = require('../../services/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Gérer la blacklist')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Ajouter un utilisateur')
        .addUserOption(opt =>
          opt.setName('utilisateur').setDescription('Utilisateur à blacklister').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Retirer un utilisateur')
        .addUserOption(opt =>
          opt.setName('utilisateur').setDescription('Utilisateur à retirer').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Afficher les utilisateurs blacklistés')),
  async execute(interaction) {
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: '🚫 Réservé aux owners.', flags: 64 });
    }

    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('utilisateur');

    if (sub === 'add') {
      if (blacklist.includes(user.id)) return interaction.reply({ content: 'Déjà blacklisté.', flags: 64 });
      blacklist.push(user.id); saveBlacklist();

      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (member) {
        try {
          await member.ban({ reason: 'Blacklist manuelle — accès interdit.' });
          logToChannel(`⛔ ${user.tag} banni manuellement suite à blacklist.`, '🚫 Blacklist', 'error', interaction.client);
        } catch (err) {
          logToChannel(`❌ Erreur ban immédiat de ${user.tag}`, '❗ Problème Ban', 'error', interaction.client);
        }
      }

      return interaction.reply(`🚫 <@${user.id}> ajouté à la blacklist.`);
    }

    if (sub === 'remove') {
      if (!blacklist.includes(user.id)) return interaction.reply({ content: 'Non présent dans la blacklist.', flags: 64 });
      blacklist.splice(blacklist.indexOf(user.id), 1); saveBlacklist();
      return interaction.reply(`✅ <@${user.id}> retiré de la blacklist.`);
    }

    if (sub === 'list') {
      const list = blacklist.map(id => `<@${id}>`).join('\n') || 'Aucun utilisateur.';
      return interaction.reply({ content: `📃 Utilisateurs blacklistés :\n${list}` });
    }
  }
};
