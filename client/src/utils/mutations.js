import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_CONCERT = gql`
    mutation addConcert($artists: String, $venue: String, $date: String, $dateTime: String, $address: String, $website: String, $email: String, $ticketLink: String, $artistsLink: String) {
        addConcert(artists: $artists, venue: $venue, date: $date, dateTime: $dateTime, address: $address, website: $website, email: $email, ticketLink: $ticketLink, artistsLink: $artistsLink) {
            _id
            artists
            venue
            date
            dateTime
            address
            website
            email
            ticketLink
            artistsLink
        }
    }
`;

export const ADD_CONCERT_TO_USER = gql`
    mutation addConcertToUser($artists: String, $description: String, $venue: String, $dateTime: String, $address: String, $website: String, $email: String, $ticketLink: String, $artistsLink: String) {
        addConcertToUser(artists: $artists, description: $description, venue: $venue, dateTime: $dateTime, address: $address, website: $website, email: $email, ticketLink: $ticketLink, artistsLink: $artistsLink) {
            concerts {
                _id
            }
        }
    }
`;

export const DELETE_CONCERT_FROM_USER = gql`
    mutation deleteConcertFromUser($concertId: ID!) {
        deleteConcertFromUser(concertId: $concertId) {
            _id
            username
            email
            concertCount
            concerts {
                _id
            }
        }
    }
`;

export const ADD_FRIEND = gql`
    mutation addFriend($id: ID!) {
        addFriend(friendId: $id) {
            _id
            username
            concertCount
            concerts {
                _id
                artists
            }
            friendCount
            friends {
                _id
                username
            }
        }
    }
`
