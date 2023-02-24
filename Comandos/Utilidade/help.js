const Discord = require("discord.js")

module.exports = {
  name: "help", // Nome do comando
  description: "Veja o que cada comando faz", // Descrição do comando
  type: Discord.ApplicationCommandType.ChatInput, // Define o tipo de interação (chat input)

  run: async (client, interaction) => { // Função que será executada quando o comando for usado
    // Cria uma nova mensagem embed para mostrar que o ping está sendo calculado
    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`👋🏽Olá ${interaction.user}😎, vamos para a lista de comandos: \n 
      \`/ping\` - Veja o ping do bot. \n
      \`/clear\` - Limpe o canal de texto. \n
      \`/post\` - Veja um post especifo pelo seu ID. \n
      \`/pendentes\` - Veja os posts pendentes. \n
      \`/publicados\` - Veja os posts publicados. \n
      \`/status\` - Atualize o status do post por meio de um ID. \n    
      \`/criarpost\` - Abre o painel de criação do formulário de post. \n 

      `) // Define a mensagem do embed
      .setColor("Random"); // Define a cor do embed


    //Envia a mensagem de resposta
    interaction.reply({ embeds: [embed] });
    
  }
}