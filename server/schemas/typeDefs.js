//import the gql tagged template function
const { gql } = require('apollo-server-express');

//create typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        isAdmin: Boolean
        concertCount: Int
        concerts: [Concert]
        requestCount: Int
        friendCount: Int
        friends: [User]
        receivedCount: Int
        receivedRequests: [User]
        sentCount: Int
        sentRequests: [User]
        blockedCount: Int
        blockedUsers: [User]
    }

    type CustomId {
        headliner: String
        date: String
        venue: String
        times: String
    }

    input CustomIdInput {
        headliner: String
        date: String
        venue: String
        times: String
    }

    type Concert {
        _id: ID
        customId: CustomId
        artists: String
        artistsLink: String
        description: String
        date: String
        times: String
        venue: String
        address: String
        address2: String
        phone: String
        website: String
        email: String
        ticketLink: String
        ticketPrice: String
        status: String
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
        concertsSortByVenueAsc(date: String!): [Concert]
        concertsSortByVenueDesc(date: String!): [Concert]
        concertsSortByArtistsAsc(date: String!): [Concert]
        concertsSortByArtistsDesc(date: String!): [Concert]
        austinConcertScraper(date: String): [[Concert]]
        getYesterdaysConcerts(date: String!): [Concert]
        allVenues: [String]
        concertsByVenue(venue: String!): [Concert]
        concertByCustomId(headliner: String!, date: String!, venue: String!, times: String): Concert
        lastConcertDate: String
        concertDates(startDate: String!, endDate: String!): [String]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addConcert(customId: CustomIdInput, artists: String, venue: String, date: String, times: String, address: String, address2: String, phone: String, website: String, email: String, ticketLink: String, ticketPrice: String, artistsLink: String, description: String, status: String): Concert
        addConcertsToDatabase(customId: CustomIdInput, artists: String, venue: String, date: String, times: String, address: String, address2: String, phone: String, website: String, email: String, ticketLink: String, artistsLink: String, status: String): [Concert]
        addFriend(friendId: ID!): User
        addConcertToUser(concertId: ID!): User
        deleteUser(userId: ID!): String
        deleteConcert(concertId: ID!): Concert
        deleteConcerts(concertId: [ID]): Concert
        deleteConcertFromUser(concertId: ID!): User
        deleteOldConcerts(date: String!): Int
        rsvpYes(concertId: ID!, userId: ID!): Concert
        cancelRsvpYes(concertId: ID!, userId: ID!): Concert
        rsvpNo(concertId: ID!, userId: ID!): Concert
        cancelRsvpNo(concertId: ID!, userId: ID!): Concert
        rsvpMaybe(concertId: ID!, userId: ID!): Concert
        cancelRsvpMaybe(concertId: ID!, userId: ID!): Concert
        clearRsvp(concertId: ID!, userId: ID!): Concert
        sendRequest(friendId: ID!, friendName: String!): User
        cancelRequest(friendId: ID!, friendName: String!): String
        acceptRequest(senderId: ID! senderName: String!): String
        declineRequest(senderId: ID!, senderName: String!): String
        removeFriend(friendId: ID!): User
        blockUser(blockedId: ID!): User
        unblockUser(blockedId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

//export typeDefs
module.exports = typeDefs;