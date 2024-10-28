import ShowCard from "../ShowCard/ShowCard";
import { Link } from "react-router-dom";


const VenueList = ({ venues }) => {

    return (
        <div className="venue-list-wrapper">
            {venues &&
                venues.map((venue, index) => (
                    <ShowCard key={index}>
                        <div id="show-card-venue-list-data">
                            <Link to={`/venue/${venue}}`} state={{ venueName: venue }}>
                                <span className="venue-name">{venue}</span>
                            </Link>
                        </div>
                    </ShowCard>
                ))
            }
        </div>
    );
};

export default VenueList;
