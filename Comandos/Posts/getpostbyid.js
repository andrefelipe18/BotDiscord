const Discord = require("discord.js")
const Post = require('../../Model/Post'); // Importando a classe Post

module.exports = {
    name: "post",
    description: "Retorno um post por meio do ID",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
      {
        name: "id",
        description: "Digite o ID do post que deseja obter",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  run: async (client, interaction) => {
        //Buscando o post pelo ID
        let postId = interaction.options.getString("id");

        //Pegando o post no firebase
        let Ppost = new Post();
        // Obtendo o objeto Post com base no ID
        let post = await Ppost.getPostById(postId);

        

        let embed = new Discord.EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`Post de ID: \`${postId}\` \n Status: \`${post.status}\` 
        \n Titulo: \`${post.titulo}\` \n
        \n Legenda: \`${post.legenda}\`
        \n Conteúdo: \`${post.conteudo}\
        \n\n **ESSA MENSAGEM SERÁ APAGADA EM 15 MINUTOS**
         `)

        //Criando o botão de alternar o status do post
        let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("status_b" + postId) // ID do botão que envia o id do post para o ouvinte
            .setEmoji("➡") // Emoji do botão
            .setLabel("Clique Aqui Para Alternar o Status para: Postado") // Label do botão
            .setStyle(Discord.ButtonStyle.Primary) // Estilo do botão
        );

        //Verifica se existe uma mensagem no canal, para poder apagar
        let idCanal = interaction.channel.id;

        // Obtém o canal pelo ID
        let canal = client.channels.cache.get(idCanal);

        //Verifica se já existe uma mensagem no canal
        canal.messages.fetch({ limit: 1 }).then((messages) => {
            messages.forEach((message) => {
            message.delete();
            });
        });    


        // Enviando o embed    
        interaction.reply({ embeds: [embed], components: [botao] });

        //Apagando a mensagem depois de 15 minutos 
        setTimeout(() => {
            interaction.deleteReply();
        }, 900000);
  }
}