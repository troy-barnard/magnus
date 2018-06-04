const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

const commands = require('../json/commands.json');
const chillStreams = require('../json/chill.json').streams;
const config = require('./config.js');

const client = new Discord.Client();

const functions = {
  'help': handleHelp,
  'h': handleHelp,
  'play': handleMusic,
  'skip': handleMusic,
  'queue': handleMusic,
  'pause': handleMusic,
  'resume': handleMusic,
  'volume': handleMusic,
  'leave': handleMusic,
  'clearqueue': handleMusic
}

// Main Method
function main () {
  client.on('ready', () => {
    console.log('I am ready!')
    // Set presence
    client.user.setActivity("m.help for commands");
    // set-up music player
    ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
    .pipe(fs.createWriteStream('stream.mp4'));
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
    message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
        message.reply('I have successfully connected to the channel!');
        // choose a random stream
        let rdm = randomNum(0, chillStreams.length - 1)
        console.log(chillStreams[rdm])
        ytdl(chillStreams[rdm])
        .pipe(fs.createWriteStream('stream.mp3'))
        .on('finish', () => {
          console.log('download done')
          const dispatcher = connection.playFile('stream.mp3');
            dispatcher.on('end', () => {
            // The song has finished
            message.member.voiceChannel.leave();
          });
        });
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

function handleMusic () {
  // music is handled
}

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
