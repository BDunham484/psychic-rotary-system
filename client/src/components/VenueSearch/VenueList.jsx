// @ts-ignore
import styles from './VenueSearch.module.css';
import ShowCard from "../ShowCard/ShowCard";
import { Link } from "react-router-dom";

const VenueList = ({ venues }) => {
    const {
        venueListWrapper,
        venueLinkWrapper,
        venueName,
    } = styles;

    return (
        <div className={venueListWrapper}>
            {venues &&
                venues.map((venue, index) => (
                    <ShowCard key={index}>
                        <div id={venueLinkWrapper}>
                            <Link to={`/venue/${venue}}`} state={{ venueName: venue }}>
                                <span className={venueName}>{venue}</span>
                            </Link>
                        </div>
                    </ShowCard>
                ))
            }
        </div>
    );
};

export default VenueList;
