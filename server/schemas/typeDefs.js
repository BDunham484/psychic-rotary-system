//import the gql tagged template function
const { gql } = require('apollo-server-express');

//create typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        concertCount: Int
        friendCount: Int
        concerts: [Concert]
        friends: [User]
    }

    type Concert {
        _id: ID
        artists: String
        artistsLink: String
        description: String
        date: String
        dateTime: String
        venue: String
        address: String
        website: String
        email: String
        ticketLink: String
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        userConcerts(username: String): [Concert]
        concert(_id: ID!): Concert
        concerts(date: String): [Concert]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addConcert(event: String): Concert
        addConcertsToDatabase(date: String!): Concert
        addFriend(friendId: ID!): User
        addFriendByUsername(username: String!): User
        addConcertToUser(artists: String, description: String, venue: String, dateTime: String, address: String, website: String, email: String, ticketLink: String, artistsLink: String): User
        deleteConcertFromUser(concertId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

//export typeDefs
module.exports = typeDefs;