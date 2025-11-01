const { promoRoleId } = require('../config/config');
const { logToChannel } = require('../services/logger');

const DEBUG = Boolean(process.env.DEBUG_PRESENCE);


const recentActions = new Map();
const DEDUPE_MS = 5000;


const recentRoleErrors = new Map();
const ROLE_ERROR_TTL = 10 * 60 * 1000;

module.exports = {
  name: 'presenceUpdate',
  async execute(oldPresence, newPresence, client) {
    const member = newPresence?.member;
    if (!member || member.user.bot) return;


    if (!promoRoleId || typeof promoRoleId !== 'string' || !promoRoleId.trim()) {
      console.error('presenceUpdate: promoRoleId manquant ou invalide:', promoRoleId);
      return;
    }


    const before = oldPresence?.activities.find(a => a.type === 4)?.state?.toLowerCase() || "";
    const after = newPresence?.activities.find(a => a.type === 4)?.state?.toLowerCase() || "";

    const hadPromo = before.includes("discord.gg/nolimitwl") || before.includes(".gg/nolimitwl");
    const hasPromo = after.includes("discord.gg/nolimitwl") || after.includes(".gg/nolimitwl");


    let freshMember = member;
    try {
      freshMember = await member.guild.members.fetch(member.id);
    } catch (err) {

      if (DEBUG) console.warn('presenceUpdate: failed to fetch guild member for', member.id, err?.message || err);
    }

    const hasRole = freshMember.roles.cache.has(promoRoleId);
  const now = Date.now();


    let roleExists = freshMember.guild.roles.cache.has(promoRoleId);
    if (!roleExists) {
      try {
        await freshMember.guild.roles.fetch();
      } catch (e) {
        if (DEBUG) console.warn('presenceUpdate: failed to fetch guild roles', e?.message || e);
      }
      roleExists = freshMember.guild.roles.cache.has(promoRoleId);
    }

    if (!roleExists) {
      const roleKey = `${freshMember.guild.id}:${promoRoleId}`;
      const last = recentRoleErrors.get(roleKey);
      if (last && (now - last) < ROLE_ERROR_TTL) {


        if (DEBUG) console.debug('presenceUpdate: skipping repeated role-not-found notification for', roleKey);
        return;
      }

      recentRoleErrors.set(roleKey, now);
      if (DEBUG) console.error('presenceUpdate: role not found in guild roles:', promoRoleId);

      return;
    }


    for (const [mId, info] of recentActions.entries()) {
      if (now - info.ts > DEDUPE_MS) recentActions.delete(mId);
    }


    if (!hadPromo && hasPromo && !hasRole) {
      const prev = recentActions.get(member.id);
      if (prev && prev.op === 'add' && (now - prev.ts) < DEDUPE_MS) {

        return;
      }

      try {
        await freshMember.roles.add(promoRoleId);
        recentActions.set(member.id, { op: 'add', ts: Date.now() });
        logToChannel(`✅ ${freshMember.user.tag} a reçu le rôle soutien`, "📝 Rôle attribué", "success", client);
      } catch (err) {
        if (DEBUG) console.error('presenceUpdate: failed to add role', promoRoleId, 'to', member.id, err);

      }
    }


    if (hadPromo && !hasPromo && hasRole) {
      const prev = recentActions.get(member.id);
      if (prev && prev.op === 'remove' && (now - prev.ts) < DEDUPE_MS) {

        return;
      }

      try {
        await freshMember.roles.remove(promoRoleId);
        recentActions.set(member.id, { op: 'remove', ts: Date.now() });
        logToChannel(`❌ ${freshMember.user.tag} a perdu le rôle soutien`, "📝 Rôle retiré", "error", client);
      } catch (err) {
        if (DEBUG) console.error('presenceUpdate: failed to remove role', promoRoleId, 'from', member.id, err);

      }
    }
  }
};
