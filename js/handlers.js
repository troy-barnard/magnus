// Third party imports
const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

// Local imports
const omdb = require("./omdb");
const meme = require("./imgflip");
const Utils = require('./utils');
const commands = require('../json/commands.json');
const config = require('../json/config.json');
const chillMixes = config.chill.mixes;
const MSG = require('../json/messages.json');


const handlers = {
  'help': handleHelp,
  'h': handleHelp,
  'chill': handleChill,
  'c': handleChill,
  'movie': handleMovie,
  'm': handleMovie,
  'meme': handleMeme,
  'memelist': handleGetMemes,
  'memeslist': handleGetMemes,
  'ml': handleGetMemes,
  'speak': handleSpeak,
  'hi': handleSpeak,
  'random': handleRandom,
  'roll': handleRandom,
  'r': handleRandom,
  'flip': handleFlip,
  'cointoss': handleFlip,
  'play': handlePlay,
  'p': handlePlay
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

        const shuffledChill = shuffle(chillMixes);
        (function chillOut(chilldex) {
          console.log("Playing: " + shuffledChill[chilldex % shuffledChill.length])
          const dispatcher = connection.play(
            ytdl(
              shuffledChill[chilldex % shuffledChill.length],
              config.chill.ytdlOptions
            ),
            config.chill.streamOptions
          );
          if (chilldex < shuffledChill.length) {
            dispatcher.on('finish', () => chillOut(chilldex + 1));
          }
          else {
            dispatcher.on('finish', () => connection.disconnect()); // disconnect if out of chill music to play
          }
        })(0);

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
          console.log("JSON>>>>>\n",json);
          const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(json.Title)
            .addField('Year', json.Year)
            .addField('Rated', json.Rated)
            .addField('Directed By', json.Director)
            .addField('Staring', json.Actors)
            .addField('Plot', json.Plot);
          let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(json.Poster);
          if (valid) {
            try {
              embed.setImage(json.Poster)
            } catch(e) {
              reject('Error occurred setting url for poster image.')
            }
          }
          ratings && ratings.forEach(r => {
            let source = r.Source;
            let score = r.Value;
            ratingsString += `___${source}___: ${score} \n`;
            embed.addField(`${source} `, score);
          });
          try {
            searchYT(json.Title + " trailer").then(playbackURL => {
              embed.addField('Trailer', playbackURL);
              message.channel.send(playbackURL);
              resolve(embed);
            })
          } catch {
            resolve(embed);
          }
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
    try {
      let content = message.content
      let params = content.trim().split(" ")
      let memeIndex = params[1]
      let substrIndex = content.indexOf(memeIndex) + memeIndex.length
      let textBoxes = content.substring(substrIndex).split('\\')
      resolve(meme.caption_image(memeIndex, textBoxes));
    } catch (e) {
      reject(e)
    }
  });
}

function handleGetMemes(message) {
  return new Promise((resolve, reject) => {
    try {
      resolve(meme.getMemeList())
    } catch (e) {
      reject(e)
    }
  });
}

// Takes a maximum number to roll between
function handleRandom(message) {
  return new Promise((resolve, reject) => {
    const max = parseInt(message.content.slice(message.content.indexOf(" ")).trim(), 10) || 20;
    resolve(Utils.randomNum(0, max));
  });
}

function handleFlip(message) {
  return new Promise((resolve, reject) => {
    resolve(Utils.randomNum(0, 1) ? 'Heads': 'Tails');
  });
}

function handlePlay(message) {
  return new Promise((resolve, reject) => {
    const queryString = message.content.slice(message.content.indexOf(" ")).trim();

    const ctx = {
      "user": message.author.tag,
      "action": "play",
      "channel": message.author.channel
    };

    if (!message.guild) {
      reject(MSG.chill.UNKNOWN_CHANNEL, ctx, true);
    }

    const botVC = message.member.voice.channel;
    if (botVC) {
      botVC.join().then(connection => { 
        resolve(`Playing in the ${botVC.name} voice channel`);
        searchYT(queryString).then(playbackURL => {
          console.log("Search result", playbackURL)
          const dispatcher = connection.play(
            ytdl(
              playbackURL,
              config.chill.ytdlOptions
            ),
            config.chill.playOptions
          );
          dispatcher.on('finish', () => connection.disconnect());
        })
      })
    }
  })
}

function searchYT(queryString) {
  return new Promise((resolve, reject) => {
    ytsr.getFilters(queryString).then(filters1 => {
      const filter1 = filters1.get('Type').get('Video');
      const options = {
        pages: 1,
      };
      try {
        ytsr(filter1.url, options).then(searchResults => {
          let playbackURL = searchResults.items[0].url;
          resolve(playbackURL);
        });
      } catch {
        reject();
      }
    });
  })
}

function shuffle(stringArray) {
  return stringArray.sort(() => Math.random() - 0.5);
}