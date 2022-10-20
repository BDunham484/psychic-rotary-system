const { User, Concert } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
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
        concerts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Concert.find(params).sort({ date: -1 });
        },
        //get a concert by ID
        concert: async (parent, { _id }) => {
            return Concert.findOne({ _id });
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
        }
    }
};


module.exports = resolvers;