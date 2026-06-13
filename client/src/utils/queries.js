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
            phone
            website
            email
            ticketLink
            ticketPrice
        }
    }
`;

export const GET_CONCERTS_BY_DATE = gql`
    query concertsFromDb($date: String!) {
        concertsFromDb(date: $date) {
            _id
            artists
            customId {
                headliner
                date
                venue
            }
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
        }
    }
`;
export const GET_CONCERTS_SORTED_BY_VENUE_ASC = gql`
    query concertsSortByVenueAsc($date: String!) {
        concertsSortByVenueAsc(date: $date) {
            _id
            artists
            customId {
                headliner
                date
                venue
            }
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            maybe { _id }
        }
    }
`;
export const GET_CONCERTS_SORTED_BY_VENUE_DESC = gql`
    query concertsSortByVenueDesc($date: String!) {
        concertsSortByVenueDesc(date: $date) {
            _id
            artists
            customId {
                headliner
                date
                venue
            }
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            maybe { _id }
        }
    }
`;
export const GET_CONCERTS_SORTED_BY_ARTISTS_ASC = gql`
    query concertsSortByArtistsAsc($date: String!) {
        concertsSortByArtistsAsc(date: $date) {
            _id
            artists
            customId {
                headliner
                date
                venue
            }
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            maybe { _id }
        }
    }
`;
export const GET_CONCERTS_SORTED_BY_ARTISTS_DESC = gql`
    query concertsSortByArtistsDesc($date: String!) {
        concertsSortByArtistsDesc(date: $date) {
            _id
            artists
            customId {
                headliner
                date
                venue
            }
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            maybe { _id }
        }
    }
`;

export const AUSTIN_CONCERT_SCRAPER = gql`
    query austinConcertScraper($date: String) {
        austinConcertScraper(date: $date) {
            customId {
                headliner
                date
                venue
            }
            artists
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
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
            date
            times
            venue
            address
            phone
            website
            email
            ticketLink
            ticketPrice
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
            isAdmin
            concerts {
                _id
                customId {
                    headliner
                    date
                    venue
                    times
                }
                artists
                artistsLink
                description
                date
                times
                venue
                address
                phone
                website
                email
                ticketLink
                ticketPrice
                yes { _id }
                no { _id }
                maybe { _id }
            }
            friendCount
            friends {
                _id
                username
                concertCount
            }
            receivedRequests {
                _id
                username
            }
            requestCount
            sentRequests {
                _id
                username
            }
            blockedUsers {
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
            isAdmin
            concerts {
                _id
                customId {
                    headliner
                    date
                    venue
                    times
                }
                artists
                artistsLink
                description
                date
                times
                venue
                address
                phone
                website
                email
                ticketLink
                ticketPrice
                yes { _id }
                no { _id }
                maybe { _id }
            }
            requestCount
            friendCount
            friends {
                _id
                username
                concertCount
            }
            receivedCount
            receivedRequests {
                _id
                username
            }
            sentCount
            sentRequests {
                _id
                username
            }
            blockedCount
            blockedUsers {
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
            isAdmin
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
            customId {
                headliner
                date
                venue
            }
            artists
            address
            phone
            venue
            date
            times
            email
            website
            ticketLink
            ticketPrice
            artistsLink
        }
    }
`;

export const GET_CONCERT_BY_ID = gql`
    query concert($concertId: ID!) {
        concert(concertId: $concertId) {
            _id
            customId {
                headliner
                date
                venue
            }
            artists
            artistsLink
            date
            times
            venue
            address
            phone
            website
            email
            ticketLink
            ticketPrice
            yes {
                _id
                username
            }
            no {
                _id
            }
            maybe {
                _id
            }
        }
    }
`;

export const GET_LAST_CONCERT_DATE = gql`
    query {
        lastConcertDate
    }
`;

export const GET_CONCERT_DATES = gql`
    query concertDates($startDate: String!, $endDate: String!) {
        concertDates(startDate: $startDate, endDate: $endDate)
    }
`;

export const GET_ALL_VENUES = gql`
query Query {
    allVenues
    }
`;

export const GET_CONCERTS_BY_VENUE = gql`
query concertsByVenue($venue: String!) {
    concertsByVenue(venue: $venue) {
        _id
        customId {
            headliner
            date
            venue
        }
        artists
        artistsLink
        description
        date
        times
        venue
        address
        address2
        phone
        website
        email
        ticketLink
        ticketPrice
        yes {
        _id
        }
        no {
            _id
        }
        maybe {
            _id
        }
    }
}
`;

export const CONCERT_BY_CUSTOM_ID = gql`
    query concertByCustomId($headliner: String!, $date: String!, $venue: String!, $times: String) {
        concertByCustomId(headliner: $headliner, date: $date, venue: $venue, times: $times) {
            _id
            customId {
                headliner
                date
                venue
                times
            }
            artists
            artistsLink
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            no { _id }
            maybe { _id }
        }
    }
`;
