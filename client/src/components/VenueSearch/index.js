import { useQuery } from "@apollo/client";
import { GET_ALL_VENUES } from "../../utils/queries";
import VenueList from "../VenueList";
import Spinner from "../shared/Spinner";

const VenueSearch = ({ setVenueName }) => {
    // useQuery hook to return all venues from db
    const { loading, data } = useQuery(GET_ALL_VENUES);

    // assign data to variable if present
    const venues = data?.allVenues || []

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <VenueList venues={venues} setVenueName={setVenueName} />
            )}
        </div>
    )
}

export default VenueSearch;