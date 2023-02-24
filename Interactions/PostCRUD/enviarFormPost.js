const Discord = require("discord.js"); // Importa a lib Discord.js
const Post = require("../../Model/Post"); // Importa o model Post

//Importando o quick.db 
const { QuickDB } = require("quick.db")
const db = new QuickDB()

async function enviarFormPost(interaction){
    if (interaction.customId === "modal") {
        let resposta1 = interaction.fields.getTextInputValue("titulo")
        let resposta2 = interaction.fields.getTextInputValue("legenda")
        let resposta3 = interaction.fields.getTextInputValue("slide1")
        let resposta4 = interaction.fields.getTextInputValue("slide2")
        let resposta5 = interaction.fields.getTextInputValue("slide3")
  
        if (!resposta1) resposta1 = "Não informado."
        if (!resposta2) resposta2 = "Não informado."
        if (!resposta3) resposta3 = "Não informado."
        if (!resposta4) resposta4 = "Não informado."
        if (!resposta5) resposta5 = "Não informado."
  
        const postId = Date.now().toString();
        let embed = new Discord.EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Post de ID: \`${postId}\``)
        .addFields(
          {
            name: `Titulo:`,
            value: `\`${resposta1}\``,
            inline: false
          },
          {
            name: `Legenda: `,
            value: `${resposta2}`,
            inline: false
          },
          {
            name: `Conteudo 1º Slide:`,
            value: `${resposta3}`,
            inline: false
          },
          {
            name: `Conteudo 2º Slide:`,
            value: `${resposta4}`,
            inline: false
          },
          {
            name: `Conteudo 3º Slide:`,
            value: `${resposta5}`,
            inline: false
          },
        );
        //Criando o botão de alternar o status do post
        let botao = new Discord.ActionRowBuilder().addComponents(
          new Discord.ButtonBuilder()
          .setCustomId("status_b" + postId) // ID do botão que envia o id do post para o ouvinte
          .setEmoji("➡") // Emoji do botão
          .setLabel("Clique Aqui Para Alternar o Status para: Postado") // Label do botão
          .setStyle(Discord.ButtonStyle.Primary) // Estilo do botão
      );
  
       //Botão para excluir post no banco de dados
       let botaoExcluir = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId("excluirBotao" + postId) // ID do botão que envia o id do post para o ouvinte
        .setEmoji("🗑") // Emoji do botão
        .setLabel("Excluir Post") // Label do botão
        .setStyle(Discord.ButtonStyle.Danger) // Estilo do botão
       ); 
  
        //Criando o post no firebase
        let conteudo = resposta3 + '    ' + resposta4 + '    ' +  resposta5;
        let postagem = new Post(postId, resposta1, resposta2, conteudo);
        postagem.createPost(postagem);
  
        await interaction.guild.channels.cache.get(await db.get(`posts_${interaction.guild.id}`)).send({ embeds: [embed], components: [botao, botaoExcluir] })
      }
}

module.exports = enviarFormPost;