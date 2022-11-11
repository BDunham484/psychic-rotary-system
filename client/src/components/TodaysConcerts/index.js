import { Link } from "react-router-dom";

const ConcertList = ({ concerts, date }) => {
    if (!concerts.length) {
        return <h3>An error occurred. Try reloading the page.</h3>;
    }
    // const test = concerts[0].artists;
    // const test2 = test.split(' ');
    // const test3 = test2.join('%20');
    
    // console.log('test: ' + test);
    // console.log('test2: ' + test2);
    // console.log('test3: ' + test3);
    return (
        <div>
            <h3 className="todays-date">{date}</h3>
            <div>
                {concerts &&
                    concerts.map((concert, index) => (

                        <div key={index} className="events">
                            <Link to={`/show/${concert.artists}`}
                                state={{concert}}
                            >
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