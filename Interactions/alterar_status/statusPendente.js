const Discord = require("discord.js"); // Importa a lib Discord.js
const Post = require("../../Model/Post"); // Importa o model Post

async function statusPendente(interaction){
 //Verifica se o ID do botão é o botão de alternar status "pendente"
 if (interaction.customId.startsWith("status_p")) { 
    
    //Pegando o id do post  
    let postId = interaction.customId.replace("status_p", "");
    //Pegando o post no firebase
    let Ppost = new Post();
    // Obtendo o objeto Post com base no ID
    let post = await Ppost.getPostById(postId);

    let botao = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId("status_b" + postId) // ID do botão que envia o id do post para o ouvinte
        .setEmoji("➡") // Emoji do botão
        .setLabel("Clique Aqui Para Alternar o Status para: Postado") // Label do botão
        .setStyle(Discord.ButtonStyle.Primary) // Estilo do botão
    );
    
    //Botao de exclusão
    let botaoExcluir = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId("excluirBotao" + postId) // ID do botão que envia o id do post para o ouvinte
        .setEmoji("🗑") // Emoji do botão
        .setLabel("Excluir Post") // Label do botão
        .setStyle(Discord.ButtonStyle.Danger) // Estilo do botão
    );     

    //Atualiza o botão com o novo status
    await interaction.update({components: [botao, botaoExcluir] });
    
    //Atualiza o status do post no firebase
    post.mudarStatus(post);
 }
}

module.exports = statusPendente;