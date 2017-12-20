const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(config.discord.token);
