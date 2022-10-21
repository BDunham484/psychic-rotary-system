import axios from "axios";
import cheerio from "cheerio";
// const axios = require('axios');
// const cheerio = require('cheerio');


const url = 'https://www.austinchronicle.com/events/music/2022-10-21/'


export function getTodaysEvents() {
    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const events = [];
            $('.list-item', html).each(function() {
                const artists = $(this).find('h2').text()
                const description = $(this).find('.description').text()
                const dateTime = $(this).find('.date-time').text()
                const venue = $(this).find('.venue').text()
                events.push({
                    artists,
                    description,
                    dateTime,
                    venue
                })
            })
            console.log('events scraper!!!!!');
            console.log(events);
            return events;
        }).catch(err => console.log(err));
}
    

