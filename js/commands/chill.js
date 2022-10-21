// Imports
const UTILS = require("../utils");
const YTDL = require("ytdl-core");
const CONFIG = require("../../json/config.json");
const MSG = require("../../json/messages.json");

// Global Constants
const NAME = "chill";

// Exports
exports.name = NAME;
exports.aliases = ["c", "chillpop", "lofi", "lo-fi", "lf"];
exports.description = "I will start playing a set of chillpop music.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (message) {
  return new Promise((resolve, reject) => {
    const ctx = {
      user: message.author.tag,
      command: NAME,
      channel: message.author.channel,
    };

    if (!message.guild) {
      reject(MSG.chill.UNKNOWN_CHANNEL, ctx, true);
    }

    const botVC = message.member.voice.channel;
    if (botVC) {
      botVC
        .join()
        .then((connection) => {
          // Connection is an instance of VoiceConnection
          resolve(`Playing chill music in the ${botVC.name} voice channel`);

          // Function to walk through the chill mixes
          let shuffledChill = UTILS.shuffle(CONFIG.chill.mixes);
          (function chillOut(chilldex) {
            // Reshuffle if we've hit the end of the list
            if (chilldex && chilldex > shuffledChill.length) {
              shuffledChill = UTILS.shuffle(CONFIG.chill.mixes);
            }

            console.log(
              "Playing: " + shuffledChill[chilldex % shuffledChill.length]
            );

            const dispatcher = connection.play(
              YTDL(
                shuffledChill[chilldex % shuffledChill.length],
                CONFIG.chill.ytdlOptions
              ),
              CONFIG.chill.streamOptions
            );

            dispatcher.on("end", chillOut(chilldex + 1));
          })(0); // Call out chillOut function with 0 to start the process
        })
        .catch((err) => {
          reject(
            MSG.chill.UNABLE_TO_CONNECT,
            { ...ctx, voiceChannel: botVC.name },
            true
          );
          console.error(err);
        });
    } else {
      reject(MSG.chill.NOT_IN_VOICE_CHANNEL, ctx, true);
    }
  });
};
