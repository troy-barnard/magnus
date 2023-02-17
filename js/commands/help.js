// Imports
const Discord = require("discord.js");
const CONFIG = require("../../json/config.json");

// Global Constants
const NAME = "help";
const HELP_TITLE = "Hello I'm Magnus. Please refer to my command list below.";
const COMMANDS = [
  // For help, we want to import all the other commands to list them here.
  require("./chill"),
  require("./cointoss"),
  require("./memeCreate"),
  require("./memeList"),
  require("./movie"),
  require("./music"),
  require("./random"),
  require("./speak"),
  require("./stop"),
];

// Exports
exports.name = NAME;
exports.aliases = ["h", "halp", "how", "what", "huh"];
exports.description = "I will respond with this usage/help information.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (_message) {
  return new Promise((resolve, _reject) => {
    const embed = new Discord.MessageEmbed().setTitle(HELP_TITLE);

    for (let command of COMMANDS) {
      embed.addField(
        command.name,
        `${command.description}
        Example: ${command.example}`
      );
    }

    resolve(embed);
  });
};
