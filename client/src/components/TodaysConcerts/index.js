const ConcertList = ({ concerts}) => {
    if (!concerts.length) {
        return <h3>No Concerts Today</h3>;
    }
    console.log('concerts!!!!!!!');
    console.log(concerts);
    return (
        <div>
            {/* <h3 className="todays-date">{date}</h3> */}
            <div>
                {concerts &&
                    concerts.map(concert => (
                        <div key={concert._id}  className="events">
                            {/* <p>{concert.dateTime}</p> */}
                            <p>{concert.artists}</p>
                            <p>{concert.description}</p>
                            <p>{concert.venue}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ConcertList;