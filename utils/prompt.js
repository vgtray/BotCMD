

const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

async function promptForReason(interaction) {

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('ticket_reason')
      .setLabel('Choisissez une raison')
      .setStyle('PRIMARY')
  );


  await interaction.reply({
    content: 'Veuillez spécifier la raison de votre demande',
    components: [row],
    flags: 64,
  });


  const filter = (i) => i.customId === 'ticket_reason' && i.user.id === interaction.user.id;
  const collected = await interaction.channel.awaitMessageComponent({ filter, time: 15000 });

  return collected.values[0];
}

module.exports = { promptForReason };
