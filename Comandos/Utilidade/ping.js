const Discord = require("discord.js")

module.exports = {
  name: "ping", // Nome do comando
  description: "Veja o ping do bot.", // Descrição do comando
  type: Discord.ApplicationCommandType.ChatInput, // Define o tipo de interação (chat input)

  run: async (client, interaction) => { // Função que será executada quando o comando for usado
    let ping = client.ws.ping; // Pega o ping do WebSocket do cliente

    // Cria uma nova mensagem embed para mostrar que o ping está sendo calculado
    let embed_1 = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`👋🏽Olá ${interaction.user}😎, meu ping está em \`calculando...\`.`) // Define a mensagem do embed
      .setColor("Random"); // Define a cor do embed

    // Cria uma nova mensagem embed para mostrar o ping
    let embed_2 = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`👋🏽Olá ${interaction.user}😎, meu ping está em \`${ping}ms\`.`) // Define a mensagem do embed, incluindo o valor do ping
      .setColor("Random"); // Define a cor do embed

    // Envia a primeira mensagem de resposta, com a mensagem de "calculando"
    interaction.reply({ embeds: [embed_1] }).then(() => {
      setTimeout(() => {
        // Edita a resposta com a mensagem do ping real após meio segundo
        interaction.editReply({ embeds: [embed_2] });
      }, 500);
    });
  }
}