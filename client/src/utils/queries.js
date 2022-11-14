import { gql } from '@apollo/client';

export const GET_TODAYS_CONCERTS = gql`
    query concerts($test: String) {
        concerts(test: $test) {
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