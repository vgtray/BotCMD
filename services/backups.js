const fs = require('fs');
const path = require('path');
const { logToChannel } = require('./logger');

const backupFolder = path.join(__dirname, '../data/backups');
if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder, { recursive: true });

function backupFile(filePath, client) {
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(backupFolder, `${fileName}.${timestamp}.bak`);

  fs.copyFile(filePath, dest, (err) => {
    if (err) return console.error(`❌ Backup échoué pour ${fileName}:`, err);
    console.log(`💾 Backup réussi : ${fileName}`);
    logToChannel(`💾 Backup auto effectué pour \`${fileName}\``, "🔁 Backup JSON", "default", client);
  });
}

module.exports = { backupFile };
