// Importa a biblioteca Discord.js
const Discord = require("discord.js")
// Importa a biblioteca Quick.db
const { QuickDB } = require("quick.db")
// Cria uma nova instância do Quick.db
const db = new QuickDB()

// Exporta um objeto com as informações do comando
module.exports = {
  // Nome do comando
  name: "criarpost",
  // Descrição do comando
  description: "Abra o painel de criação de post",
  // Define o tipo do comando como entrada de chat
  type: Discord.ApplicationCommandType.ChatInput,
  // Define as opções do comando
  options: [
    {
        name: "criar_post",
        description: "Canal para criar os posts",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "posts",
        description: "Canal para enviar as logs dos posts recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
  ],

  // Função que é executada quando o comando é chamado
  run: async (client, interaction) => {
    // Verifica se o usuário que chamou o comando possui permissão de administrador
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) { 
        // Responde à interação dizendo que o usuário não possui permissão
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        // Pega os canais do comando a partir das opções fornecidas na interação
        const criar_post = interaction.options.getChannel("criar_post")
        const posts = interaction.options.getChannel("posts")

        // Verifica se os canais são do tipo texto
        if (criar_post.type !== Discord.ChannelType.GuildText) {
            // Responde à interação dizendo que o canal não é do tipo texto
            interaction.reply({ content: `O canal ${criar_post} não é um canal de texto.`, ephemeral: true })
        } 
        // Verifica se os canais são do tipo texto
        else if (posts.type !== Discord.ChannelType.GuildText) {
            // Responde à interação dizendo que o canal não é do tipo texto
            interaction.reply({ content: `O canal ${posts} não é um canal de texto.`, ephemeral: true })
        } 
        // Se os canais são do tipo texto
        else {
            // Salva os IDs dos canais no banco de dados
            await db.set(`criar_post_${interaction.guild.id}`, criar_post.id)
            await db.set(`posts_${interaction.guild.id}`, posts.id)

            // Cria uma mensagem embutida para informar que os canais foram configurados
            let embed = new Discord.EmbedBuilder()
            .setDescription("Random")
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal do Formulário: ${criar_post}.\n> Canal de Logs: ${posts}.`)

            // Responde à interação com a mensagem embutida
            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                // Cria uma mensagem embutida para o formulário
                let embed_formulario = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Formulário:`)
                .setDescription(`Crie um novo post clicando no botão abaixo!`);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("formulario")
                    .setEmoji("☝")
                    .setLabel("Criar novo post")
                    .setStyle(Discord.ButtonStyle.Primary)
                );

                criar_post.send({ embeds: [embed_formulario], components: [botao] })
            })
        } 
    }
  }
}