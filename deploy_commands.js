const { REST, Routes } = require('discord.js'); //Código base para o bot do discord

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

const commands = [];
for(const arquivo of commandsFiles) { //percorrendo o array de arquivos acima e pegando o comando
    const comando = require(`./slash_commands/${arquivo}`); //pegando o comando
    commands.push(comando.data.toJSON()); //setando o comando na coleção
}

//Instancia do REST
const rest = new REST({ version: "10" }).setToken(TOKEN); //criando um novo REST para enviar os comandos para o discord


// Enviando os comandos para o discord
(async () => { 
	try {
		console.log(`Começando a atualização de ${commands.length} comadnos de (/).`);

		// Enviando os comandos para o discord 
		const data = await rest.put( //enviando os comandos para o discord
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), //enviando os comandos para o servidor
			{ body: commands }, 
		);

		console.log(`${data.length} comandos atualizados com sucesso!`); //mostrando no console que os comandos foram enviados
	} catch (error) {
		// Mostrando o erro no console
        console.error(`Erro ao enviar comandos: ${JSON.stringify(error)}`);
		console.error(error);
	}
})();