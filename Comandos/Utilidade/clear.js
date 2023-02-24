const Discord = require("discord.js")

module.exports = {
    name: "clear", // Coloque o nome do comando
    description: "Limpe o canal de texto", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens para serem apagadas.',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        let numero = interaction.options.getNumber('quantidade')
        
            if (parseInt(numero) > 99 || parseInt(numero) <= 0) { // Verifica se o número é maior que 99 ou menor que 0

                let embed = new Discord.EmbedBuilder() // Cria um embed
                    .setColor("Random") // Define a cor do embed
                    .setDescription(`\`/clear [1 - 99]\``); // Define a descrição do embed

                interaction.reply({ embeds: [embed] }) // Envia o embed

            } else {

                interaction.channel.bulkDelete(parseInt(numero)) // Apaga as mensagens

                let embed = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`O canal de texo ${interaction.channel} teve \`${numero}\` mensagens deletadas por \`${interaction.user.username}\`. \n Este canal será limpo em 5 segundos.`);

                interaction.reply({ embeds: [embed] })

                setTimeout(() => {
                    let apagar_mensagem = "nao" // sim ou nao

                    if (apagar_mensagem === "sim") {
                        setTimeout(() => {
                            interaction.deleteReply()
                            interaction.message.delete();
                        }, 5000)
                    } else if (apagar_mensagem === "nao") {
                        return;
                    }
                }, 5000)

            }
    }
}