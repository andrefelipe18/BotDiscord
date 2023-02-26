const Discord = require("discord.js"); // Importa a lib Discord.js
const Post = require("../../Model/Post"); // Importa o model Post


async function excluirPost(interaction, client){
    if (interaction.customId.startsWith("excluirBotao")) { //Verifica se o ID do botão é o botão de alternar status

        //Pegando o id do post  
        let postId = interaction.customId.replace("excluirBotao", "");
        //Pegando o post no firebase
        let Ppost = new Post();
        // Obtendo o objeto Post com base no ID
        let post = await Ppost.getPostById(postId);
  
        Ppost.deletePost(postId);
  
        let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
        .setDescription(`O Post "${post.id}" será apagado em até 5s⏳.`) // Define a mensagem do embed
        .setColor("Purple"); // Define a cor do embed
  
        await interaction.update({ embeds: [embed], components: [] });
        
        setTimeout(() => {

        let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
        .setDescription(`Post apagado com sucesso`) // Define a mensagem do embed
        .setColor("Purple"); // Define a cor do embed    

        setTimeout(() => {
            // Apaga a mensagem
            interaction.message.delete();
          }, 4000);

        }, 4000);
      }
};

module.exports = excluirPost;
