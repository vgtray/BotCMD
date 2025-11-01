const { SlashCommandBuilder } = require('discord.js');
const { isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restartbot')
    .setDescription('Redémarre le bot (owner uniquement)'),
  async execute(interaction) {
    // Vérifier si l'utilisateur est propriétaire du bot
    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Tu n’es pas autorisé à utiliser cette commande.", flags: 64 });
    }

    // Répondre à l'interaction pour confirmer que le redémarrage a été demandé
    await interaction.reply({ content: '♻️ Le bot redémarre... Merci de patienter.', flags: 64 });

    // Attendre un peu pour que le message ait le temps d'être envoyé
    setTimeout(() => {
      console.log('♻️ Redémarrage effectué !');

      // Redémarrer le bot (arrêter le processus et PM2 ou autre gestionnaire le relancera)
      process.exit(0); // Cela arrête le processus

    }, 2000); // Délai de 2 secondes avant d'arrêter le processus
  }
};
