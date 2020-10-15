// Third part imports
const Discord = require("discord.js");
const ytdl = require('ytdl-core');

// Local imports
const omdb = require("./omdb");
const Utils = require('./utils');
const commands = require('../json/commands.json');
const config = require('../json/config.json');
const chillMixes = config.chill.mixes;


const handlers = {
  'help': handleHelp,
  'h': handleHelp,
  'chill': handleChill,
  'c': handleChill,
  'movie': handleMovie,
  'm': handleMovie,
  'meme': handleMeme,
  'speak': handleSpeak
}
module.exports = handlers;


function handleHelp (_message) {
  return new Promise((resolve, reject) => {
    const embed = new Discord.MessageEmbed()
      .setTitle('Hello I\'m Magnus. Please refer to my command list below.')
    
    for (let command in commands) {
      let cmd = commands[command];
      embed.addField(
        cmd.name,
        `${cmd.description}
        Example: ${cmd.example}`
      );
    }

    resolve(embed);
  });
}

function handleSpeak(_message) {
  return new Promise((resolve, reject) => {
    resolve('Bark!');
  })
}

function handleChill(message) {
  return new Promise((resolve, reject) => {

    const ctx = {
      "user": message.author.tag,
      "action": "chill",
      "channel": message.author.channel
    };

    if (!message.guild) {
      reject(MSG.chill.UNKNOWN_CHANNEL, ctx, true);
    }

    const botVC = message.member.voice.channel;
    if (botVC) {
      botVC.join().then(connection => { // Connection is an instance of VoiceConnection
        resolve(`Playing chill music in the ${botVC.name} voice channel`);

        // Choose a random stream
        const rdm = Utils.randomNum(0, chillMixes.length - 1)
        console.log(chillMixes[rdm])

        const dispatcher = connection.play(
          ytdl(chillMixes[rdm], config.chill.ytdlOptions),
          config.chill.streamOptions
        );

        dispatcher.on('end', () => {
          // The song has finished
          botVC.leave();
        });

      }).catch(err => {
        reject(MSG.chill.UNABLE_TO_CONNECT, {...ctx, "voiceChannel": botVC.name}, true);
        console.error(err);
      });
    } else {
      reject(MSG.chill.NOT_IN_VOICE_CHANNEL, ctx, true);
    }

  });
}

function handleMovie(message) {
  return new Promise((resolve, reject) => {
    const queryString = message.content.slice(message.content.indexOf(" ")).trim();
    if (queryString) {
      omdb.query(queryString).then(json => {
        if (json.Title) {
          const ratings = json.Ratings;
          let ratingsString = '';
          const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setImage(json.Poster)
            .setTitle(json.Title)
            .addField('Year', json.Year)
            .addField('Rated', json.Rated)
            .addField('Directed By', json.Director)
            .addField('Staring', json.Actors)
            .addField('Plot', json.Plot);
          
          ratings && ratings.forEach(r => {
            //console.log(r)
            let source = r.Source;
            let score = r.Value;
            ratingsString += `___${source}___: ${score} \n`;
            embed.addField(`${source}: `, score);
          });
          resolve(embed);
        } else {
          resolve("Sorry bud, I couldn't find any results for that.");
        }
      }).catch(err => {
        console.error(err);
        resolve('I had a problem getting information on that one...');
      });
    } else {
      resolve('You need to provide a movie for me to lookup.');
    }
  });
}

function handleMeme(message) {
  return new Promise((resolve, reject) => {
    resolve("memes.");
  });
}