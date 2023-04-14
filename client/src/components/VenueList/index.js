

const VenueList = ({ venues }) => {

    console.log(venues);
    return (
        <div>
            {venues &&
                venues.map((venue, index) => {
                    return <div>{venue}</div>
                })
            }
        </div>
    )
}

export default VenueList;
