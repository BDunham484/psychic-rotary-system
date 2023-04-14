import ShowCard from "../ShowCard";

const VenueList = ({ venues, setVenueName }) => {

    const venueClickHandler = (e) => {
        e.preventDefault();
        let venueName = e.target.textContent
        console.log(venueName);
        setVenueName(venueName);
    }

    console.log(venues);
    return (
        <div className="venue-list-wrapper">
            {venues &&
                venues.map((venue, index) => (
                    <ShowCard key={index}>
                        <div id="show-card-data">
                            <span className="venue-name" onClick={venueClickHandler}>{venue}</span>
                        </div>
                    </ShowCard>
                ))
            }
        </div>
    )
}

export default VenueList;
