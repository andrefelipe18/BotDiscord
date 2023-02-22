const fs = require("fs")

module.exports = async (client) => {

// Cria um array vazio para armazenar os comandos de slash
const SlashsArray = []

// Lê o diretório "Comandos"
fs.readdir(`./Comandos`, (error, folder) => {
  // Para cada subdiretório dentro de "Comandos"
  folder.forEach(subfolder => {
    // Lê os arquivos dentro do subdiretório
    fs.readdir(`./Comandos/${subfolder}/`, (error, files) => { 
      // Para cada arquivo dentro do subdiretório
      files.forEach(files => {
        // Verifica se o arquivo termina com ".js"
        if(!files?.endsWith('.js')) return;
        // Importa o arquivo como um módulo e atribui ao objeto "files"
        files = require(`../Comandos/${subfolder}/${files}`);
        // Verifica se o objeto "files" tem uma propriedade "name"
        if(!files?.name) return;
        // Registra o comando de slash no objeto "client.slashCommands"
        client.slashCommands.set(files?.name, files);
        // Adiciona o comando ao array "SlashsArray"
        SlashsArray.push(files)
      });
    });
  });
});

// Quando o cliente estiver pronto
client.on("ready", async () => {
  // Para cada servidor em que o bot está
  client.guilds.cache.forEach(guild => {
    // Registra os comandos de slash usando o array "SlashsArray"
    guild.commands.set(SlashsArray)
  });
});

};
