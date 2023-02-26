const Discord = require("discord.js")
const Post = require('../../Model/Post'); // Importando a classe Post


module.exports = {
    name: "publicados",
    description: "Retorna posts com status postado",
    type: Discord.ApplicationCommandType.ChatInput,
  
    run: async (client, interaction) => {
      const post = new Post();
      const allPosts = await post.getPostedPosts();


      let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`Aqui estão todos os posts já postados.`) // Define a mensagem do embed
      .setColor("Green"); // Define a cor do embed
  
       // Cria um novo campo para cada post
       allPosts.forEach((post) => {
        embed.addFields({
          name: `Post de ID: \`${post.id}\``,
          value: `Titulo: \`${post.titulo}\``
        });
      });

      //Obtem o canal de posts pendentes
      let canalID = "1078770187916038154"
      let canal = client.channels.cache.get(canalID)

      canal.messages.fetch({ limit: 1 }).then((messages) => {
        messages.forEach((message) => {
          message.delete();
        });
      });
      
      interaction.reply({ embeds: [embed] });
    }
};