import { useParams, useLocation } from "react-router-dom";

const Show = () => {
    const { artists } = useParams();

    const location = useLocation();

    const { concert } = location.state
    console.log(concert);

    return (
        <div className='page-wrapper'>
            <h2>
                ARTIST: {artists}
            </h2>
            <h3>DESCRIPTION: {concert.description}</h3>
            <h3>VENUE: {concert.venue}</h3>
            <h3>DATE/TIME: {concert.dateTime}</h3>
            <h3>ADDRESS: {concert.address}</h3>
            <h3>WEBSITE: {concert.website}</h3>
            <h3>EMAIL: {concert.email}</h3>
            <h3>TICKETLINK: {concert.ticketLink}</h3>
        </div>
    )
}

export default Show;