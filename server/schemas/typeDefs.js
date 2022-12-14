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
        customId: String
        artists: String
        artistsLink: String
        description: String
        date: String
        times: String
        venue: String
        address: String
        website: String
        email: String
        ticketLink: String
        yes: [User]
        no: [User]
        maybe: [User]
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        userConcerts(username: String): [Concert]
        concert(concertId: ID!): Concert
        concerts(date: String): [Concert]
        allConcerts: [Concert]
        concertsFromDb(date: String!): [Concert]
        austinConcertScraper(date: String): [[Concert]]
        getYesterdaysConcerts(date: String!): [Concert]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addConcert(customId: String, artists: String, venue: String, date: String, times: String, address: String, website: String, email: String, ticketLink: String, artistsLink: String): Concert
        addConcertsToDatabase(customId: String, artists: String, venue: String, date: String, times: String, address: String, website: String, email: String, ticketLink: String, artistsLink: String): [Concert]
        addFriend(friendId: ID!): User
        addFriendByUsername(username: String!): User
        addConcertToUser(concertId: ID!): User
        deleteConcert(concertId: ID!): Concert
        deleteConcerts(concertId: [ID]): Concert
        deleteConcertFromUser(concertId: ID!): User
        rsvpYes(concertId: ID!, userId: ID!): Concert
        cancelRsvpYes(concertId: ID!, userId: ID!): Concert
        rsvpNo(concertId: ID!, userId: ID!): Concert
        cancelRsvpNo(concertId: ID!, userId: ID!): Concert
        rsvpMaybe(concertId: ID!, userId: ID!): Concert
        cancelRsvpMaybe(concertId: ID!, userId: ID!): Concert
    }

    type Auth {
        token: ID!
        user: User
    }
`;

//export typeDefs
module.exports = typeDefs;