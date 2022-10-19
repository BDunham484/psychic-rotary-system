//import the gql tagged template function
const { gql } = require('apollo-server-express');

//create typeDefs
const typeDefs = gql`
    type Concert {
        _id: ID
        date: Date
        event: String
        headliner: String
        support: String
        price: Int
        time: Int
        venue: String
        address: String
        city: String
        state: String
        zip: Int
    }

    type Query {
        concerts: [Concert]
    }
`;

//export typeDefs
module.exports = typeDefs;