import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_VENUE } from "../../utils/queries";
import ConcertList from "../ConcertList";
import Spinner from "../../components/shared/Spinner";
import ScrollButton from "../shared/ScrollButton"

const ConcertsVenueAZ = ({ date }) => {
    //use useQuery hook to make query request with dynamic date
    const { loading, data } = useQuery(GET_CONCERTS_SORTED_BY_VENUE, {
        variables: { date: date }
    });

    //assign data to variable if present
    const concerts = data?.concertsSortByVenue || [];

    // changelog-start
    console.log('🍔🍔🍔🍔🍔🍔🍔🍔🍔🍔🍔🍔');
    console.log('concerts: ', concerts);
    // changelog-end

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <ConcertList concerts={concerts} />
                    <ScrollButton />
                </>

            )}
        </div>
    )
}

export default ConcertsVenueAZ;
