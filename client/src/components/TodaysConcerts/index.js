import { Link } from "react-router-dom";

const ConcertList = ({ concerts, date}) => {
    if (!concerts.length) {
        return <h3>No Concerts Yet. Try reloading the page.</h3>;
    }

    console.log(concerts);  
    return (
        <div>
            <h3 className="todays-date">{date}</h3>
            <div>
                {concerts &&
                    concerts.map(concert => (        
                        <div key={concert.artists}  className="events">
                            <Link to={`/show/${concert.artists}`}>
                                <p>ARTIST:  {concert.artists}</p>
                            </Link>
                            <p>DESCRIPTION:  {concert.description}</p>
                            <p>VENUE:  {concert.venue}</p>
                            <p>DATE/TIME:  {concert.dateTime}</p>
                            <p>ADDRESS:  {concert.address}</p>
                            <p>WEBSITE:  <a href={concert.website} alt="venue website">{concert.venue}</a></p>
                            <p>EMAIL:  {concert.email}</p>
                            <p>TICKETLINK:  <a href={concert.ticketLink} alt="ticket link">{concert.ticketLink}</a></p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ConcertList;