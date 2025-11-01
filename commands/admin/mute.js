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
    

    if (!isAuthorized(interaction.user.id) && !isOwner(interaction.user.id)) {
      return interaction.reply("❌ Vous n'êtes pas autorisé à utiliser cette commande.");
    }


    let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) {
      try {
        const createdRole = await interaction.guild.roles.create({
          name: 'Muted',
          color: '#808080',
          permissions: [],
        });


        interaction.guild.channels.cache.forEach(async (channel) => {
          if (channel.isText() || channel.isVoice()) {
            await channel.permissionOverwrites.edit(createdRole, {
              SEND_MESSAGES: false,
              SPEAK: false,
              ADD_REACTIONS: false,
            });
          }
        });


        muteRole = createdRole;
      } catch (err) {
        console.error("❌ Erreur lors de la création du rôle Mute :", err);
        return interaction.reply("❌ Impossible de créer le rôle Mute.");
      }
    }

    try {

      const member = interaction.guild.members.cache.get(target.id);
      await member.roles.add(muteRole);
      await logSanction(target.id, interaction.user.id, 'mute', reason);


      const muteEmbed = new EmbedBuilder()
        .setColor('#808080')
        .setTitle('Mute')
        .setDescription(`✅ **<@${target.id}>** a été **mute**.`)
        .addFields(
          { name: 'Raison', value: reason, inline: true },
          { name: 'Administrateur', value: `<@${interaction.user.id}>`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'Moderia Bot - Système de gestion des sanctions' });


      interaction.reply({ embeds: [muteEmbed] });

    } catch (err) {
      console.error(err);
      interaction.reply("❌ Erreur lors de la mise en mute.");
    }
  }
};
