// Imports
const ytdl = require("ytdl-core");
const youtube = require("../apis/youtube");
const CONFIG = require("../../json/config.json");
const MSG = require("../../json/messages.json");

// Global Constants
const NAME = "stop";

// Exports
exports.name = NAME;
exports.aliases = ["stop", "pause", "kill"];
exports.description =
  "I will attempt to kill voice channel.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
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

    const botVoiceState = message.member.voice;
    if (botVoiceState) {
      console.log(`Disconnecting from ${botVoiceState.channel.name}`);
      try {
        message.guild.me.voice.channel.leave();
      } catch (error) {
        console.error(error);
      }
      resolve(`I Die in voice channel`);
    }
  });
};
