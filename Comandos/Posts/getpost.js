const Discord = require("discord.js")
const Post = require('../../Model/Post'); // Importando a classe Post


module.exports = {
    name: "posts",
    description: "Retorna todos os posts criados",
    type: Discord.ApplicationCommandType.ChatInput,
  
    run: async (client, interaction) => {
      const post = new Post();
      const allPosts = await post.getPosts();
  
      let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`Aqui estão todos os posts na nossa base de dados.`) // Define a mensagem do embed
      .setColor("Random"); // Define a cor do embed
  
       // Cria um novo campo para cada post
       allPosts.forEach((post) => {
        embed.addFields({
          name: `Post de ID: \`${post.id}\``,
          value: `Titulo: \`${post.titulo}\``
        });
      });
      
      interaction.reply({ embeds: [embed] });
    }
};