const Discord = require("discord.js")
const Post = require('../../Model/Post'); // Importando a classe Post

module.exports = {
    name: "status",
    description: "Atualize o status de um post por meio do ID",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
      {
        name: "id",
        description: "Digite o ID do post que deseja atualizar o status",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  run: async (client, interaction) => {
        let embed = new Discord.EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`Clique no botão abaixo para mudar o status do post de ID: \`${interaction.options.getString("id")}\`
        \n Status Atual: \`Pendente\``);

        let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("cargo_b" + interaction.id) // ID do botão
            .setEmoji("➡") // Emoji do botão
            .setLabel("Clique Aqui!") // Label do botão
            .setStyle(Discord.ButtonStyle.Danger) // Estilo do botão
        );

        interaction.reply({ embeds: [embed], components: [botao] }).then( () => {

            let coletor = interaction.channel.createMessageComponentCollector();

            coletor.on("collect", async (c) => {
                // Pegando o POST pelo ID e atualizando o status
                let id = interaction.options.getString("id");
                try {
                  let Ppost = new Post();
                  // Obtendo o objeto Post com base no ID
                  let post = await Ppost.getPostById(id);
              
                  // Atualizando o status do post
                  post.mudarStatus(post);

                  let postStatusMudado = await Ppost.getPostById(id);
                  // Atualizando a mensagem original com a nova informação
                  let newEmbed = new Discord.EmbedBuilder()
                    .setColor("DarkRed")
                    .setAuthor({
                      name: interaction.guild.name,
                      iconURL: interaction.guild.iconURL({ dynamic: true }),
                    })
                    .setDescription(
                      `O status do post foi atualizado para ${postStatusMudado.status}.`
                    );
                  c.update({ embeds: [newEmbed] });
                } catch (error) {
                  console.error(error);
                  await interaction.reply(
                    `Ocorreu um erro ao atualizar o status do post com ID ${id}.`
                  );
                }
              });              
        })
  }
}