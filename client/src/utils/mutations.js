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
    mutation addConcert($customId: String, $artists: String, $venue: String, $date: String, $times: String, $address: String, $website: String, $email: String, $ticketLink: String, $artistsLink: String) {
        addConcert(customId: $customId, artists: $artists, venue: $venue, date: $date, times: $times, address: $address, website: $website, email: $email, ticketLink: $ticketLink, artistsLink: $artistsLink) {
            _id
            artists
            venue
            date
            times
            address
            website
            email
            ticketLink
            artistsLink
        }
    }
`;

export const ADD_CONCERT_TO_USER = gql`
    mutation addConcertToUser($concertId: ID!) {
        addConcertToUser(concertId: $concertId) {
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
`;

export const DELETE_CONCERTS = gql`
    mutation deleteConcerts ($concertId: [ID]) {
        deleteConcerts(concertId: $concertId) {
            _id
        }
    }
`;

export const RSVP_YES = gql`
    mutation rsvpYes ($concertId: ID!, $userId: ID!) {
        rsvpYes(concertId: $concertId, userId: $userId) {
            _id
            artists
            yes {
                _id
            }
        }
    }
`;

export const CANCEL_RSVP_YES = gql`
    mutation cancelRsvpYes ($concertId: ID!, $userId: ID!) {
        cancelRsvpYes(concertId: $concertId, userId: $userId) {
            _id
            artists
            yes {
                _id
            }
        }
    }
`;

export const RSVP_NO = gql`
    mutation rsvpNo ($concertId: ID!, $userId: ID!) {
        rsvpNo(concertId: $concertId, userId: $userId) {
            _id
            artists
            no {
                _id
            }
        }
    }
`;

export const CANCEL_RSVP_NO = gql`
    mutation cancelRsvpNo ($concertId: ID!, $userId: ID!) {
        cancelRsvpNo(concertId: $concertId, userId: $userId) {
            _id
            artists
            no {
                _id
            }
        }
    }
`;

export const RSVP_MAYBE = gql`
    mutation rsvpMaybe ($concertId: ID!, $userId: ID!) {
        rsvpMaybe(concertId: $concertId, userId: $userId) {
            _id
            artists
            maybe {
                _id
            }
        }
    }
`;

export const CANCEL_RSVP_MAYBE = gql`
    mutation cancelRsvpMaybe ($concertId: ID!, $userId: ID!) {
        cancelRsvpMaybe(concertId: $concertId, userId: $userId) {
            _id
            artists
            maybe {
                _id
            }
        }
    }
`;
