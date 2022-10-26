const ConcertList = ({ concerts, date}) => {
    if (!concerts.length) {
        return <h3>No Concerts Today</h3>;
    }

    console.log(concerts);  
    return (
        <div>
            <h3 className="todays-date">{date}</h3>
            <div>
                {concerts &&
                    concerts.map(concert => (        
                        <div key={concert._id}  className="events">                   
                            <p>ARTIST:  {concert.artists}</p>
                            <p>DESCRIPTION:  {concert.description}</p>
                            <p>VENUE:  {concert.venue}</p>
                            <p>DATE/TIME:  {concert.dateTime}</p>
                            <p>ADDRESS:  {concert.address}</p>
                            <p>WEBSITE:  {concert.website}</p>
                            <p>EMAIL:  {concert.email}</p>
                            <p>TICKETLINK:  {concert.ticketLink}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ConcertList;