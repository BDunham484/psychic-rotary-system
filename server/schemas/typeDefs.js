//import the gql tagged template function
const { gql } = require('apollo-server-express');

//create typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        concertCount: Int
        concerts: [Concert]
    }

    type Concert {
        _id: ID
        date: String
        artists: [String]
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
        me: User
        users: [User]
        user(username: String!): User
        concerts(username: String): [Concert]
        concert(_id: ID!): Concert
        getArtists: Concert
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addConcert(event: String): Concert
        addConcertToUser(_id: ID): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

//export typeDefs
module.exports = typeDefs;