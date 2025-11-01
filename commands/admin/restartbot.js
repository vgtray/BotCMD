const { SlashCommandBuilder } = require('discord.js');
const { isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restartbot')
    .setDescription('Redémarre le bot (owner uniquement)'),
  async execute(interaction) {

    if (!isOwner(interaction.user.id)) {
      return interaction.reply({ content: "🚫 Tu n’es pas autorisé à utiliser cette commande.", flags: 64 });
    }


    await interaction.reply({ content: '♻️ Le bot redémarre... Merci de patienter.', flags: 64 });


    setTimeout(() => {
      console.log('♻️ Redémarrage effectué !');


      process.exit(0);

    }, 2000);
  }
};
