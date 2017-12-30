const Discord = require('discord.js')
const music = require('discord.js-music-v11')

const commands = require('../json/commands.json')
const config = require('./config.js')

const client = new Discord.Client()
music(client, {
  prefix: 'm.',
  global: false,
  maxQueueSize: 10,
  clearInvoker: true
})
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
    client.user.setGame('m.help for commands')
  })

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
  message.channel.send(embed)
}

function handleMusic () {
  // music is handled
}

main()
