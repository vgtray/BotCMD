const fs = require('fs');
const path = require('path');
const { owners } = require('../config/config');

const adminsFile = path.join(__dirname, '../data/admins.json');
let adminIds = new Set();

function loadAdmins() {
  try {
    const data = JSON.parse(fs.readFileSync(adminsFile, 'utf8'));
    adminIds = new Set(data);
  } catch {
    adminIds = new Set();
    saveAdmins();
  }
}

function saveAdmins() {
  fs.writeFileSync(adminsFile, JSON.stringify([...adminIds], null, 2));
}

function isAuthorized(id) {
  return adminIds.has(id) || owners.includes(id);
}

function isOwner(id) {
  return owners.includes(id);
}

function addAdmin(id) {
  adminIds.add(id);
  saveAdmins();
}

function removeAdmin(id) {
  adminIds.delete(id);
  saveAdmins();
}

function getAdmins() {
  return [...adminIds];
}

loadAdmins();

module.exports = {
  isAuthorized,
  isOwner,
  addAdmin,
  removeAdmin,
  getAdmins,
};
