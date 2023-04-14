import ShowCard from "../ShowCard";

const VenueList = ({ venues }) => {

    console.log(venues);
    return (
        <div>
            {venues &&
                venues.map((venue, index) => (
                    <ShowCard key={index}>
                        <div id="show-card-data">
                            {venue}
                        </div>
                    </ShowCard>
                ))
            }
        </div>
    )
}

export default VenueList;
