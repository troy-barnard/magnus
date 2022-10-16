// Imports
const meme = require("./imgflip");
const MSG = require("../../json/messages.json");

// Global Constants
const NAME = "meme";

// Exports
exports.name = NAME;
exports.aliases = [
  "makememe",
  "maymay",
  "imagemacro",
  "creatememe",
  "create_meme",
  "make_meme",
  "image_macro",
];
exports.description = "I will create a meme as you specify.";
exports.example = `${CONFIG.commandPrefix}${NAME} 1 something\\else`;
exports.handleMessage = function (message) {
  return new Promise((resolve, reject) => {
    try {
      const content = message.content;
      const params = content.trim().split(" ");
      const memeIndex = params[1];
      const substrIndex = content.indexOf(memeIndex) + memeIndex.length;
      const textBoxes = content.substring(substrIndex).split("\\");
      resolve(meme.caption_image(memeIndex, textBoxes));
    } catch (e) {
      reject(MSG.meme.UNABLE_TO_CONNECT_TO_IMGFLIP, { error: e }, true);
    }
  });
};
