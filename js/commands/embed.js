// Imports
const Discord = require("discord.js");
const CONFIG = require("../../json/config.json");
const UTILS = require("../utils");


// Global Constants
const NAME = "embed";

// Exports
exports.name = NAME;
exports.aliases = [
  "embed",
  "e"
];
exports.description =
  "I will attempt to embed a link.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (_message) {
  return new Promise((resolve, _reject) => {
    try {
      const queryString = _message.content
          .slice(_message.content.indexOf(" "))
          .trim();
      const embed = new Discord.MessageEmbed()
          .setDescription(queryString)
          .setURL(queryString)
          .setImage(queryString)
          .setThumbnail(queryString)
          // .addFields(
          //   {name: "Inline", value: queryString, inline: true},
          //   {name: "Not Inline", value: queryString, inline: false}
          // );
      resolve(embed);
    } catch (e) {
      console.error(e);
      resolve("Unable to embed :(");
    }
  });
};
