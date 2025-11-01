const fs = require('fs');
const path = require('path');

module.exports = function loadEvents(client) {  // Passer le client en paramètre
  const eventsPath = path.join(__dirname, '../events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));

    // Assure-toi que `client` est passé à chaque événement
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`✅ Événement /${event.name} chargé`);
  }
};
