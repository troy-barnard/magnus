const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');
const http = require('http')
const url = require('url');
//const { Client, MessageAttachment, MessageEmbed } = require('discord.js');

const commands = require('../json/commands.json');
const chillMixes = require('../json/chill.json').mixes;
const config = require('./config.js');
const keys = require('../json/api-keys.json')
const omdbKey = keys["omdb"]

const client = new Discord.Client();

const functions = {
  'help': handleHelp,
  'h': handleHelp,
  'chill': handleChill,
  'c': handleChill,
  'movie': handleMovie,
  'm': handleMovie 
}

// Main Method
function main () {
  client.on('ready', () => {
    console.log('I am ready!')
    // Set presence
    //client.user.setActivity("m.help for commands");
    console.log(omdbKey)
    //handleMovie("bloodsport")
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

function handleMovie(message) {
    let command = message.content.split(' ')[0]
    let query = message.content.replace(command, '').trim()
    if (query != '') {
    console.log("handle movie query: ", query)      
      http.get('http://www.omdbapi.com/?t=' + query + '&apikey=' + omdbKey, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            //console.log("PARSED DATA \n")
            //console.log(parsedData);
            movieReply(message, parsedData);
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });

  }
}

function movieReply(message, data) {
  if (data.Title != null) {
    let ratings = data.Ratings
    let ratingsString = ''
    const exampleEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setImage(data.Poster)
    .setTitle(data.Title)
    .addField( 'Year', data.Year)
    .addField('Rated', data.Rated)
    .addField('Directed By', data.Director)
    .addField('Staring', data.Actors)
    .addField('Plot', data.Plot)
    
    if (ratings) {
      ratings.forEach(r => {
        //console.log(r)
        let source = r.Source
        let score = r.Value
        ratingsString += `___${source}___: ${score} \n`
        exampleEmbed.addField(source + ': ', score)
      })
    }
    message.reply(exampleEmbed);
  } else {
    message.reply("Sorry bud, I couldn't find any results for that.")
  }
    
}

main()
