const Discord = require("discord.js"); // Importa a biblioteca discord.js
const config = require("./config.json"); // Importa as configurações do bot do arquivo config.json

//Model de Post
const Post = require("./Model/Post.js");

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

// Cria uma nova coleção para armazenar os comandos do bot
client.slashCommands = new Discord.Collection(); 

// Importa e executa o arquivo handler.js, responsável por registrar os comandos do bot
require('./handler')(client); 

// Inicia a conexão do bot com o servidor do Discord usando o token de acesso armazenado no arquivo config.json
client.login(config.TOKEN); 