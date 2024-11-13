// Imports
const Discord = require("discord.js");
const CONFIG = require("../../json/config.json");
const UTILS = require("../utils");
const https = require("https");
const { hostname } = require("os");
const path = require("path");
const fetch = require('node-fetch');

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
  return new Promise(async (resolve, _reject) => {
    try {
      var options = {
        headers: {
          Authorization: " Bearer BQAKqNM22ABACfD9HHjuwAznmd2UDpOQGusTcA4JqLiY6GpLTlaSflf0FXMLh_RH3Jgi2GKVe3qAeyRbbQHaJXVDc8tIl6yTdM7zgOW_G9uIR1edGvQ"
        } 
      }
      // https.get('https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl', options, (response) => {
      //   const { statusCode } = response;
      //   const contentType = response.headers["content-type"];

      //   let error;
      //   if (statusCode !== 200) {
      //     error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      //   } else if (!/^application\/json/.test(contentType)) {
      //     error = new Error(
      //       "Invalid content-type.\n" +
      //         `Expected application/json but received ${contentType}`
      //     );
      //   }

      //   if (error) {
      //     // Consume response data to free up memory
      //     response.resume();
      //     reject(error);
      //     return;
      //   }
      //   res.on('data', (d) => {
      //     process.stdout.write(d);
      //   });

      //   response.setEncoding("utf8");
      //   let rawData = "";
      //   response.on("data", (chunk) => {
      //     rawData += chunk;
      //   });
      //   let parsedData = null;
      //   response.on("end", () => {
      //     try {
      //       parsedData = JSON.parse(rawData);
      //     } catch (e) {
      //       reject(e);
      //     }
      //   });

        // TODO: if auth fails get a new toke from spotify!!!!
    //     curl -X POST "https://accounts.spotify.com/api/token" \
    //  -H "Content-Type: application/x-www-form-urlencoded" \
    //  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"

        const response = await fetch('https://api.spotify.com/v1/tracks/7n1ViWkFunumzMPfjNVLz4', options);
        if (!response.ok) {
          resolve(`Network response was not ok: ${response.status}`);
        }
        const parsedData = await response.json();
        const album = parsedData.album;
        const albumArtURL = album.images[0].url;
        const albumName = album.name
        const artistsName = parsedData.artists[0].name;
        // TODO: Concat a string of all artists
        // parsedData.artists.array.forEach(artist => {
        //   ar
        // });
        const trackName = parsedData.name;
        const preview_url = parsedData.preview_url;
        const queryString = _message.content
            .slice(_message.content.indexOf(" "))
            .trim();
        const embed = new Discord.MessageEmbed()
            // .setDescription(trackName + ' by ' + artistsName)
            .setURL(preview_url)
            // .setImage(albumArtURL)
            .setThumbnail(albumArtURL)
            .addField('\uD83C\uDFB6', trackName)
            .addField("\uD83D\uDCBF", albumName)
            .addField('\uD83D\uDC64', artistsName)
            .addField('\u200B', preview_url);
          // .addFields(
          //   {name: "Inline", value: queryString, inline: true},
          //   {name: "Not Inline", value: queryString, inline: false}
          // );
        resolve(embed);
      // }).on("error", e => {
      //   console.log(e)
      //   reject(e.message)
      // });
      // http.get()
      
    } catch (e) {
      console.error(e);
      resolve("Unable to embed :(");
    }
  });
};
