const { promptForReason } = require('../utils/prompt');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // ✅ Slash command
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      const command = client.commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error('❌ Erreur lors de l\'exécution de la commande :', error);
        
        // Vérifier si l'interaction n'a pas déjà été répondue
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: '❌ Une erreur est survenue lors de l\'exécution de la commande.',
            flags: 64,
          });
        } else {
          console.error('❌ Erreur Discord client :', error);
        }
      }
    }

    // ✅ Bouton
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // Attribution de rôle
      if (customId.startsWith('assignRole_')) {
        const roleId = customId.split('_')[1];

        if (roleId === 'none') {
          return interaction.reply({ content: '✅ Action confirmée.', flags: 64 });
        }

        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
          return interaction.reply({ content: '❌ Ce rôle n’existe pas.', flags: 64 });
        }

        try {
          await interaction.member.roles.add(role);
          return interaction.reply({
            content: `✅ Rôle donné avec succès.`,
            flags: 64,
          });
        } catch (err) {
          console.error("Erreur lors de l'ajout du rôle :", err);
          return interaction.reply({
            content: `❌ Impossible d’ajouter le rôle. Vérifie les permissions.`,
            flags: 64,
          });
        }
      }

      // Création de ticket
      if (customId === 'create_ticket') {
        try {
          const category = interaction.values[0];
          const reason = await promptForReason(interaction);

          if (!category) {
            return interaction.reply({ content: '❌ Vous devez choisir une catégorie.',flags: 64});
          }

          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 'GUILD_TEXT',
            parent: '1361031360659194138',
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
            ],
          });

          const embed = new EmbedBuilder()
            .setTitle('Ticket créé')
            .setDescription(`Bonjour <@${interaction.user.id}>, comment pouvons-nous vous aider ?`)
            .addFields(
              { name: 'Catégorie', value: category, inline: true },
              { name: 'Raison', value: reason, inline: true }
            )
            .setColor('#00ff00')
            .setFooter({ text: 'NoLimit - Ticket' })
            .setTimestamp();

          const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('claim_ticket')
              .setLabel('Réclamer le ticket')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('rename_ticket')
              .setLabel('Renommer le ticket')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('close_ticket')
              .setLabel('Fermer le ticket')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('add_member')
              .setLabel('Ajouter un membre')
              .setStyle(ButtonStyle.Success)
          );

          await ticketChannel.send({
            embeds: [embed],
            components: [buttonRow],
          });

          await interaction.reply({
            content: `✅ Votre ticket a été créé : <#${ticketChannel.id}>`,
            flags: 64,
          });
        } catch (error) {
          console.error("❌ Erreur création ticket :", error);
          await interaction.reply({
            content: '❌ Une erreur est survenue lors de la création du ticket.',
            flags: 64,
          });
        }
      }
    }

    // ✅ Modal : /say
    if (interaction.isModalSubmit() && interaction.customId === 'say') {
      const title = interaction.fields.getTextInputValue('title_input');
      const message = interaction.fields.getTextInputValue('message_input');
      const channelId = interaction.fields.getTextInputValue('channel_input');
      const buttonLabel = interaction.fields.getTextInputValue('button_input');
      const roleId = interaction.fields.getTextInputValue('role_input');

      const targetChannel = interaction.guild.channels.cache.get(channelId);
      if (!targetChannel || targetChannel.type !== 0) {
        return interaction.reply({
          content: '❌ Salon invalide ou introuvable.',
          flags: 64,
        });
      }

      const embed = new EmbedBuilder()
        .setColor('#007eca') // ✅ couleur mise à jour
        .setDescription(message)
        .setFooter({ text: interaction.guild.name })
        .setTimestamp();

      if (title && title.trim() !== '') {
        embed.setTitle(title.trim());
      }

      const components = [];

      if (buttonLabel && buttonLabel.trim() !== '') {
        const button = new ButtonBuilder()
          .setCustomId(`assignRole_${roleId || 'none'}`)
          .setLabel(buttonLabel.trim())
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);
        components.push(row);
      }

      await targetChannel.send({ embeds: [embed], components });

      await interaction.reply({
        content: `✅ Message envoyé dans <#${channelId}>`,
        flags: 64,
      });
    }
  },
};
