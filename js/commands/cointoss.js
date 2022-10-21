// Imports
const CONFIG = require("../../json/config.json");
const UTILS = require("../utils");

// Global Constants
const NAME = "cointoss";

// Exports
exports.name = NAME;
exports.aliases = [
  "flip",
  "coinflip",
  "headsortails",
  "hort",
  "5050",
  "toss",
  "coin",
];
exports.description =
  "I will flip a coin and tell you whether it was heads or tails.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (_message) {
  return new Promise((resolve, _reject) => {
    resolve(UTILS.randomNum(0, 1) ? "Heads" : "Tails");
  });
};
