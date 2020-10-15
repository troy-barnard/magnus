// Third party imports
const Discord = require('discord.js');

// Local imports
const Utils = require('./utils');
const handlers = require('./handlers');
const MSG = require('../json/messages.json');
const config = require('../json/config.json');
const discordToken = require('../json/secrets.json').discord.auth.token;

// Main function
function main () {
  Utils.log(MSG.MAGNUS_INIT);
  const client = new Discord.Client();
  
  // Register discord event handlers
  client.on('ready', onReady.bind(null, client));
  client.on('message', sendMessageToHandler);

  // Log Magnus into the discord
  client.login(discordToken);
}

// Function that runs after Magnus is initialized
// and is logged into Discord
function onReady(client) {
  Utils.log(MSG.MAGNUS_ONLINE, {"user": client.user.tag});
}

// Function that cleans a message to be sent to an appropriate handler function
function sendMessageToHandler(message) {
  // Get up to first space in message
  const end = message.content.indexOf(" ");
  const messagePrefix = message.content.slice(0, end === -1? undefined : end);

  // Check if the first characters up to the command prefix are in fact the command prefix. 
  if (messagePrefix.slice(0, config.commandPrefix.length) === config.commandPrefix) {
    // if so, remove the prefix and get the actual command issued to us
    const command = messagePrefix.slice(config.commandPrefix.length);

    // If we have a handler defined, execute it with the message and reply with the result
    if (handlers[command] !== undefined) {

      handlers[command](message).then(data => {
        // All handlers should resolve with data that can be replied with.
        Utils.log(MSG.SUCCESSFUL_COMMAND, {"user": message.author.tag, "action": command});
        message.reply(data);

      }).catch((msg, data, sendToDiscord) => {

        // All handlers should reject with a MSG object, any data to fill in with it,
        // and a boolean to indicate if there's a message to send to discord with it.
        if (msg.console) {
          Utils.log(msg, data, sendToDiscord? message : null);
        } else {
          // If the reject didn't conform to this "standard", it's likely a reject that happened in an "unexpected" situation
          const situation = {
            "command": command,
            "args": ''.join(arguments.map((x, i) => `arg[${i}]: ${x}`))
          };
          Utils.log(MSG.FAILURE_COMMAND, situation, message);
        }

      });

    } else {
      // Otherwise, we got a message that started with the command prefix but has no handler defined
      const situation = {"user": message.author.tag, "action": command};
      Utils.log(MSG.UNKNOWN_COMMAND, situation, message);

    }

  }
}

// Run our main function
main()