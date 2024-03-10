// Imports
const Discord = require("discord.js");
const omdb = require("../apis/omdb");
const youtube = require("../apis/youtube");
const CONFIG = require("../../json/config.json");
const MSG = require("../../json/messages.json");

// Global Constants
const NAME = "series";

// Exports
exports.name = NAME;
exports.aliases = ["tv", "t", "ser"];
exports.description = "I will search IMDB for information on a series series.";
exports.example = `${CONFIG.commandPrefix}${NAME} shogun`;
exports.handleMessage = function (message) {
  return new Promise((resolve, reject) => {
    const queryString = message.content
      .slice(message.content.indexOf(" "))
      .trim();

    const ctx = {
      user: message.author.tag,
      command: NAME,
      channel: message.author.channel,
    };

    if (queryString) {
      omdb
        .query(queryString, 'series')

        // OMDB query results handler
        .then((json) => {
          if (json.Title) {
            const ratings = json.Ratings;
            let ratingsString = "";

            const embed = new Discord.MessageEmbed()
              .setColor("#0099ff")
              .setTitle(json.Title)
              .setDescription(json.Plot)
              .addFields({name: "Staring", value: json.Actors, inline: false})
              .addFields(
                {name: "Released", value: json.Released, inline: true},
                {name: "Genre", value: json.Genre, inline: true},
                {name: "Rated", value: json.Rated, inline: true},
                {name: "Directed By", value: json.Director, inline: true},
                {name: "Seasons", value: json.totalSeasons, inline: true},
              );

            const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(json.Poster);

            if (valid) {
              try {
                embed.setThumbnail(json.Poster);
              } catch (e) {
                // reject("Error occurred setting url for poster image.");

                // Let's just log that we failed here, but go ahead and continue with the post.
                console.log("Error occurred setting url for poster image.", e);
              }
            }

            ratings &&
              ratings.forEach((r) => {
                let source = r.Source;
                let score = r.Value;
                ratingsString += `___${source}___: ${score} \n`;
                embed.addFields({name:`${source} `, value: score, inline: true});
              });

            const youtubeQueryString = `${json.Title} trailer ${json.Year}`;
            try {
              youtube
                .search(youtubeQueryString)
                .then((playbackURL) => {
                  // embed.addField("Trailer", playbackURL);
                  message.channel.send(playbackURL);
                  resolve(embed);
                })

                .catch((e) => {
                  // Let's log that we couldn't find it at least.
                  console.log(
                    "Error getting Youtube trailer for",
                    youtubeQueryString,
                    e
                  );

                  // Just return the embed without the youtube series trailer, it's fine.
                  resolve(embed);
                });
            } catch (e) {
              // Let's log that we couldn't find it at least.
              console.log(
                "Error getting Youtube trailer for",
                youtubeQueryString,
                e
              );

              // Just return the embed without the youtube series trailer, it's fine.
              resolve(embed);
            }
          } else {
            reject(
              MSG.series.NO_SERIES_RESULTS,
              { ...ctx, series: queryString },
              true
            );
          }
        })

        // OMDB query failure
        .catch((err) => {
          reject(
            MSG.series.UNABLE_TO_CONNECT_TO_OMDB,
            { ...ctx, series: queryString, error: err },
            true
          );

          // Kinda superfluous, but w/e.
          console.error(err);
        });
    } else {
      reject(MSG.series.NO_SERIES_PROVIDED, ctx, true);
    }
  });
};
