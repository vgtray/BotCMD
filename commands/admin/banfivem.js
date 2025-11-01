const { SlashCommandBuilder } = require('@discordjs/builders');
const { Rcon } = require('rcon-client');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banfivem')
        .setDescription('Ban un joueur via RCon sur le serveur FiveM')
        .addIntegerOption(option =>
            option.setName('id')
                .setDescription('ID du joueur à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du ban')
                .setRequired(false)),

    async execute(interaction) {
        const id = interaction.options.getInteger('id');
        const reason = interaction.options.getString('raison') || "Aucune raison";

        const rcon = new Rcon({
            host: "89.213.131.163",       // IP publique de ton serveur FiveM
            port: 30136,                  // Port RCon (par défaut = 30120, à vérifier dans ton cfg)
            password: "rootmoderia"
        });

        try {
            await rcon.connect();

            // Exemple de commande (selon ce que txAdmin ou tes scripts acceptent)
            const command = `ban ${id} ${reason}`;
            const response = await rcon.send(command);

            await interaction.reply(`✅ Commande envoyée : \`${command}\`\nRéponse serveur : ${response}`);
            rcon.end();
        } catch (err) {
            console.error(err);
            await interaction.reply("❌ Erreur lors de la connexion à RCon.");
        }
    }
};
