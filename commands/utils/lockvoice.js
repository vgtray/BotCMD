
const { PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {
  lockChannel,
  isLocked,
  unlockChannel,
  getAllowedMembers,
  addAllowedMember,
  removeAllowedMember,
  getAllLockedChannels
} = require('../../services/lockedChannels');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockvoice')
    .setDescription('🔒 Gérer les vocal locks')
    .addSubcommand(sub =>
      sub.setName('lock')
        .setDescription('Verrouille ton salon vocal actuel.'))
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Ajoute un membre à la whitelist du salon vocal.')
        .addUserOption(opt =>
          opt.setName('utilisateur')
            .setDescription('Membre à ajouter')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Retire un membre de la whitelist du salon vocal.')
        .addUserOption(opt =>
          opt.setName('utilisateur')
            .setDescription('Membre à retirer')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Liste tous les salons verrouillés et leurs membres whitelists.')),

  async execute(interaction) {
    try {
      const sub = interaction.options.getSubcommand();
      const member = interaction.member;
      const voiceChannel = member.voice?.channel;


      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.reply({ content: '❌ Tu n’as pas les permissions nécessaires pour gérer les salons vocaux.', flags: 64 });
      }

      if (sub === 'lock') {
        if (!voiceChannel) {
          return interaction.reply({ content: '❌ Tu dois être dans un salon vocal.', flags: 64 });
        }

        if (isLocked(voiceChannel.id)) {
          return interaction.reply({ content: `🔒 Le salon **${voiceChannel.name}** est déjà verrouillé.`, flags: 64 });
        }

        lockChannel(voiceChannel);
        return interaction.reply({ content: `✅ Le salon **${voiceChannel.name}** est maintenant verrouillé.`, flags: 64 });
      }

      if (sub === 'add') {
        if (!voiceChannel) {
          return interaction.reply({ content: '❌ Tu dois être dans un salon vocal.', flags: 64 });
        }

        if (!isLocked(voiceChannel.id)) {
          return interaction.reply({ content: '🔓 Ce salon n\'est pas verrouillé.', flags: 64 });
        }

        const target = interaction.options.getUser('utilisateur');
        if (!target) {
          return interaction.reply({ content: '❌ Utilisateur invalide.', flags: 64 });
        }

        addAllowedMember(voiceChannel.id, target.id);
        return interaction.reply({ content: `✅ <@${target.id}> peut maintenant rejoindre **${voiceChannel.name}**.`, flags: 64 });
      }

      if (sub === 'remove') {
        if (!voiceChannel) {
          return interaction.reply({ content: '❌ Tu dois être dans un salon vocal.', flags: 64 });
        }

        if (!isLocked(voiceChannel.id)) {
          return interaction.reply({ content: '🔓 Ce salon n\'est pas verrouillé.', flags: 64 });
        }

        const target = interaction.options.getUser('utilisateur');
        if (!target) {
          return interaction.reply({ content: '❌ Utilisateur invalide.', flags: 64 });
        }

        removeAllowedMember(voiceChannel.id, target.id);
        return interaction.reply({ content: `❌ <@${target.id}> a été retiré de **${voiceChannel.name}**.`, flags: 64 });
      }

      if (sub === 'list') {
        const channelIds = getAllLockedChannels();

        if (channelIds.length === 0) {
          return interaction.reply({ content: '🔓 Aucun salon vocal n’est actuellement verrouillé.', flags: 64 });
        }

        const embed = new EmbedBuilder()
          .setTitle('🔒 Salons vocaux verrouillés')
          .setColor(0x3498db)
          .setTimestamp();

        for (const channelId of channelIds) {
          const channel = interaction.guild.channels.cache.get(channelId);
          const allowed = getAllowedMembers(channelId);

          if (channel) {
            const allowedList = [...allowed].map(id => `<@${id}>`).join(', ') || 'Aucun';
            embed.addFields({ name: `${channel.name}`, value: allowedList });


            if (embed.data.fields.length >= 25) {
              break;
            }
          }
        }

        return interaction.reply({ embeds: [embed], flags: 64 });
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: '❌ Une erreur est survenue lors de l’exécution de la commande.', flags: 64 });
    }
  }
};
