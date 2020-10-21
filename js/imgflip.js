const https = require("https");
const { HTTPError } = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const axios = require('axios');
const { resolve } = require("path");

const imgFlipConfig = require('../json/secrets.json').imgflip;

function get_memes() {
    return new Promise((resolve, reject) => {
        // const url = new URL(imgFlipConfig.host + '/get_memes');
        https.get('https://api.imgflip.com/get_memes', response => {
            const { statusCode } = response;
            const contentType = response.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`);
            }

            if (error) {
                // Consume response data to free up memory
                response.resume();
                reject(error);
                return;
            }

            response.setEncoding('utf8');
            let rawData = '';
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                let parsedData = null;
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    reject(e);
                }
                resolve(parsedData);
            });
        }).on('error', reject);
    });
}

async function caption_image(memeIndex, text0, text1) {
    let memes = await this.get_memes()
    // console.log("template_id", memeIndex)
    memes = memes.data.memes
    // console.log(memes)
    let meme = memes[memeIndex]
    // console.log(memeIndex, meme)
    let template_id = meme.id
    return new Promise((resolve, reject) => {
        const url = new URL(imgFlipConfig.host + '/caption_image');
        url.searchParams.set("template_id", template_id);
        url.searchParams.set("username", imgFlipConfig.auth.username);
        url.searchParams.set("password", imgFlipConfig.auth.password);
        url.searchParams.set("text0", text0);
        if (text1.trim() != '') {
            url.searchParams.set("text1", text1);
        }

        // console.log("URL:", url.toString())
        var config = {
            method: 'get',
            url: url.toString(),
            headers: { 
                'Cookie': '__cfduid=d266394907f11b256842c115a33244dd01603173343'
            }
        };
        
        return axios(config)
        .then(function (response) {
            // console.log(JSON.stringify(response.data.data));
            resolve(response.data.data.url)
        //   console.log("It worked I promise")
        })
        .catch(function (error) {
            // console.log(error);
            reject(error);
        });    
    });

}

exports.get_memes = get_memes;
exports.caption_image = caption_image;