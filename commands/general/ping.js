const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Vérifie la latence du bot et de l\'API'),
  async execute(interaction) {

    if (!interaction.client.ws) {
      await interaction.reply({ content: "❌ Le bot n'est pas encore connecté.", flags: 64 });
      return;
    }


    const apiPing = interaction.client.ws.ping; 


    const botPing = Date.now() - interaction.createdTimestamp;


    const formattedApiPing = apiPing === -1 ? 'Impossible de récupérer la latence API.' : `${apiPing}ms`;


    await interaction.reply({
      content: `🏓 Latence du bot : ${botPing}ms | Latence de l'API : ${formattedApiPing}`,
    });
  },
};
