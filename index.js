const Discord = require("discord.js"); // Importa a biblioteca discord.js
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const config = require("./config.json"); // Importa as configurações do bot do arquivo config.json

//Importando o firebase
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, onValue } = require("firebase/database");


const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

//Inicnado o firebase
const app = initializeApp(firebaseConfig);

//Objeto molde para o banco de dados
class Post {
  constructor(id, titulo, legenda, conteudo) {
    this.id = id
    this.titulo = titulo;
    this.legenda = legenda;
    this.conteudo = conteudo;
  }
}


const client = new Discord.Client({  // Cria uma nova instância do cliente discord
  intents: [ 
    Discord.GatewayIntentBits.Guilds  // Define as intenções que o bot tem ao se conectar ao servidor do Discord
  ]
});

module.exports = client; // Exporta o cliente para ser utilizado em outros arquivos do projeto

client.on('interactionCreate', (interaction) => { // Cria um ouvinte para a interação do usuário com o bot

  if(interaction.type === Discord.InteractionType.ApplicationCommand){ // Verifica se a interação é do tipo ApplicationCommand

      const cmd = client.slashCommands.get(interaction.commandName); // Obtém o comando correspondente ao nome da interação

      if (!cmd) return interaction.reply(`Error`); // Verifica se o comando foi encontrado

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id); // Obtém informações do membro que interagiu com o bot

      cmd.run(client, interaction); // Executa o comando correspondente

   }
});

//Modal de criação de Post
client.on("interactionCreate", async(interaction) => {
  if (interaction.isButton()) {
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
  } else if (interaction.isModalSubmit()) {
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
      .setColor("Green")
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

      let conteudo = resposta3 + '    ' + resposta4 + '    ' +  resposta5;
      let postagem = new Post(postId, resposta1, resposta2, conteudo);
      createPost(postagem);
      await interaction.guild.channels.cache.get(await db.get(`posts_${interaction.guild.id}`)).send({ embeds: [embed] })
    }
  }
})

//Função para criar post no banco de dados
function createPost(post) {
  const db = getDatabase();
  const postRef = push(ref(db, 'posts'), post);

  postRef
    .then(() => {
      console.log('Post adicionado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao adicionar o post: ', error);
    });
}


client.on('ready', () => { // Cria um ouvinte para o evento de inicialização do bot
  console.log(`🔥 Estou online em ${client.user.username}!`); // Exibe uma mensagem no console informando que o bot está online
});

client.slashCommands = new Discord.Collection(); // Cria uma nova coleção para armazenar os comandos do bot

require('./handler')(client); // Importa e executa o arquivo handler.js, responsável por registrar os comandos do bot

client.login(config.TOKEN); // Inicia a conexão do bot com o servidor do Discord usando o token de acesso armazenado no arquivo config.json