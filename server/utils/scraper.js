const axios = require('axios');
const cheerio = require('cheerio');
const { addConcert } = require('./addConcert');

module.exports = {
    // //scrape all concerts for the day
    // concertsForDatabase: async (date) => {
    //     //delcare empty array for dates
    //     const dateArr = [];
    //     //push todays date into dateArr
    //     dateArr.push(date);
    //     //function to get the next day based on the date passed in to it
    //     const nextDay = (date) => {
    //         const next = new Date(date);
    //         next.setDate(next.getDate() + 1);
    //         const theNextDay = next.toDateString();
    //         return theNextDay;
    //     }
    //     //save date to another variable for for loop
    //     let arrayDate = date;
    //     //for loop that continously gets upcoming dates and pushes them to array
    //     for (let i = 0; i < 1; i++) {
    //         let nextDate = nextDay(arrayDate);
    //         dateArr.push(nextDate);
    //         arrayDate = nextDate;
    //     }
    //     const concertData = [];
    //     await Promise.all(dateArr.map(async (date, index) => {
    //         // dateArr.map(async(date, index) => {
    //         // console.log("DATE: " + date)
    //         const day = date.slice(8, 10);
    //         const month = (new Date().getMonth()) + 1;
    //         const year = new Date().getFullYear();
    //         console.log('CONCERTSFORDATABASE-DATES');
    //         console.log(year + '-' + month + '-' + day)
    //         // const url = `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/page-2`
    //         const urlArr = [
    //             `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/`,
    //             `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/page-2`
    //         ];
    //         await Promise.all(urlArr.map(async (url, index) => {
    //             try {
    //                 const { data } = await axios.get(url);
    //                 const $ = cheerio.load(data);
    //                 var events = [];
    //                 if ($('ul:eq(-1)').length === 0) {
    //                     $('ul:eq(0) .list-item', data).each(function () {
    //                         const artists = $(this).find('h2').text()
    //                         const artistsLink = $(this).find('a').attr('href');
    //                         const description = $(this).find('.description').text()
    //                         const dateTime = $(this).find('.date-time').text()
    //                         const venue = $(this).find('.venue').text()
    //                         const headliner = artists.split(',')[0];
    //                         const customId = headliner.split(/[,.'\s]+/).join("") + date.split(/[,.'\s]+/).join("") + venue.split(/[,.'\s]+/).join("")
    //                         const timeArr = dateTime.split(",")
    //                         const timex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5]?[0-9]?)\s*([AaPp][Mm])/
    //                         let times
    //                         timeArr.map((time) => {
    //                             if (timex.test(time)) {
    //                                 times = time;
    //                                 return times;
    //                             }
    //                         })
    //                         events.push({
    //                             customId,
    //                             artists,
    //                             artistsLink,
    //                             description,
    //                             date,
    //                             times,
    //                             venue
    //                         })
    //                     })
    //                 } else {
    //                     $('ul:eq(-1) .list-item', data).each(function () {
    //                         const artists = $(this).find('h2').text()
    //                         const artistsLink = $(this).find('a').attr('href');
    //                         const description = $(this).find('.description').text()
    //                         const dateTime = $(this).find('.date-time').text()
    //                         const venue = $(this).find('.venue').text()
    //                         const headliner = artists.split(',')[0];
    //                         const customId = headliner.split(/[,.'\s]+/).join("") + date.split(/[,.'\s]+/).join("") + venue.split(/[,.'\s]+/).join("")
    //                         const timeArr = dateTime.split(",")
    //                         const timex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5]?[0-9]?)\s*([AaPp][Mm])/
    //                         let times
    //                         timeArr.map((time) => {
    //                             if (timex.test(time)) {
    //                                 times = time;
    //                                 return times;
    //                             }
    //                         })
    //                         events.push({
    //                             customId,
    //                             artists,
    //                             artistsLink,
    //                             description,
    //                             date,
    //                             times,
    //                             venue
    //                         })
    //                     })
    //                 }

    //                 const newEventsArr = await Promise.all(events.map((event) => {
    //                     const eventUrl = `https://www.austinchronicle.com${event.artistsLink}`;

    //                     let moreEventDetails = async () => {
    //                         var { data } = await axios.get(eventUrl)
    //                         var $ = cheerio.load(data);

    //                         $('.venue-details:eq(0)', data).each(function () {
    //                             var address = $(this).text();
    //                             event["address"] = address
    //                             return event;
    //                         })
    //                         $('.venue-details:eq(1)', data).each(function () {
    //                             var website = $(this).find('a').attr('href');
    //                             var email = $(this).find('b:eq(1)').text()
    //                             event["website"] = website
    //                             event["email"] = email
    //                             return event;
    //                         })
    //                         $('.ticket-link', data).each(function () {
    //                             var ticketLink = $(this).attr('href')
    //                             event["ticketLink"] = ticketLink
    //                             return event;
    //                         })
    //                         return event;
    //                     }
    //                     return moreEventDetails();
    //                 }, events))
    //             } catch (err) {
    //                 console.error(err);
    //             }
    //             concertData.push(events);
    //         }))
    //         // ^^^^^URLARR PROMISE END
    //     }))
    //     return concertData;
    // },
    //scrape all concerts for the day
    concertsForDatabase: async (date) => {
        //delcare empty array for dates
        const dateArr = [];
        //push todays date into dateArr
        dateArr.push(date);
        //function to get the next day based on the date passed in to it
        const nextDay = (date) => {
            const next = new Date(date);
            next.setDate(next.getDate() + 1);
            const theNextDay = next.toDateString();
            return theNextDay;
        }
        //save date to another variable for for loop
        let arrayDate = date;
        //for loop that continously gets upcoming dates and pushes them to array
        for (let i = 0; i < 1; i++) {
            let nextDate = nextDay(arrayDate);
            dateArr.push(nextDate);
            arrayDate = nextDate;
        }
        const concertData = [];
        await Promise.all(dateArr.map(async (date, index) => {
            // dateArr.map(async(date, index) => {
            // console.log("DATE: " + date)
            const day = date.slice(8, 10);
            const month = (new Date().getMonth()) + 1;
            const year = new Date().getFullYear();
            console.log('CONCERTSFORDATABASE-DATES');
            console.log(year + '-' + month + '-' + day)
            // const url = `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/page-2`
            const urlArr = [
                `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/`,
                `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/page-2`
            ];
            await Promise.all(urlArr.map(async (url, index) => {
                try {
                    const { data } = await axios.get(url);
                    const $ = cheerio.load(data);
                    var events = [];
                    if ($('ul:eq(-1)').length === 0) {
                        $('ul:eq(0) .list-item', data).each(function () {
                            const artists = $(this).find('h2').text()
                            const artistsLink = $(this).find('a').attr('href');
                            const description = $(this).find('.description').text()
                            const dateTime = $(this).find('.date-time').text()
                            const venue = $(this).find('.venue').text()
                            const headliner = artists.split(',')[0];
                            const customId = headliner.split(/[,.'\s]+/).join("") + date.split(/[,.'\s]+/).join("") + venue.split(/[,.'\s]+/).join("")
                            const timeArr = dateTime.split(",")
                            const timex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5]?[0-9]?)\s*([AaPp][Mm])/
                            let times
                            timeArr.map((time) => {
                                if (timex.test(time)) {
                                    times = time;
                                    return times;
                                }
                            })
                            events.push({
                                customId,
                                artists,
                                artistsLink,
                                description,
                                date,
                                times,
                                venue
                            })
                        })
                    } else {
                        $('ul:eq(-1) .list-item', data).each(function () {
                            const artists = $(this).find('h2').text()
                            const artistsLink = $(this).find('a').attr('href');
                            const description = $(this).find('.description').text()
                            const dateTime = $(this).find('.date-time').text()
                            const venue = $(this).find('.venue').text()
                            const headliner = artists.split(',')[0];
                            const customId = headliner.split(/[,.'\s]+/).join("") + date.split(/[,.'\s]+/).join("") + venue.split(/[,.'\s]+/).join("")
                            const timeArr = dateTime.split(",")
                            const timex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):?([0-5]?[0-9]?)\s*([AaPp][Mm])/
                            let times
                            timeArr.map((time) => {
                                if (timex.test(time)) {
                                    times = time;
                                    return times;
                                }
                            })
                            events.push({
                                customId,
                                artists,
                                artistsLink,
                                description,
                                date,
                                times,
                                venue
                            })
                        })
                    }

                    const newEventsArr = await Promise.all(events.map((event) => {
                        const eventUrl = `https://www.austinchronicle.com${event.artistsLink}`;

                        let moreEventDetails = async () => {
                            var { data } = await axios.get(eventUrl)
                            var $ = cheerio.load(data);

                            $('.venue-details:eq(0)', data).each(function () {
                                var address = $(this).text();
                                event["address"] = address
                                return event;
                            })
                            $('.venue-details:eq(1)', data).each(function () {
                                var website = $(this).find('a').attr('href');
                                var email = $(this).find('b:eq(1)').text()
                                event["website"] = website
                                event["email"] = email
                                return event;
                            })
                            $('.ticket-link', data).each(function () {
                                var ticketLink = $(this).attr('href')
                                event["ticketLink"] = ticketLink
                                return event;
                            })
                            return event;
                        }
                        return moreEventDetails();
                    }, events))
                } catch (err) {
                    console.error(err);
                }
                concertData.push(events);
            }))
            // ^^^^^URLARR PROMISE END
        }))
        await Promise.all(concertData.map(async (dailyArr) => {
            console.log('DAILYARR');
            console.log(dailyArr);
            await Promise.all(dailyArr.map(async (concert) => {
                console.log('CONCERT WITHI UPDATER MAP');
                console.log(concert);
                try {
                    await addConcert({
                        variables: { ...concert }
                    })
                } catch (e) {
                    console.error(e)
                }
            }))
        }))
    }
}
