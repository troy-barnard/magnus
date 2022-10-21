// Imports
const CONFIG = require("../../json/config.json");

// Global Constants
const NAME = "speak";

// Exports
exports.name = NAME;
exports.aliases = ["yo", "hello", "hi", "alive", "ping", "woof", "hey", "test"];
exports.description = "I will bark!";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (_message) {
  return new Promise((resolve, _reject) => {
    resolve("Bark!");
  });
};
