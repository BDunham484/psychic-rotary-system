import { useQuery } from "@apollo/client";
import { GET_ALL_VENUES } from "../../utils/queries";
import VenueList from "../VenueList";
import VenueSearchInput from "../VenueSearchInput";
import Spinner from "../shared/Spinner";

const VenueSearch = () => {
    // useQuery hook to return all venues from db
    const { loading, data } = useQuery(GET_ALL_VENUES);

    // assign data to variable if present
    const venues = data?.allVenues || []

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <VenueSearchInput venues={venues} />
                    <VenueList venues={venues} />
                </>
            )}
        </div>
    )
}

export default VenueSearch;