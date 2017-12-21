const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');

const commands = require('../json/commands.json');
const functions = {
  "help" : handleHelp,
  "speak" : handleSpeak
}

// Main Method
function main() {
  client.on('ready', () => {
    console.log('I am ready!');
  });

  client.on('message', message => {
    handleMessage(message);
  });

  client.login(config.discord.token);
}

function handleMessage(message) {
  let command = message.content.split(' ')[0];
  if (command.startsWith("m.")) {
    command = command.replace("m.","");
    if (commands[command] != undefined) {
      console.log(functions[command]);
      functions[command](message);
    } else {
      console.log("Did not recognize command '" + command + "'");
    }
  }
}

function handleHelp(message) {
  let embed = new Discord.RichEmbed()
    .setTitle("Hello I'm Magnus. Please refer to my command list below.");
  Object.entries(commands).forEach( (command) => {
    let response = Object.entries(command)[1][1];
    embed.addField(response.name, response.description);
  })

  message.channel.send(embed);
}

function handleSpeak(message) {

}

main();
