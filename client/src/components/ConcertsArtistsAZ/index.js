import { useQuery } from "@apollo/client";
import { GET_CONCERTS_SORTED_BY_ARTISTS } from "../../utils/queries";
import ConcertList from "../ConcertList";
import Spinner from "../../components/shared/Spinner";


const ConcertsArtistsAZ = ({ date }) => {
    //use useQuery hook to make query request with dynamic date
    const { loading, data } = useQuery(GET_CONCERTS_SORTED_BY_ARTISTS, {
        variables: { date: date }
    });

    //assign data to variable if present
    const concerts = data?.concertsSortByArtists || [];
    console.log('CONCERTS DATA FROM CONCERTSARTISTSAZ');
    console.log(concerts)

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

export default ConcertsArtistsAZ;