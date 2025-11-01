
const { SlashCommandBuilder } = require('discord.js');
const { isOwner, getAdmins, addAdmin, removeAdmin } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Gérer les administrateurs du bot')
    .addSubcommand(s =>
      s.setName('add')
        .setDescription('Ajouter un administrateur')
        .addUserOption(o =>
          o.setName('utilisateur')
            .setDescription("L'utilisateur à ajouter comme admin")
            .setRequired(true)))
    .addSubcommand(s =>
      s.setName('remove')
        .setDescription('Retirer un administrateur')
        .addUserOption(o =>
          o.setName('utilisateur')
            .setDescription("L'utilisateur à retirer des admins")
            .setRequired(true)))
    .addSubcommand(s =>
      s.setName('list')
        .setDescription('Afficher la liste des administrateurs')),

  async execute(interaction) {
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Seuls les owners peuvent gérer les administrateurs.", flags: 64});
    }

    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('utilisateur');
    const currentAdmins = getAdmins();

    if (sub === 'add') {
      if (currentAdmins.includes(user.id)) {
        return interaction.reply({ content: `⚠️ ${user.tag} est déjà administrateur.`, flags: 64 });
      }
      addAdmin(user.id);
      return interaction.reply({ content: `✅ ${user.tag} a été ajouté comme administrateur.` });
    }

    if (sub === 'remove') {
      if (!currentAdmins.includes(user.id)) {
        return interaction.reply({ content: `⚠️ ${user.tag} n'est pas administrateur.`, flags: 64 });
      }
      removeAdmin(user.id);
      return interaction.reply({ content: `❌ ${user.tag} a été retiré des administrateurs.` });
    }

    if (sub === 'list') {
      if (!Array.isArray(currentAdmins) || currentAdmins.length === 0) {
        return interaction.reply({ content: '📃 Aucun administrateur défini.', flags: 64});
      }
      const list = currentAdmins.map(id => `<@${id}>`).join('\n');
      return interaction.reply({ content: `📃 Liste des administrateurs :\n${list}`, flags: 64 });
    }
  }
};
