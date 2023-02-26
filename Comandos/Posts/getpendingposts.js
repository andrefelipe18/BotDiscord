const Discord = require("discord.js")
const Post = require('../../Model/Post'); // Importando a classe Post

//Importando o quick.db 
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: "pendentes",
    description: "Retorna posts com status pendente",
    type: Discord.ApplicationCommandType.ChatInput,
  
    run: async (client, interaction) => {
      const post = new Post();
      const allPosts = await post.getPendingPosts();
  
      let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
      .setDescription(`Aqui estão todos os posts ainda não publicados.`) // Define a mensagem do embed
      .setColor("Blue"); // Define a cor do embed
  
       // Cria um novo campo para cada post
       allPosts.forEach((post) => {
        embed.addFields({
          name: `Post de ID: \`${post.id}\``,
          value: `Titulo: \`${post.titulo}\``
        });
      });

      //Obtem o canal de posts pendentes
      let canalID = "1062738737315975308"
      let canal = client.channels.cache.get(canalID)

      canal.messages.fetch({ limit: 1 }).then((messages) => {
        messages.forEach((message) => {
          message.delete();
        });
      });

      
      interaction.reply({ embeds: [embed] });
    }
};