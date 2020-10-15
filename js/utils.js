const chalk = require("chalk");

// Ripped from https://stackoverflow.com/a/18234317
String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
};
exports.randomNum = randomNum;

function joinArgs(args) {
    let msg = "";
    for (let arg of args) {
        msg += `${arg} `;
    }
    return msg.trim();
}

function logSuccess() {
    msg = joinArgs(arguments);
    console.log(
        chalk.green("[+]") + " " +
        msg +
        "!"
    );
}

function logError() {
    msg = joinArgs(arguments);
    console.error(
        chalk.red("[-]") + " " +
        msg +
        "!"
    );
}

function logWarning() {
    msg = joinArgs(arguments);
    console.warn(
        chalk.yellow("[!]") + " " +
        msg +
        "."
    );
}

function logInfo() {
    msg = joinArgs(arguments);
    console.log(
        chalk.blue("[*]") + " " +
        msg +
        "."
    );
}

const logs = {
    'warning': logWarning,
    'error': logError,
    'success': logSuccess,
    'info': logInfo
}

// Takes a config message obj, any arguments to replace in the string
// and optionally the discord message object in case we want to reply there too
function log(messageObj, args, discordMessage) {
    const logf = logs[messageObj.console.type];
    logf(messageObj.console.message.formatUnicorn(args));
    discordMessage && discordMessage.reply(messageObj.discord.formatUnicorn(args));
}
exports.log = log;