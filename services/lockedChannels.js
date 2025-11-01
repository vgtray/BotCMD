// 📁 services/lockedChannels.js

const locked = new Map(); // channelId => Set(userIds autorisés)
const previousChannels = new Map(); // memberId => ancien channelId

// Verrouille un salon
function lockChannel(channel) {
  const allowed = new Set(channel.members.map(m => m.id));
  locked.set(channel.id, allowed);
}

// Déverrouille un salon
function unlockChannel(channelId) {
  locked.delete(channelId);
}

// Vérifie si un salon est lock
function isLocked(channelId) {
  return channelId && locked.has(channelId);
}

// Récupère les membres autorisés d'un salon
function getAllowedMembers(channelId) {
  return locked.get(channelId) || new Set();
}

// Ajoute un membre whitelist
function addAllowedMember(channelId, userId) {
  const allowed = getAllowedMembers(channelId);
  allowed.add(userId);
  locked.set(channelId, allowed);
}

// Supprime un membre whitelist
function removeAllowedMember(channelId, userId) {
  const allowed = getAllowedMembers(channelId);
  allowed.delete(userId);
  locked.set(channelId, allowed);
}

// Donne tous les salons actuellement lock
function getAllLockedChannels() {
  return [...locked.keys()];
}

// Sauvegarde l'ancien channel d'un membre
function savePreviousChannel(memberId, channelId) {
  previousChannels.set(memberId, channelId);
}

// Récupère l'ancien channel d'un membre
function getPreviousChannel(memberId) {
  return previousChannels.get(memberId);
}

module.exports = {
  lockChannel,
  unlockChannel,
  isLocked,
  getAllowedMembers,
  addAllowedMember,
  removeAllowedMember,
  getAllLockedChannels,
  savePreviousChannel,
  getPreviousChannel
};
