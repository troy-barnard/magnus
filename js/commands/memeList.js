// Imports
const meme = require("../apis/imgflip");

// Global Constants
const NAME = "memes";

// Exports
exports.name = NAME;
exports.aliases = [
  "ml",
  "maymays",
  "memelist",
  "meme_list",
  "listmeme",
  "listmemes",
  "list_meme",
  "list_memes",
  "mememenu",
  "memesmenu",
  "meme_menu",
  "memes_menu",
  "imagemacros",
  "image_macros",
];
exports.description = "I will list the available memes.";
exports.example = `${CONFIG.commandPrefix}${NAME}`;
exports.handleMessage = function (_message) {
  return new Promise((resolve, reject) => {
    try {
      resolve(meme.getMemeList());
    } catch (e) {
      reject(MSG.memes.UNABLE_TO_CONNECT_TO_IMGFLIP, { error: e }, true);
    }
  });
};
