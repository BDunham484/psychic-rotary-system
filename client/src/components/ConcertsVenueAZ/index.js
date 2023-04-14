import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_VENUE } from "../../utils/queries";
import ConcertList from "../ConcertList";
import Spinner from "../../components/shared/Spinner";


const ConcertsVenueAZ = ({ date }) => {
    //use useQuery hook to make query request with dynamic date
    const { loading, data } = useQuery(GET_CONCERTS_SORTED_BY_VENUE, {
        variables: { date: date }
    });

    //assign data to variable if present
    const concerts = data?.concertsSortByVenue || [];

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <ConcertList concerts={concerts} />
            )}
        </div>
    )
}

export default ConcertsVenueAZ;
