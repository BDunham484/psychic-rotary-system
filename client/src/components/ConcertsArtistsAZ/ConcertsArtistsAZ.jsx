import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_ARTISTS } from "../../utils/queries";
import ConcertList from "../ConcertList/ConcertList";
import Spinner from "../shared/Spinner";
import ScrollButton from "../shared/ScrollButton";


const ConcertsArtistsAZ = ({ date }) => {
    //use useQuery hook to make query request with dynamic date
    const { loading, data } = useQuery(GET_CONCERTS_SORTED_BY_ARTISTS, {
        variables: { date: date }
    });
    //assign data to variable if present
    const concerts = data?.concertsSortByArtists || [];

    // changelog-start
    console.log('🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕');
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

export default ConcertsArtistsAZ;