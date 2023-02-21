const Discord = require('discord.js'); // Importa a dependência da discord.js

module.exports = {
    name: "ping", //Nome do comando 
    description: "Teste o ping do Bot!", // Descrição do comando
    aliases: ["latencia", "pong"], // Apelidos do comando

    run: async (client, message, args) => { // Inicia o comando
        let embed = new Discord.EmbedBuilder() //Embeds são uma forma de criar mensagens mais bonitas
        .setColor("Random") // Título do embed
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`👋🏽Olá ${message.author}😎, seu ping está em: \`carregando...\`.`);

        let embed2 = new Discord.EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`👋🏽Olá ${message.author}😎, seu ping está em: \`${client.ws.ping}\`ms.`);

        message.reply({ embeds: [embed] }).then((msg) => { // Envia a mensagem
            setTimeout(() => { // Espera 2 segundos
                msg.edit({ embeds: [embed2] }); // Edita a mensagem
            }, 500);
        });
    }
}
