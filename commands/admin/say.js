const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Ouvre un formulaire pour envoyer un message embed dans un salon'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Tu dois être admin pour utiliser cette commande.', flags: 64 });
    }

    const modal = new ModalBuilder()
      .setCustomId('say')
      .setTitle('Envoyer un message embed');

    const titleInput = new TextInputBuilder()
      .setCustomId('title_input')
      .setLabel('Titre de l\'embed (facultatif)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const messageInput = new TextInputBuilder()
      .setCustomId('message_input')
      .setLabel('Message (multiligne)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const channelInput = new TextInputBuilder()
      .setCustomId('channel_input')
      .setLabel('ID du salon où envoyer le message')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const buttonInput = new TextInputBuilder()
      .setCustomId('button_input')
      .setLabel('Texte du bouton (facultatif)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const roleInput = new TextInputBuilder()
      .setCustomId('role_input')
      .setLabel('ID du rôle à donner (facultatif)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(messageInput),
      new ActionRowBuilder().addComponents(channelInput),
      new ActionRowBuilder().addComponents(buttonInput),
      new ActionRowBuilder().addComponents(roleInput)
    );

    await interaction.showModal(modal);
  },


  async modalSubmit(interaction) {
    if (interaction.customId !== 'say') return;

    const title = interaction.fields.getTextInputValue('title_input') || null;
    const message = interaction.fields.getTextInputValue('message_input');
    const channelId = interaction.fields.getTextInputValue('channel_input');
    const buttonText = interaction.fields.getTextInputValue('button_input') || null;
    const roleId = interaction.fields.getTextInputValue('role_input') || null;

    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor('#007eca');

    if (title) embed.setTitle(title);

    const channel = interaction.client.channels.cache.get(channelId);
    if (!channel) {
      return interaction.reply({ content: '🚫 Salon introuvable.', ephemeral: true });
    }

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Message envoyé !', ephemeral: true });
  }
};
