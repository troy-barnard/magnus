// Imports
const ytdl = require("ytdl-core");
const youtube = require("../apis/youtube");
const CONFIG = require("../../json/config.json");
const MSG = require("../../json/messages.json");

// Global Constants
const NAME = "music";

// Exports
exports.name = NAME;
exports.aliases = ["play", "tunes", "tonadas"];
exports.description =
  "I will attempt to find the music you specify in YouTube and play it into your voice channel.";
exports.example = `${CONFIG.commandPrefix}${NAME} wellerman`;
exports.handleMessage = function (message) {
  return new Promise((resolve, reject) => {
    const queryString = message.content
      .slice(message.content.indexOf(" "))
      .trim();

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
      botVC.join().then((connection) => {
        resolve(`Playing in the ${botVC.name} voice channel`);

        youtube.search(queryString).then((playbackURL) => {
          console.log("Search result", playbackURL);

          const dispatcher = connection.play(
            // TODO: consider renaming these config options to be more generic
            ytdl(playbackURL, CONFIG.chill.ytdlOptions),
            CONFIG.chill.playOptions
          );

          dispatcher.on("finish", () => connection.disconnect());
        });
      });
    }
  });
};
