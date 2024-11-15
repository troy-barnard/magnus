// Imports
const Discord = require("discord.js");
const CONFIG = require("../../json/config.json");
const UTILS = require("../utils");
const https = require("https");
const { hostname } = require("os");
const path = require("path");
const fetch = require('node-fetch');
const fs = require('fs');
const secretsFileName = '../../json/secrets.json';

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
    const content = _message.content;
    const params = content.trim().split(" ");
    try {
      const embedValue = params[1];
      // let trackID = '7n1ViWkFunumzMPfjNVLz4'
      let trackID = ''
      if (embedValue != '') {
        trackID = embedValue.substring(embedValue.lastIndexOf('/') + 1);
      }  
      let response = await getTrackFromSpotify(trackID);
      // If Access Denied, refresh token and try again
      if (response.status == 401) {
        await setNewBearerToken();
        response = await getTrackFromSpotify(trackID);
      }
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
      const spotifyAppURL = parsedData.external_urls.spotify;
      const embed = new Discord.MessageEmbed()
          .setDescription(
                `"${trackName}"
                ${albumName} (${album.release_date.split('-')[0]})
                _${artistsName}_
                [Open In Spotify](${spotifyAppURL})`
            )
          // .setURL(spotifyAppURL)
          .setThumbnail(albumArtURL)
      resolve(embed);
    } catch (e) {
      console.error(e);
      resolve("Unable to embed :(");
    }
  });
};

async function getTrackFromSpotify(trackID) {
  const secrets = require("../../json/secrets.json");
  var options = {
    headers: {
      Authorization: ` Bearer ${secrets.spotify.token}` 
    } 
  }
  return await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, options);
}

async function setNewBearerToken() {
  const secrets = require("../../json/secrets.json");
  var options = {
    body: `grant_type=client_credentials&client_id=${secrets.spotify.client_id}&client_secret=${secrets.spotify.client_secret}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  }
  const tokenResponse = await fetch(`https://accounts.spotify.com/api/token`, options);
  // EXAMPLE RESPONSE
  // {
  //  "access_token": "NgCXRKc...MzYjw",
  //  "token_type": "bearer",
  //  "expires_in": 3600
  // }
  const data = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error("Yikes, do not go in there!");
  } else {
    // get lastest version of secrets
    const secrets = require("../../json/secrets.json");
    // store spotify access_token
    const freshToken = data.access_token;
    secrets.spotify.token = freshToken;
    // write current secrets object to secrets.json
    fs.writeFile(secretsFileName, JSON.stringify(secrets), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(secrets));
      console.log('writing to ' + secretsFileName);
    });
  }
}