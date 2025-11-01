const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isAuthorized } = require('../../utils/authorization');


const { logToChannel } = require('../../services/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Créer un giveaway')
    .addStringOption(opt =>
      opt.setName('récompense')
        .setDescription('Ce que l’utilisateur gagne')
        .setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('durée')
        .setDescription('Durée en minutes')
        .setRequired(true)),
  async execute(interaction) {
    if (!isAuthorized(interaction.user.id)) {
      return interaction.reply({ content: '🚫 Non autorisé.', flags: 64 });
    }

    const récompense = interaction.options.getString('récompense');
    const durée = interaction.options.getInteger('durée');
    const fin = Date.now() + durée * 60000;

    const embed = new EmbedBuilder()
      .setTitle('🎉 GIVEAWAY !')
      .setDescription(`Récompense : **${récompense}**\nClique sur 🎉 pour participer !`)
      .setColor(0xF1C40F)
      .setFooter({ text: `Se termine dans ${durée} minute(s)` })
      .setTimestamp(new Date(fin));

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    await message.react('🎉');

    logToChannel(`🎁 Giveaway lancé pour **${récompense}** (${durée} min)`, '🎉 Giveaway', 'default', interaction.client);

    setTimeout(async () => {
      const fetched = await message.fetch().catch(() => {});
      if (!fetched) return;
      const reactions = fetched.reactions.cache.get('🎉');
      const users = await reactions?.users.fetch().catch(() => {});
      const participants = users?.filter(u => !u.bot).map(u => u) || [];

      if (participants.length === 0) {
        fetched.reply('❌ Personne n’a participé au giveaway.');
        return;
      }

      const winner = participants[Math.floor(Math.random() * participants.length)];
      fetched.reply(`🎉 Félicitations <@${winner.id}> ! Tu as gagné **${récompense}** !`);
      logToChannel(`🎉 <@${winner.id}> a gagné **${récompense}** !`, '🎉 Résultat Giveaway', 'success', interaction.client);
    }, durée * 60000);
  }
};
