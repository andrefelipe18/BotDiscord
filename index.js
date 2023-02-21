const Discord = require("discord.js");
const client = new Discord.Client({ intents: [1, 512, 32768, 2, 128] });
const config = require("./config.json");
const fs = require("fs");

client.login(config.TOKEN)

// Criando novas coleções para guardar comandos e aliases
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// Lendo diretório de comandos e armazenando em uma coleção
client.categories = fs.readdirSync(`./commands/`);

fs.readdirSync('./commands/').forEach(local => {
  // Filtrando arquivos que terminam em '.js'
  const comandos = fs.readdirSync(`./commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

  for (let file of comandos) {
    // Requerendo cada arquivo de comando
    let puxar = require(`./commands/${local}/${file}`)

    // Adicionando comando na coleção 'client.commands'
    if (puxar.name) {
      client.commands.set(puxar.name, puxar)
    } 

    // Adicionando aliases na coleção 'client.aliases'
    if (puxar.aliases && Array.isArray(puxar.aliases)) {
      puxar.aliases.forEach(x => client.aliases.set(x, puxar.name))
    }
  } 
});

// Escutando eventos 'messageCreate'
client.on("messageCreate", async (message) => {

  // Definindo prefixo
  let prefix = config.prefix;

  // Verificando se a mensagem foi enviada por um bot ou se é uma mensagem direta
  if (message.author.bot) return;
  if (message.channel.type === Discord.ChannelType.DM) return;     

  // Verificando se a mensagem começa com o prefixo
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

  // Separando argumentos e comando da mensagem
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase()

  // Verificando se o comando é válido
  if (cmd.length === 0) return;
  let command = client.commands.get(cmd)
  if (!command) command = client.commands.get(client.aliases.get(cmd))

  // Executando o comando
  try {
    command.run(client, message, args)
  } catch (err) { 
    console.error('Erro:' + err); 
  }
});

// Escutando evento 'ready'
client.on("ready", () => {
  console.log(`🔥 Estou online em ${client.user.username}!`)
})