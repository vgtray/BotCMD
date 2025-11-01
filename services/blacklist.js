const fs = require('fs');
const path = require('path');

const blacklistFile = path.join(__dirname, '../data/blacklist.json');


let blacklist = [];

function loadBlacklist() {
  try {
    blacklist = JSON.parse(fs.readFileSync(blacklistFile, 'utf8'));
  } catch {
    blacklist = [];
    fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
  }
}

function saveBlacklist() {
  fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
}

loadBlacklist();

module.exports = {
  blacklist,
  saveBlacklist
};
