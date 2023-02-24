const Discord = require("discord.js"); // Importa a lib Discord.js
const Post = require("../../Model/Post"); // Importa o model Post



//Importando o quick.db 
const { QuickDB } = require("quick.db")
const db = new QuickDB()

async function criarPost(interaction){
    if (interaction.customId === "formulario") {
        if (!interaction.guild.channels.cache.get(await db.get(`posts_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
        const modal = new Discord.ModalBuilder()
        .setCustomId("modal")
        .setTitle("Formulário");
  
        const titulo = new Discord.TextInputBuilder()
        .setCustomId("titulo") // Coloque o ID da pergunta
        .setLabel("Titulo") // Coloque a pergunta
        .setPlaceholder("Escreva o titulo do post: ") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
  
        const legenda = new Discord.TextInputBuilder()
        .setCustomId("legenda") // Coloque o ID da pergunta
        .setLabel("Legenda") // Coloque a pergunta
        .setPlaceholder("Escrava a legenda do post: ") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
        .setRequired(true)
  
        const slide1 = new Discord.TextInputBuilder()
        .setCustomId("slide1") // Coloque o ID da pergunta
        .setLabel("Conteudo 1º Slide: ") // Coloque a pergunta
        .setPlaceholder("Escreva o que deve conter no primeiro slide: ") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)
  
        const slide2 = new Discord.TextInputBuilder()
        .setCustomId("slide2") // Coloque o ID da pergunta
        .setLabel("Conteudo 2º Slide: ") // Coloque a pergunta
        .setPlaceholder("Escreva o que deve conter no segundo slide:") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)
  
        const slide3 = new Discord.TextInputBuilder()
        .setCustomId("slide3") // Coloque o ID da pergunta
        .setLabel("Conteudo 3º Slide: ") // Coloque a pergunta
        .setPlaceholder("Escreva o que deve conter no terceiro slide:") // Mensagem que fica antes de escrever a resposta
        .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
        .setRequired(false)
  
        modal.addComponents(
          new Discord.ActionRowBuilder().addComponents(titulo),
          new Discord.ActionRowBuilder().addComponents(legenda),
          new Discord.ActionRowBuilder().addComponents(slide1),
          new Discord.ActionRowBuilder().addComponents(slide2),
          new Discord.ActionRowBuilder().addComponents(slide3)
        )
  
        await interaction.showModal(modal)
      }
}

module.exports = criarPost;