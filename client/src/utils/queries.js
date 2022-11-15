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