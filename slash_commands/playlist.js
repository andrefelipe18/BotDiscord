const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("froid")
        .setDescription("Froid?"),

    async execute(interaction) {
        await interaction.reply("Que bom que você perguntou, aqui está a playlist do Froid:\nhttps://open.spotify.com/playlist/5YrmENKUeRcvZw88iJiKKP?si=e97f4ae9f57a4192")
    }
}