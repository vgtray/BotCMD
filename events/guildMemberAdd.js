const { autoRoleId, promoRoleId } = require('../config/config');
const { logToChannel } = require('../services/logger');
const { blacklist } = require('../services/blacklist');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const { user } = member;
    if (user.bot) return;


    const AUTO_ROLE_DISABLED = process.env.DISABLE_AUTO_ROLE === '1';

    if (blacklist.includes(user.id)) {
      try {
        await member.ban({ reason: 'Blacklist automatique — accès interdit.' });
        logToChannel(`⛔ ${user.tag} banni automatiquement`, '🚫 Blacklist', 'error', client);
      } catch (err) {
        console.error(err);
      }
      return;
    }


    if (!autoRoleId || typeof autoRoleId !== 'string' || !autoRoleId.trim()) {
      console.error('guildMemberAdd: autoRoleId manquant ou invalide:', autoRoleId);
      logToChannel(`⚠️ autoRoleId manquant ou invalide: ${autoRoleId}`, 'Erreur rôle', 'error', client);
      return;
    }


    if (!member.guild.roles.cache.has(autoRoleId)) {
      try {
        await member.guild.roles.fetch();
      } catch (e) {
        console.warn('guildMemberAdd: failed to fetch guild roles', e?.message || e);
      }
      if (!member.guild.roles.cache.has(autoRoleId)) {
        console.error('guildMemberAdd: role not found in guild for id', autoRoleId);
        logToChannel(`⚠️ Rôle auto introuvable dans la guilde: ${autoRoleId}`, 'Erreur rôle', 'error', client);
        return;
      }
    }


    if (AUTO_ROLE_DISABLED) {
      return;
    }

    try {
      await member.roles.add(autoRoleId);
      logToChannel(`✅ ${user.tag} a reçu le rôle auto`, '🎉 Nouveau membre', 'success', client);
    } catch (err) {
      console.error('guildMemberAdd: failed to add role', autoRoleId, 'to', member.id, err);
      logToChannel(`❌ Échec ajout rôle (${autoRoleId}) à ${user.tag}: ${err?.message || err}`, 'Erreur rôle', 'error', client);
    }
  }
};
