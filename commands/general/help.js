const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isAuthorized, isOwner } = require('../../utils/authorization');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Affiche les commandes ou une catégorie")
    .addStringOption(option =>
      option.setName('catégorie')
        .setDescription('Filtrer par type')
        .addChoices(
          { name: 'générales', value: 'general' },
          { name: 'utilitaires', value: 'util' },
          { name: 'administration', value: 'admin' },

          { name: 'logs', value: 'logs' }
        )
    ),
  async execute(interaction) {
    try {
      const category = interaction.options.getString('catégorie');
      const isOwnerUser = isOwner(interaction.user.id);
      const isAdminUser = isAuthorized(interaction.user.id);

      const embed = new EmbedBuilder().setColor(0x40e0d0);

      if (!category) {
        embed.setTitle("📖 Commandes disponibles");
        embed.addFields({ name: "🎖️ Générales", value: "`/votes`, `/topvoteurs`, `/stats`, `/votecheck`, `/ping`, `/serverinfo`, `/userinfo`, `/avatar`, `/help`" });

        if (isAdminUser) {
          embed.addFields({ name: "🛠️ Utilitaires", value: "`/say`, `/giveaway`, `/serverstats`, `/uptime`, `/clear`, `/lock`, `/unlock`" });
        }

        if (isOwnerUser) {
          embed.addFields({ name: "🔒 Administration", value: "`/admin`, `/blacklist`, `/restartbot`,`/banfivem`" });
        }


        embed.addFields({ name: "📋 Logs", value: "`/logs`" });
      }

      else if (category === 'general') {
        embed.setTitle("🎖️ Commandes générales").setDescription(`
\`/votes\` — Voir les top voteurs  
\`/topvoteurs\` — Classement des voteurs  
\`/stats\` — Statistiques globales des votes  
\`/votecheck\` — Vérifie si un utilisateur a voté  
\`/ping\` — Vérifie la latence du bot  
\`/serverinfo\` — Informations du serveur Discord  
\`/userinfo\` — Informations sur un utilisateur  
\`/avatar\` — Affiche l'avatar d’un utilisateur  
\`/help\` — Affiche ce menu d’aide`);
      }

      else if (category === 'util') {
        if (!isAdminUser) {
          return interaction.reply({ content: "🚫 Tu n’as pas accès à cette catégorie.", flags: 64 });
        }

        embed.setTitle("🛠️ Commandes utilitaires").setDescription(`
\`/say\` — Envoyer un message via le bot  
\`/giveaway\` — Lancer un giveaway  
\`/serverstats\` — Statistiques du serveur  
\`/uptime\` — Uptime du bot  
\`/clear\` — Supprimer des messages  
\`/lock\` — Verrouiller un salon  
\`/unlock\` — Déverrouiller un salon`);
      }

      else if (category === 'admin') {
        if (!isOwnerUser) {
          return interaction.reply({ content: "🚫 Réservé aux owners uniquement.", flags: 64 });
        }

        embed.setTitle("🔒 Commandes administration").setDescription(`
\`/banfivem [id] [raison]\` — Ban un joueur sur le serveur FiveM
\`/admin\` — Gérer les administrateurs  
\`/blacklist\` — Gérer les utilisateurs blacklistés  
\`/restartbot\` — Redémarrer le bot`);
      }

      else if (category === 'tickets') {
        embed.setTitle("🎫 Commandes Tickets").setDescription(`
\`/ticket\` — Créer un ticket pour poser une question ou signaler un problème  
\`/close\` — Fermer un ticket  
\`/reopen\` — Rouvrir un ticket`);
      }

      else if (category === 'logs') {
        embed.setTitle("📋 Commandes Logs").setDescription(`
\`/logs\` — Affiche les logs du bot`);
      }

      embed.setFooter({ text: "NoLimit Bot — Aide interactive" });

      return interaction.reply({ embeds: [embed], flags: 64 });

    } catch (error) {
      console.error("❌ Erreur dans /help :", error);

      const msg = { content: "❌ Une erreur interne est survenue.", flags: 64 };

      if (interaction.replied || interaction.deferred) {
        return interaction.followUp(msg).catch(() => {});
      } else {
        return interaction.reply(msg).catch(() => {});
      }
    }
  }
};
