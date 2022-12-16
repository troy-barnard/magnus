const chalk = require("chalk");

Object.prototype.map =
  Object.prototype.map ||
  function (func, init) {
    "use strict";
    let result = []; // init === undefined || init === null ? "" : init;
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        let value = this[key];

        if (result instanceof Array) {
          result = [...result, func(key, value)];
        } else {
          result = result + func(key, value);
        }
      }
    }
    return result;
  };

// Ripped from https://stackoverflow.com/a/18234317
String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }

    return str;
  };

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomNum = randomNum;

// https://stackoverflow.com/a/6274381/13661060
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
exports.shuffle = shuffle;

function joinArgs(args) {
  let msg = "";
  for (let arg of args) {
    msg += `${arg} `;
  }
  return msg.trim();
}

function logSuccess() {
  msg = joinArgs(arguments);
  console.log(chalk.green("[+]") + " " + msg + "!");
}

function logError() {
  msg = joinArgs(arguments);
  console.error(chalk.red("[-]") + " " + msg + "!");
}

function logWarning() {
  msg = joinArgs(arguments);
  console.warn(chalk.yellow("[!]") + " " + msg + ".");
}

function logInfo() {
  msg = joinArgs(arguments);
  console.log(chalk.blue("[*]") + " " + msg + ".");
}

const logs = {
  warning: logWarning,
  error: logError,
  success: logSuccess,
  info: logInfo,
};

// Takes a config message obj, any arguments to replace in the string
// and optionally the discord message object in case we want to reply there too
function log(messageObj, args, discordMessage) {
  const logf = logs[messageObj.console.type];
  logf(messageObj.console.message.formatUnicorn(args));
  discordMessage &&
    discordMessage.reply(messageObj.discord.formatUnicorn(args));
}
exports.log = log;
