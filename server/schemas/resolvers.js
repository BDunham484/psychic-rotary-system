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
                const userData = await User.findOne({ _id: context.user._id})
                    .select('-__v -password')
                    .populate('concerts');
            
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        //get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('concerts');
        },
        //get user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('concerts');
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
        concerts: async () => {
            const url = 'https://www.austinchronicle.com/events/music/2022-10-21/'
            try{
                const { data } = await axios.get(url);
                const $ = cheerio.load(data);
                const events = [];
                $('.list-item', data).each(function() {
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
        addConcertToUser: async (parent, { _id }, context) => {
            console.log(_id);
            console.log(context.user)
            if (context.user) {
                const concert = await Concert.findOne({ _id: _id });

                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { concerts: concert }},
                    { new: true }
                );
                console.log(concert);
                return user;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};


module.exports = resolvers;