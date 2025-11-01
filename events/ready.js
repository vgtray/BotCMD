const { Events } = require('discord.js');
const { guildId, monthlyChannelId } = require('../config/config');
const { logCommandStatus, logToChannel } = require('../services/logger');
const { startHourlyPromoScheduler, fetchVotes, buildVoteEmbed, buildVoteButtonRow } = require('../services/vote');


let isReady = false;

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {

    if (isReady) {
      console.log('⚠️ Tentative de ré-exécution de l\'événement ready ignorée');
      return;
    }
    
    isReady = true;
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    logCommandStatus(client);


    try {
      const existingCommands = await client.application.commands.fetch({ guildId });
      const commandsToRegister = [...client.commands.map(c => c.data)];
      

      const needsUpdate = commandsToRegister.length !== existingCommands.size ||
        commandsToRegister.some(cmd => !existingCommands.find(existing => existing.name === cmd.name));
      
      if (needsUpdate) {
        console.log('🔄 Mise à jour des commandes slash nécessaire...');
        
        const data = await client.application.commands.set(
          commandsToRegister,
          guildId
        );
        console.log(`✅ ${data.size} commande(s) slash mise(s) à jour sur ${guildId}`);
      } else {
        console.log('✅ Les commandes slash sont déjà à jour');
      }
    } catch (err) {
      console.error("❌ Erreur lors du déploiement des commandes :", err);
    }


    if (!client.schedulerStarted) {
      startHourlyPromoScheduler(client);
      client.schedulerStarted = true;
    }


    if (!client.monthlyIntervalStarted) {
      setInterval(async () => {
        const now = new Date();
        if (now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() < 5) {
          console.log("📈 Envoi du classement mensuel automatique");
          logToChannel("📈 Classement mensuel envoyé automatiquement !");
          
          try {
            const result = await fetchVotes();
            const embed = buildVoteEmbed(result?.players || []);
            const channel = await client.channels.fetch(monthlyChannelId).catch(() => null);
            
            if (embed && channel) {
              await channel.send({ 
                embeds: [embed], 
                components: [buildVoteButtonRow()] 
              });
            }
          } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du classement mensuel:', error);
          }
        }
      }, 60 * 1000);
      
      client.monthlyIntervalStarted = true;
    }
  }
};
