const {
  isLocked,
  getAllowedMembers,
  savePreviousChannel,
  getPreviousChannel,
  unlockChannel
} = require('../services/lockedChannels');
const { EmbedBuilder } = require('discord.js');
const { logsChannelId, owners } = require('../config/config');

module.exports = {
  name: 'voiceStateUpdate',

  async execute(oldState, newState, client) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const member = newState.member;

    if (!member) return;


    if (oldChannel && isLocked(oldChannel.id)) {

      if (oldChannel.members.size === 0) {
        unlockChannel(oldChannel.id);
        console.log(`🔓 Salon unlock auto : ${oldChannel.name}`);
      }
    }

    if (!newChannel) return;


    if (oldChannel && !newChannel) {
      savePreviousChannel(member.id, oldChannel.id);
    }


    if (isLocked(newChannel.id)) {
      const allowed = getAllowedMembers(newChannel.id);


      if (owners.includes(member.id)) {
        console.log(`✅ Owner ${member.user.tag} a bypassé le lock du salon ${newChannel.name}`);
        return;
      }

      if (!allowed.has(member.id)) {
        const previousChannelId = getPreviousChannel(member.id);
        const previousChannel = previousChannelId ? newState.guild.channels.cache.get(previousChannelId) : null;

        try {
          if (previousChannel && previousChannel.isVoiceBased()) {
            await newState.setChannel(previousChannel);
            await sendLog(member, newChannel, previousChannel, client, 'déplacé');
          } else {
            await member.voice.disconnect();
            await sendLog(member, newChannel, null, client, 'déconnecté');
          }
        } catch (err) {
          console.error('Erreur retour vocal lock:', err);
        }
      }
    }
  }
};

async function sendLog(member, fromChannel, toChannel, client, action) {
  const guild = member.guild;
  const logsChannel = guild.channels.cache.get(logsChannelId);
  if (!logsChannel) return;

  const embed = new EmbedBuilder()
    .setTitle('🔒 Anti-Join Vocale')
    .setDescription(`**${member.user.tag}** a tenté de rejoindre **${fromChannel.name}** et a été **${action}**.`)
    .setColor(action === 'déconnecté' ? 0xff0000 : 0x3498db)
    .setTimestamp();

  if (toChannel) {
    embed.addFields({ name: 'Déplacé vers', value: `${toChannel.name}`, inline: true });
  }

  await logsChannel.send({ embeds: [embed] });
}
