import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_ARTISTS_ASC, GET_CONCERTS_SORTED_BY_ARTISTS_DESC } from "../../utils/queries";
import ConcertList from "../ConcertList/ConcertList";
import Spinner from "../shared/Spinner";
import ScrollButton from "../shared/ScrollButton";


const ConcertsArtistsAZ = ({ date, isAsc }) => {
    const { loading: ascLoading, data: ascData } = useQuery(GET_CONCERTS_SORTED_BY_ARTISTS_ASC, {
        variables: { date: date }
    });
    const { loading: descLoading, data: descData } = useQuery(GET_CONCERTS_SORTED_BY_ARTISTS_DESC, {
        variables: { date: date }
    });

    const ascConcerts = ascData?.concertsSortByArtistsAsc || [];
    const descConcerts = descData?.concertsSortByArtistsDesc || [];

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

export default ConcertsArtistsAZ;