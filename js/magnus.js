const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

const commands = require('../json/commands.json');
const chillMixes = require('../json/chill.json').mixes;
const config = require('./config.js');

const client = new Discord.Client();

const functions = {
  'help': handleHelp,
  'h': handleHelp,
  'chill': handleChill,
  'c': handleChill
}

// Main Method
function main () {
  client.on('ready', () => {
    console.log('I am ready!')
    // Set presence
    client.user.setActivity("m.help for commands");
    // downloadMix(0)
  });

  client.on('message', message => {
    handleMessage(message)
  })

  client.login(config.discord.token)
}

function handleMessage (message) {
  let command = message.content.split(' ')[0]
  if (command.startsWith('m.')) {
    command = command.replace('m.', '')
    if (functions[command] !== undefined) {
      functions[command](message)
    } else {
      // Command started with 'm.' but is not supported
      message.reply('Did not recognize command ' + command)
    }
  }
}

function handleHelp (message) {
  let embed = new Discord.RichEmbed()
    .setTitle('Hello I\'m Magnus. Please refer to my command list below.')
  Object.entries(commands).forEach((command) => {
    let response = Object.entries(command)[1][1]
    embed.addField(response.name, response.description + '\nExample: ' +
      response.example)
  })

  message.channel.send(embed);
}

function handleSpeak(message) {
  message.reply('Bark!')
}

function handleChill(message) {

  if (!message.guild) {
    message.reply("Sorry, you must make this command in a public channel.")
    return;
  }

  if (message.member.voiceChannel) {
    let botVC = message.member.voiceChannel
    botVC.join().then(connection => { // Connection is an instance of VoiceConnection
        message.reply('Playing chill music on Voice Channel: ' + botVC.name);
        // choose a random stream
        let rdm = randomNum(0, chillMixes.length - 1)
        console.log(chillMixes[rdm])
        const streamOptions = { seek: 0, volume: 0.025 };
        let stream = ytdl(chillMixes[rdm], { quality: 'lowest', filter: 'audioonly'})
        const dispatcher = connection.playStream(stream, streamOptions);
        dispatcher.on('end', () => {
          // The song has finished
          botVC.leave()
        });
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

main()
