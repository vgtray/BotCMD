const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { logSanction } = require('../../services/sanctions');
const { isAuthorized, isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Rendre muet un utilisateur')
    .addUserOption(option => option.setName('target').setDescription('Utilisateur à rendre muet').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Raison du mute').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');
    
    // Vérifier si l'utilisateur est un administrateur du bot ou le propriétaire du bot
    if (!isAuthorized(interaction.user.id) && !isOwner(interaction.user.id)) {
      return interaction.reply("❌ Vous n'êtes pas autorisé à utiliser cette commande.");
    }

    // Vérifier si le rôle Mute existe, sinon le créer
    let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) {
      try {
        const createdRole = await interaction.guild.roles.create({
          name: 'Muted',
          color: '#808080', // Utilisation d'un code hexadécimal valide pour la couleur gris
          permissions: [], // Aucun droit par défaut
        });

        // Appliquer les permissions de Mute sur tous les salons textuels et vocaux
        interaction.guild.channels.cache.forEach(async (channel) => {
          if (channel.isText() || channel.isVoice()) {
            await channel.permissionOverwrites.edit(createdRole, {
              SEND_MESSAGES: false,  // Empêche l'envoi de messages
              SPEAK: false,          // Empêche de parler en vocal
              ADD_REACTIONS: false,  // Empêche d'ajouter des réactions
            });
          }
        });

        // Mettre à jour la variable muteRole pour le rôle créé
        muteRole = createdRole;
      } catch (err) {
        console.error("❌ Erreur lors de la création du rôle Mute :", err);
        return interaction.reply("❌ Impossible de créer le rôle Mute.");
      }
    }

    try {
      // Ajouter le rôle Mute à l'utilisateur
      const member = interaction.guild.members.cache.get(target.id);
      await member.roles.add(muteRole);
      await logSanction(target.id, interaction.user.id, 'mute', reason);

      // Créer l'Embed de confirmation
      const muteEmbed = new EmbedBuilder()
        .setColor('#808080')
        .setTitle('Mute')
        .setDescription(`✅ **<@${target.id}>** a été **mute**.`) // Mention de l'utilisateur
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Administrateur', value: `<@${interaction.user.id}>`, inline: true }, // Mention de l'admin
        )
        .setTimestamp()
        .setFooter({ text: 'Moderia Bot - Système de gestion des sanctions' });

      // Répondre avec l'Embed
      interaction.reply({ embeds: [muteEmbed] });

    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de la mise en mute.");
    }
  }
};
