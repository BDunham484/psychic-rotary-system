const ConcertList = ({ concerts, date}) => {
    if (!concerts.length) {
        return <h3>No Concerts Today</h3>;
    }

    
    return (
        <div>
            <h3 className="todays-date">{date}</h3>
            <div>
                {concerts &&
                    concerts.map(concert => (          
                        <div key={concert._id}  className="events">                   
                            <p>{concert.artists}</p>
                            <p>{concert.description}</p>
                            <p>{concert.venue}</p>
                            <p>{concert.dateTime}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ConcertList;