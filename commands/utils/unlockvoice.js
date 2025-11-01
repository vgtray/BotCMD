const { SlashCommandBuilder } = require('discord.js');
const { unlockChannel, isLocked } = require('../../services/lockedChannels');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlockvoice')
    .setDescription('Déverrouille ton salon vocal.'),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Tu dois être dans un salon vocal.', flags: 64 });
    }

    if (!isLocked(voiceChannel.id)) {
      return interaction.reply({ content: '🔓 Ce salon n\'est pas verrouillé.', flags: 64 });
    }

    unlockChannel(voiceChannel.id);
    await interaction.reply({ content: `🔓 Salon **${voiceChannel.name}** déverrouillé.`, flags: 64 });
  }
};
