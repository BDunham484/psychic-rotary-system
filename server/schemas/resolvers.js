// const { User, Concert } = require('../models');
const User = require('../models/User');
const Concert = require('../models/Concert');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
// const { getArtists } = require('../utils/scraper');
const axios = require('axios');
const cheerio = require('cheerio');

const resolvers = {
    Query: {
        //get the current logged-in User
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('concerts')
                    .populate('friends');

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        //get all users
        users: async () => {
            
            const users =  User.find()
                .select('-__v -password')
                .populate('concerts')
                .populate('friends');
            
            console.log(users);
            return users
        },
        //get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('concerts')
                .populate('friends');
        },
        //get all concerts by username.  If no username, get all concerts
        userConcerts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Concert.find(params).sort({ date: -1 });
        },
        //get a concert by ID
        concert: async (parent, { _id }) => {
            return Concert.findOne({ _id });
        },
        //get all concerts in database
        concertsFromDb: async (parent, { date }) => {
            const concerts = await Concert.find({
                date: date
            })
            .sort({ venue: 'asc'})
            .exec();

            return concerts
        },
        //scrape all concerts for the day
        concerts: async (parent, { date }) => {
            // const date = new Date().toDateString();
            const day = date.slice(8, 10);
            const month = (new Date().getMonth()) + 1;
            const year = new Date().getFullYear();

            const url = `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/`
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
                        events.push({
                            artists,
                            artistsLink,
                            description,
                            dateTime,
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
                        events.push({
                            artists,
                            artistsLink,
                            description,
                            dateTime,
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
                return events;
            } catch (err) {
                console.error(err);
            }
        },
        allConcerts: async () => {
            const concerts = await Concert.find();

            return concerts;
        },
        //scrape all concerts for the day
        austinConcertScraper: async (parent, { date }) => {
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
            for (let i = 0; i < 15; i++) {
                let nextDate = nextDay(arrayDate);
                dateArr.push(nextDate);
                arrayDate = nextDate;
            }
            const concertData = [];
            await Promise.all(dateArr.map(async (date, index) => {
                const day = date.slice(8, 10);
                const month = (new Date().getMonth()) + 1;
                const year = new Date().getFullYear();
                console.log('CONCERTSFORDATABASE-DATES');
                console.log(year + '-' + month + '-' + day)
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
            return concertData;
        },
        getYesterdaysConcerts: async (parent, { date }) => {
            console.log('GETYESTERDAYSCONCERTS HAS RUN');
            const yesterdaysConcerts = await Concert.find({ date: date })
                .exec();

            return yesterdaysConcerts;
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addConcert: async (parent, { ...data }) => {
            await Concert.findOne({ 'customId': data.customId }, async (err, custom) => {
                if (err) return handleError(err);

                if (custom) {
                    const savedConcertId = {
                        _id: custom._id
                    }
                    const update = {
                        artists: data.artists,
                        venue: data.venue,
                        date: data.date,
                        dateTime: data.dateTime,
                        address: data.address,
                        website: data.website,
                        email: data.email,
                        ticketLink: data.ticketLink,
                    }
                    const updatedConcert = await Concert.findByIdAndUpdate(
                        savedConcertId,
                        update,
                        { new: true }
                    )
                    console.log('UPDATEDCONCERT');
                    console.log(updatedConcert);
                    return updatedConcert;
                } else {
                    const concert = await Concert.create({ ...data })
                    // .select(-__v);
                    console.log('SAVEDCONCERT');
                    console.log(concert);
                    return concert;
                }
            })
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError('Youj need to be logged in!');
        },
        addConcertToUser: async (parent, { concertId }, context) => {
            console.log(concertId);
            console.log(context.user)
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // { $addToSet: { concerts: concertId } },
                    { $push: { concerts: concertId } },
                    { new: true }
                ).populate('concerts');

                return user;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        deleteConcertFromUser: async (parent, { concertId }, context) => {
            if (context.user) {

                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { concerts: concertId } },
                    { new: true }
                );

                return user;
            }
        },
        deleteConcert: async (parent, { id }) => {
            const concert = await Concert.deleteOne({ id });
            return concert;
        },
        deleteConcerts: async (parent, { concertId }) => {
            console.log('DELETED IDS');
            console.log(concertId);
            const concerts = await Concert.deleteMany({
                _id: { $in: concertId }
            });
            return concerts
        }
    }
};

module.exports = resolvers;