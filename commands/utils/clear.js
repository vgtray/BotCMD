const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages récents')
    .addIntegerOption(opt =>
      opt.setName('nombre')
        .setDescription('Nombre de messages à supprimer (1 à 100)')
        .setRequired(true)),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Non autorisé.", flags: 64 });
    }

    const amount = interaction.options.getInteger('nombre');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: '❌ Nombre entre 1 et 100 uniquement.', flags: 64 });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      // Récupérer les messages
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      
      if (messages.size === 0) {
        return interaction.editReply({ content: '❌ Aucun message à supprimer.' });
      }

      // Séparer les messages récents (< 14 jours) des anciens
      const now = Date.now();
      const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 14 jours en millisecondes
      
      const recentMessages = messages.filter(msg => (now - msg.createdTimestamp) < twoWeeks);
      const oldMessages = messages.filter(msg => (now - msg.createdTimestamp) >= twoWeeks);

      let deletedCount = 0;

      // Supprimer les messages récents en masse
      if (recentMessages.size > 0) {
        await interaction.channel.bulkDelete(recentMessages, true);
        deletedCount += recentMessages.size;
      }

      // Supprimer les anciens messages un par un
      if (oldMessages.size > 0) {
        await interaction.editReply({ 
          content: `⏳ Suppression de ${oldMessages.size} ancien(s) message(s)... (Cela peut prendre du temps)` 
        });

        for (const message of oldMessages.values()) {
          try {
            await message.delete();
            deletedCount++;
            // Petite pause pour éviter le rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (err) {
            console.error(`Erreur lors de la suppression du message ${message.id}:`, err);
          }
        }
      }

      return interaction.editReply({ 
        content: `✅ ${deletedCount} message(s) supprimé(s).${oldMessages.size > 0 ? ' (Anciens messages supprimés individuellement)' : ''}` 
      });

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      return interaction.editReply({ content: "❌ Erreur lors de la suppression des messages." });
    }
  }
};
