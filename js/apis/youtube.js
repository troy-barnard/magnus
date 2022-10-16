// Imports
const ytsr = require("ytsr");

// Global constants
const OPTIONS = {
  pages: 1,
};

exports.search = function (queryString) {
  return new Promise((resolve, reject) => {
    ytsr
      .getFilters(queryString)
      .then((filters1) => {
        const filter1 = filters1.get("Type").get("Video");
        try {
          ytsr(filter1.url, OPTIONS)
            .then((searchResults) => {
              const playbackURL = searchResults.items[0].url;
              resolve(playbackURL);
            })
            .catch((e) => reject());
        } catch {
          reject();
        }
      })
      .catch((e) => reject());
  });
};
