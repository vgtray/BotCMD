const fs = require('fs');
const path = require('path');
const sanctionsFile = path.join(__dirname, '../data/sanctions.json');


async function logSanction(userId, moderatorId, type, reason) {
  try {

    const data = fs.existsSync(sanctionsFile) ? JSON.parse(fs.readFileSync(sanctionsFile, 'utf8')) : [];


    const sanction = {
      userId,
      moderatorId,
      type,
      reason,
      timestamp: new Date(),
    };

    data.push(sanction);


    fs.writeFileSync(sanctionsFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Erreur de log de sanction:', err);
  }
}


async function getSanctions(userId) {
  try {
    const data = fs.existsSync(sanctionsFile) ? JSON.parse(fs.readFileSync(sanctionsFile, 'utf8')) : [];
    return data.filter(sanction => sanction.userId === userId);
  } catch (err) {
    console.error('❌ Erreur de récupération des sanctions:', err);
    return [];
  }
}

module.exports = { logSanction, getSanctions };
