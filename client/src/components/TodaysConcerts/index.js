const ConcertList = ({ concerts, dateTime }) => {
    if (!concerts.length) {
        return <h3>No Concerts Today</h3>;
    }

    return (
        <div>
            <h3>{dateTime}</h3>
            {concerts &&
                concerts.map(concert => (
                    <div key={concert._id}>
                        <p>{concert.artists}</p>
                        <p>{concert.description}</p>
                        <p>{concert.venue}</p>
                    </div>
                ))}
        </div>
    )
}