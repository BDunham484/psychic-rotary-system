import { gql } from '@apollo/client';

export const ADD_CONCERT_TO_USER = gql`
    mutation addConcertToUser($artists: String, $description: String, $venue: String, $dateTime: String, $address: String, $website: String, $email: String, $ticketLink: String, $artistsLink: String) {
        addConcertToUser(artists: $artists, description: $description, venue: $venue, dateTime: $dateTime, address: $address, website: $website, email: $email, ticketLink: $ticketLink, artistsLink: $artistLink) {
            concerts {
                artists
                artistsLink
                description
                dateTime
                venue
                address
                website
                email
                ticketLink
                _id
            }
        }
    }
`;