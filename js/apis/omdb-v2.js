const http = require("http");
const secrets = require("../../json/secrets.json").omdb;
const config = require("../../json/config.json").omdb;

exports.query = function (queryString, year, typeString) {
  return new Promise((resolve, reject) => {
    const url = new URL(config.host);
    url.searchParams.set("apikey", secrets.auth.key);
    try {
      if (year.trim() != '') {
        url.searchParams.set("y", year);
      }
    } catch (e) {
      console.log(e);
    }
    url.searchParams.set("t", queryString);
    if (typeString.toLowerCase() === 'movie' || typeString.toLowerCase() === 'series') {
      url.searchParams.set("type", typeString);
    }
    

    http
      .get(url.toString(), (response) => {
        const { statusCode } = response;
        const contentType = response.headers["content-type"];

        let error;
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            "Invalid content-type.\n" +
              `Expected application/json but received ${contentType}`
          );
        }

        if (error) {
          // Consume response data to free up memory
          response.resume();
          reject(error);
          return;
        }

        response.setEncoding("utf8");
        let rawData = "";
        response.on("data", (chunk) => {
          rawData += chunk;
        });
        response.on("end", () => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch (e) {
            reject(e);
          }

          resolve(parsedData);
        });
      })
      .on("error", reject);
  });
};
