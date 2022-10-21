const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.austinchronicle.com/events/music/2022-10-21/'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const artistsArr = [];
        $('h2', html).each(function() {
            const artists = $(this).text()
            artistsArr.push({
                artists
            })
        })
        console.log(artistsArr);
    }).catch(err => console.log(err));