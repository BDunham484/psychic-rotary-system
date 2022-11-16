import { gql } from '@apollo/client';

export const GET_TODAYS_CONCERTS = gql`
    query concerts($date: String) {
        concerts(date: $date) {
            artists
            description
            dateTime
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
                dateTime
                venue
                address
                website
                email
                ticketLink
            }
        }
    }
`;