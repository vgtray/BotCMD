const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Vérifie la latence du bot et de l\'API'),
  async execute(interaction) {
    // Attendre que le bot soit prêt avant de récupérer la latence
    if (!interaction.client.ws) {
      await interaction.reply({ content: "❌ Le bot n'est pas encore connecté.", flags: 64 });
      return;
    }

    // Latence de l'API Discord
    const apiPing = interaction.client.ws.ping; 

    // Latence du bot (temps de réponse)
    const botPing = Date.now() - interaction.createdTimestamp;

    // Assure-toi que la latence API n'est pas égale à -1ms
    const formattedApiPing = apiPing === -1 ? 'Impossible de récupérer la latence API.' : `${apiPing}ms`;

    // Envoie de la réponse avec les latences
    await interaction.reply({
      content: `🏓 Latence du bot : ${botPing}ms | Latence de l'API : ${formattedApiPing}`,
    });
  },
};
