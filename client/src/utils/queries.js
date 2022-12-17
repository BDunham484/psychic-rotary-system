import { gql } from '@apollo/client';

export const GET_TODAYS_CONCERTS = gql`
    query concerts($date: String) {
        concerts(date: $date) {
            artists
            description
            date
            times
            venue
            address
            website
            email
            ticketLink
        }
    }
`;

export const GET_CONCERTS_FOR_DATABASE = gql`
    query concertsForDatabase($date: String) {
        concertsForDatabase(date: $date) {
            customId
            artists
            date
            times
            venue
            address
            website
            email
            ticketLink
        }
    }
`;

export const QUERY_USER_CONCERTS = gql`
    query userConcerts($username: String) {
        userConcerts(username: $usernmae) {
            _id
            artists
            artistsLink
            description
            times
            venue
            address
            website
            email
            ticketLink
        }
    }
`;

export const QUERY_USER = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            concertCount
            concerts {
                _id
                artists
                artistsLink
                description
                times
                venue
                address
                website
                email
                ticketLink
            }
            friendCount
            friends {
                _id
                username
            }
        }
    }
`;

export const QUERY_ME = gql`
    {
        me {
            _id
            username
            email
            concertCount
            concerts {
                _id
                artists
                artistsLink
                description
                times
                venue
                address
                website
                email
                ticketLink
            }
            friendCount
            friends {
                _id
                username
            }
        }
    }
`;

export const QUERY_ME_BASIC = gql`
    {
        me {
            _id
            username
            email
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

export const GET_YESTERDAYS_CONCERTS = gql`
    query getYesterdaysConcerts($date: String!) {
        getYesterdaysConcerts(date: $date) {
            _id
            customId
            artists
            address
            venue
            date
            times
            email
            website
            ticketLink
            artistsLink
        }
    }
`;