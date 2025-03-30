const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const omdb = require('../../../apis/omdb-v2.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('movie')
		.setDescription('Replies with movie details')
        .addStringOption(option =>
            option.setName('movie')
                .setDescription('The name of the movie')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('year')
                .setDescription('Release year of the movie')
        ),
	async execute(interaction) {
        console.log(`executing slash command: movie`);
        const movieName = interaction.options.getString('movie');
        const year = interaction.options.getString('year') ?? '';
        console.log('movieName:', movieName);
        console.log('year:', year)
        json = await omdb.query(movieName, year, 'movie');
        if (json.Title) {
            const ratings = json.Ratings;
            let ratingsString = "";

            const embed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle(json.Title)
              .setDescription(json.Plot)
              .addFields({name: "Starring", value: json.Actors, inline: false})
              .addFields(
                {name: "Released", value: json.Released, inline: true},
                {name: "Genre", value: json.Genre, inline: true},
                {name: "Rated", value: json.Rated, inline: true},
                {name: "Directed By", value: json.Director, inline: true},
                {name: "Runtime", value: json.Runtime, inline: true},
              );

              if (json.Runtime) {
                const runtime = json.Runtime.split(' ')[0];
                var tight90 = "🙅‍♂️";
                if (runtime > 80 && runtime < 100) {
                  tight90 = "👌";
                }
                embed.addFields({name: "TIGHT 90", value: tight90, inline: true});

              }

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
            await interaction.reply({embeds: [embed]});
          } else {
            await interaction.reply('Whoopsies! Apparently failure _was_ an option.');
          }
	},
};