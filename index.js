const { Client, Events, GatewayIntentBits, Collection } = require('discord.js'); //Código base para o bot do discord
// Criando um novo cliente com as intenções de guildas(servidores)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// importando o .env para pegar os tokens
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

//Importação dos métodos do node
const fs = require('node:fs');
const path = require('node:path');

//Importando os comandos
const commandsPath = path.join(__dirname, 'slash_commands'); //pegando o caminho dos comandos
const commandsFiles = fs.readdirSync(commandsPath).filter(arquivo => arquivo.endsWith('.js')); //pegando os arquivos .js

client.commands = new Collection(); //criando uma coleção de comandos (array)

for(const arquivo of commandsFiles) { //percorrendo o array de arquivos acima e pegando o comando
    const arquivoCaminho = path.join(commandsPath, arquivo); //pegando o caminho do arquivo
    const comando = require(arquivoCaminho); //pegando o comando 
    if("data" in comando && "execute" in comando) { //verificando se o comando tem os métodos necessários
        client.commands.set(comando.data.name, comando); //setando o comando na coleção
    }
    else{
        console.log(`O comando ${arquivo} não tem os métodos necessários!`);
    }
}


// Quando o cliente estiver pronto, executar este código
// 'c' será o nosso cliente, pode nomear como quiser
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Logado em: ${c.user.tag}`);
});

// Quando o cliente receber uma interação, executar este código 
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isCommand()) return; //verificando se a interação é um comando

    const comando = client.commands.get(interaction.commandName); //pegando o comando
    if(!comando) return; //verificando se o comando existe

    try {
        await comando.execute(interaction); //executando o comando
    } catch (error) {
        console.error(error); //mostrando o erro no console
        await interaction.reply({ content: 'Ocorreu um erro ao executar o comando!', ephemeral: true }); //resposta do comando
    }
})



// Logando o cliente com o token
client.login(TOKEN);