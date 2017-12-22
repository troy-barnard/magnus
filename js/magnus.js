const Discord = require('discord.js');
const fs = require('fs');
const music = require('discord.js-music-v11');

const commands = require('../json/commands.json');
const config = require('./config.js');

const client = new Discord.Client();
music(client, {
	prefix: 'm.',        // Prefix of '-'.
	global: false,      // Server-specific queues.
	maxQueueSize: 10,   // Maximum queue size of 10.
	clearInvoker: true//, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
    // channel: 'music'    // Name of voice channel to join. If omitted, will instead join user's voice channel.
});
const functions = {
  "help" : handleHelp,
  "h" : handleHelp,
  "play" : handleMusic,
  "skip" : handleMusic,
  "queue" : handleMusic,
  "pause" : handleMusic,
  "resume" : handleMusic,
  "volume" : handleMusic,
  "leave" : handleMusic,
  "clearqueue" : handleMusic
}


// Main Method
function main() {
  client.on('ready', () => {
    console.log('I am ready!');
    // Set presence
    client.user.setGame("m.help for commands");
    // set-up music player
    // music(client, musicOptions);
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
    if (functions[command] != undefined) {
      console.log(functions[command]);
      functions[command](message);
    } else {
      // Command started with 'm.' but is not supported
      message.reply("Did not recognize command '" + command + "'");
    }
  }
}

function handleHelp(message) {
  let embed = new Discord.RichEmbed()
    .setTitle("Hello I'm Magnus. Please refer to my command list below.");
  Object.entries(commands).forEach( (command) => {
    let response = Object.entries(command)[1][1];
    embed.addField(response.name, response.description+"\nExample: "+response.example);
  })

  message.channel.send(embed);
}

function handleSpeak(message) {

}

function handleChill(message) {

  if (!message.guild) {
    message.reply("Sorry, you must make this command in a public channel.")
    return;
  }

  if (message.member.voiceChannel) {

    // message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
    //     message.reply('I have successfully connected to the channel!');
    //
    //   })
      // .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

function handleStop(message) {
  console.log("client.voiceChannel", client.user);
  if (client.VoiceConnections) {
    client.voiceConnections[0].channel.leave();
    message.reply("I have disconnected from the voice channel.")
  }
}

function handleMusic(message) {

}

main();
