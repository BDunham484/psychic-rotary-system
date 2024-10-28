import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_VENUE_ASC, GET_CONCERTS_SORTED_BY_VENUE_DESC } from "../../utils/queries";
import ConcertList from "../ConcertList/ConcertList";
import Spinner from "../shared/Spinner";
import ScrollButton from "../shared/ScrollButton"

const ConcertsVenueAZ = ({ date, isAsc }) => {
    const { loading: ascLoading, data: ascData } = useQuery(GET_CONCERTS_SORTED_BY_VENUE_ASC, {
        variables: { date: date }
    });

    const { loading: descLoading, data: descData } = useQuery(GET_CONCERTS_SORTED_BY_VENUE_DESC, {
        variables: { date: date }
    });

    const ascConcerts = ascData?.concertsSortByVenueAsc || [];
    const descConcerts = descData?.concertsSortByVenueDesc || [];

    return (
        <div>
            {(ascLoading || descLoading) ? (
                <Spinner />
            ) : (
                <>
                    <ConcertList concerts={isAsc ? ascConcerts : descConcerts} />
                    <ScrollButton />
                </>

            )}
        </div>
    )
}

export default ConcertsVenueAZ;
