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
                    .populate('friends')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        //get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('concerts')
                .populate('friends')
        },
        //get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('concerts')
                .populate('friends')
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
        //scrape all concerts for the day
        concerts: async (parent, { date }) => {
            console.log(date);
            // const date = new Date().toDateString();
            const day = date.slice(8, 10);
            const month = (new Date().getMonth()) + 1;
            const year = new Date().getFullYear();
            console.log(year + '-' + month + '-' + day)

            const url = `https://www.austinchronicle.com/events/music/${year}-${month}-${day}/`
            try {
                const { data } = await axios.get(url);
                const $ = cheerio.load(data);
                var events = [];
                console.log($('ul:eq(-1)').length)
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
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(User);

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
        addConcert: async (parent, { event }) => {
            console.log(event);
            const concert = await Concert.create({ event });

            return concert;
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { friends: friendId }},
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addConcertToUser: async (parent, args, context) => {
            console.log(args);
            console.log(context.user)
            if (context.user) {
                const concert = await Concert.create({ ...args });
                
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { concerts: concert._id } },
                    { new: true }
                ).populate('concerts');
                console.log(concert._id);
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

                await Concert.findByIdAndDelete(
                    { _id: concertId }   
                )
        
                return user;
            }
        }
    }
};


module.exports = resolvers;