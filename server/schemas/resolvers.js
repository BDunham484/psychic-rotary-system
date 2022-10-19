const { User, Concert } = require('../models');

const resolvers = {
    Query: {
        concerts: async () => {
            return Concert.find().sort({ date: -1 });
        }
    }
};


module.exports = resolvers;