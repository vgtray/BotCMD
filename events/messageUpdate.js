const { EmbedBuilder } = require('discord.js');
const { logsChannelId } = require('../config/config');

module.exports = {
  name: 'messageUpdate',

  async execute(oldMessage, newMessage, client) {
    console.log('✏️ messageUpdate triggered');

    if (oldMessage.author?.bot) return console.log('⏭️ Ignoré (bot)');
    if (oldMessage.content === newMessage.content) return console.log('⏭️ Pas de changement de contenu');

    const logChannel = oldMessage.guild?.channels.cache.get(logsChannelId);
    if (!logChannel) return console.log('❌ Salon de logs introuvable');

    console.log('📤 Envoi du log...');

    const embed = new EmbedBuilder()
      .setTitle('✏️ Message modifié')
      .setColor('Orange')
      .addFields(
        { name: 'Auteur', value: `<@${oldMessage.author.id}>`, inline: true },
        { name: 'Salon', value: `<#${oldMessage.channel.id}>`, inline: true },
        { name: 'Lien', value: `[Voir le message](${newMessage.url})`, inline: false },
        { name: 'Avant', value: oldMessage.content?.slice(0, 1000) || '*Aucun contenu*' },
        { name: 'Après', value: newMessage.content?.slice(0, 1000) || '*Aucun contenu*' }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  }
};
