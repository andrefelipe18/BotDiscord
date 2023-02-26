const Discord = require("discord.js"); // Importa a biblioteca discord.js
const config = require("./config.json"); // Importa as configurações do bot do arquivo config.json

//Model de Post
const Post = require("./Model/Post.js");

//importando o firebase realtime database
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');

// Configurando o Firebase com as configurações obtidas do arquivo config.json
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};
const app = initializeApp(firebaseConfig); // Iniciando o Firebase com as configurações obtidas

//Importando as interações do bot
const statusPostado = require("./Interactions/alterar_status/statusPostado.js");
const statusPendente = require("./Interactions/alterar_status/statusPendente.js");
const excluirPost = require("./Interactions/PostCRUD/excluirPost.js");
const abrirFormPost = require("./Interactions/PostCRUD/abrirFormPost.js");
const enviarFormPost = require("./Interactions/PostCRUD/enviarFormPost.js");

// Cria uma nova instância do cliente discord
const client = new Discord.Client({
  intents: [ 
    Discord.GatewayIntentBits.Guilds  // Define as intenções que o bot tem ao se conectar ao servidor do Discord
  ]
});

// Exporta o cliente para ser utilizado em outros arquivos do projeto
module.exports = client; 


// Cria um ouvinte para a interação do usuário com o bot
client.on('interactionCreate', (interaction) => { 

  // Verifica se a interação é do tipo ApplicationCommand
  if(interaction.type === Discord.InteractionType.ApplicationCommand){ 

      // Obtém o comando correspondente ao nome da interação
      const cmd = client.slashCommands.get(interaction.commandName); 

      // Verifica se o comando foi encontrado
      if (!cmd) return interaction.reply(`Error`); 

      // Obtém informações do membro que interagiu com o bot
      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id); 

      // Executa o comando correspondente
      cmd.run(client, interaction); 

   }
});

//Modal de criação de Post
client.on("interactionCreate", async(interaction) => {
  if (interaction.isButton()) {

    //Função para abrir o modal de criação de post
    abrirFormPost(interaction);

  } else if (interaction.isModalSubmit()) {
    
    //Função para enviar o form de criação de post
    enviarFormPost(interaction);
  }
})

//Interação de clicar no botão de alternar status para "postado"
client.on('interactionCreate', async (interaction) => { 
  if (interaction.isButton()) { 

    //Chama a função de alternar o status do post
    statusPostado(interaction);
  }
});

//Interação de clicar no botão de alternar status para "pendente"
client.on('interactionCreate', async (interaction) => { 
  if (interaction.isButton()) { 
   
    //Chama a função de alternar o status do post
    statusPendente(interaction);
  }
});

//Interação de excluir post
client.on('interactionCreate', async (interaction) => {  
  if (interaction.isButton()) { 

    //Chama a função de excluir Post
    excluirPost(interaction, client);
  }
});

// Cria um ouvinte para o evento de inicialização do bot
client.on('ready', () => { 
  console.log(`🔥 Estou online em ${client.user.username}!`); // Exibe uma mensagem no console informando que o bot está online

  // Toda vez que o bot for inicializado, ele irá mandar uma mensagem no canal "bot"
  let idCanal = "1077309897542205500"; // ID do canal

  // Obtém o canal pelo ID
  let canal = client.channels.cache.get(idCanal);

  //Verifica se já existe uma mensagem no canal
  canal.messages.fetch({ limit: 1 }).then((messages) => {
    messages.forEach((message) => {
      message.delete();
    });
  });
  // Envia uma mensagem no canal
  canal.send("🔥 Estou online!");


  //Atualiza a mensagem a cada 5 minutos com a quantidade de posts e o ping do bot
  setInterval(() => {
    //Tempo em minutos
    const uptimeEmMinutos = Math.floor(client.uptime / 60000);
    canal.messages.fetch({ limit: 1 }).then((messages) => {
      messages.forEach((message) => {
        message.edit(`🔥 Estou online! \n\n📊 Quantidade de posts: (ainda não feito) \n\n📊 Ping: ${client.ws.ping}ms \n\n📊 Estou funcionando a: ${uptimeEmMinutos}m`);
      });
    });
  }, 30000);
});

//Ouvindo o evento de mudança no banco de dados
const db = getDatabase();
const postRef = ref(db, 'posts');

onValue(postRef, (snapshot) => {
  //Pegando o valor que foi alterado no banco de dados
  const data = snapshot.val();

  //Pegando o ID do post que foi alterado
  const id = Object.keys(data)[0];

  const idCanalPostados = "1078770187916038154";
  const canalPostados = client.channels.cache.get(idCanalPostados);
  const idCanalPendentes = "1062738737315975308";
  const canalPendentes = client.channels.cache.get(idCanalPendentes);

  //Pegando todos os posts do banco de dados
  const posts = Object.values(data);

  //Pegando os posts que estão pendentes e postados
  const postsPendentes = posts.filter((post) => post.status === "pendente");
  const postsPostados = posts.filter((post) => post.status === "postado");

  //Preparando a mensagem de posts pendentes e postados
  let embedPostado = new Discord.EmbedBuilder()
   // .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
    .setDescription(`Aqui estão todos os posts já postados.`) // Define a mensagem do embed
    .setColor("Green"); // Define a cor do embed

  let embedPendente = new Discord.EmbedBuilder()
  //.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }) // Define o autor do embed
  .setDescription(`Aqui estão todos os posts ainda não publicados.`) // Define a mensagem do embed
  .setColor("Blue"); // Define a cor do embed

  //Percorrendo os posts pendentes e adicionando no embed
  postsPendentes.forEach((post) => {
    embedPendente.addFields({
      name: `Post de ID: \`${post.id}\``,
      value: `Titulo: \`${post.titulo}\``
    });
  });

  //Percorrendo os posts postados e adicionando no embed
  postsPostados.forEach((post) => {
    embedPostado.addFields({
      name: `Post de ID: \`${post.id}\``,
      value: `Titulo: \`${post.titulo}\``
    });
  });

  //Verificando se já existe uma mensagem no canal de posts pendentes
  canalPendentes.messages.fetch({ limit: 1 }).then((messages) => {
    messages.forEach((message) => {
      message.delete();
    });
  });

  //Verificando se já existe uma mensagem no canal de posts postados
  canalPostados.messages.fetch({ limit: 1 }).then((messages) => {
    messages.forEach((message) => {
      message.delete();
    });
  });

  if(canalPendentes && canalPostados){
    //Enviando a mensagem no canal de posts pendentes
    canalPendentes.send({
      embeds: [embedPendente]
    });

    //Enviando a mensagem no canal de posts postados
    canalPostados.send({
      embeds: [embedPostado]
    });
  }
});


// Cria uma nova coleção para armazenar os comandos do bot
client.slashCommands = new Discord.Collection(); 

// Importa e executa o arquivo handler.js, responsável por registrar os comandos do bot
require('./handler')(client); 

// Inicia a conexão do bot com o servidor do Discord usando o token de acesso armazenado no arquivo config.json
client.login(config.TOKEN); 