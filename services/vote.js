/**
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { voteUrl, redirectionUrl, logoUrl, promoChannelId } = require('../config/config');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { logToChannel } = require('./logger');

async function fetchVotes() {
  try {
    const res = await fetch(voteUrl);
    return await res.json();
  } catch (err) {
    console.error("Erreur API:", err);
    return null;
  }
}

function buildVoteEmbed(players = []) {
  if (!players || players.length === 0) return null;

  const sorted = players.sort((a, b) => b.votes - a.votes).slice(0, 10);
  const emojis = ["🥇", "🥈", "🥉"];

  const embed = new EmbedBuilder()
    .setTitle("🏆 TOP 10 VOTEURS DU MOIS")
    .setColor(0x40e0d0)
    .setThumbnail(logoUrl)
    .setFooter({ text: `${players.length} personne(s) ont voté ce mois-ci` });

  sorted.forEach((p, i) => {
    const prefix = emojis[i] || `#${i + 1}`;
    embed.addFields({ name: `${prefix} ${p.playername}`, value: `${p.votes} vote(s)`, inline: false });
  });

  return embed;
}

function buildVoteButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("Voter 🗳️").setStyle(ButtonStyle.Link).setURL(redirectionUrl)
  );
}

async function sendVotePromoEmbed(client) {
  const channel = await client.channels.fetch(promoChannelId).catch(console.error);
  if (!channel) return;

  const messages = await channel.messages.fetch({ limit: 10 });
  const last = messages.find(m => m.author.id === client.user.id);
  if (last) await last.delete().catch(() => {});

  const embed = new EmbedBuilder()
    .setTitle("📢 Votez pour NoLimit !")
    .setDescription("Top-Serveurs référence les serveurs GTA RP.\nVoter est **gratuit** et améliore notre visibilité.\n\nVous pouvez voter **toutes les 2h**.")
    .setColor(0x40e0d0);

  await channel.send({ embeds: [embed], components: [buildVoteButtonRow()] });
  logToChannel("📢 Message de vote automatique envoyé !", "📢 Auto-Vote", "default", client);
}

function startHourlyPromoScheduler(client) {
  const now = new Date();
  const nextHour = new Date(now); nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  const delay = nextHour.getTime() - now.getTime();

  console.log(`⏱️ Prochain message de vote auto dans ${Math.floor(delay / 60000)} minutes`);

  setTimeout(() => {
    sendVotePromoEmbed(client);
    setInterval(() => {
      console.log("📢 Message de vote auto envoyé !");
      sendVotePromoEmbed(client);
    }, 60 * 60 * 1000);
  }, delay);
}

module.exports = {
  fetchVotes,
  buildVoteEmbed,
  buildVoteButtonRow,
  sendVotePromoEmbed,
  startHourlyPromoScheduler
};
*/