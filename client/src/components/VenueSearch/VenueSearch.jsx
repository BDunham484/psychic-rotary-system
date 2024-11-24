import { useQuery } from "@apollo/client";
import { GET_ALL_VENUES } from "../../utils/queries";
import VenueList from "./VenueList";
import VenueSearchInput from "./VenueSearchInput";
import Spinner from "../shared/Spinner";
import ScrollButton from "../shared/ScrollButton";

const VenueSearch = () => {
    const { loading, data } = useQuery(GET_ALL_VENUES);

    const venues = data?.allVenues?.filter(x => x) || [];

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <VenueSearchInput venues={venues} />
                    <VenueList venues={venues} />
                    <ScrollButton />
                </>
            )}
        </div>
    )
}

export default VenueSearch;