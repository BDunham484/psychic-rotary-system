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

export const ADD_CONCERT_TO_USER = gql`
    mutation addConcertToUser($artists: String, $description: String, $venue: String, $dateTime: String, $address: String, $website: String, $email: String, $ticketLink: String, $artistsLink: String) {
        addConcertToUser(artists: $artists, description: $description, venue: $venue, dateTime: $dateTime, address: $address, website: $website, email: $email, ticketLink: $ticketLink, artistsLink: $artistsLink) {
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
