import ShowCard from "../ShowCard";

const VenueShowList = ({ concerts }) => {
    return (
        <div>
            {concerts &&
                concerts.map((concert, index) => (
                    <ShowCard key={index}>
                        <div id={'show-card-data'}> 
                            <div>{concert.date}</div>
                            {concert.artists}
                            <div></div>
                        </div>
                    </ShowCard>
                ))
            }
        </div>
    )
}

export default VenueShowList;
