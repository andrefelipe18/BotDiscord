const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder() //criando um novo comando
        .setName("ping") //nome do comando
        .setDescription("Responde com 'Pong!"), //descrição do comando

    async execute(interaction) { //executando o comando
        //Respondendo o comando com o ping do bot
        await interaction.reply(`Ping: ${interaction.client.ws.ping}ms`);
    }
}