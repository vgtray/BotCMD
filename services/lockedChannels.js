

const locked = new Map();
const previousChannels = new Map();


function lockChannel(channel) {
  const allowed = new Set(channel.members.map(m => m.id));
  locked.set(channel.id, allowed);
}


function unlockChannel(channelId) {
  locked.delete(channelId);
}


function isLocked(channelId) {
  return channelId && locked.has(channelId);
}


function getAllowedMembers(channelId) {
  return locked.get(channelId) || new Set();
}


function addAllowedMember(channelId, userId) {
  const allowed = getAllowedMembers(channelId);
  allowed.add(userId);
  locked.set(channelId, allowed);
}


function removeAllowedMember(channelId, userId) {
  const allowed = getAllowedMembers(channelId);
  allowed.delete(userId);
  locked.set(channelId, allowed);
}


function getAllLockedChannels() {
  return [...locked.keys()];
}


function savePreviousChannel(memberId, channelId) {
  previousChannels.set(memberId, channelId);
}


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
