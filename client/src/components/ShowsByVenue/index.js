import { useQuery } from "@apollo/client";
import { GET_CONCERTS_BY_VENUE } from "../../utils/queries";
import VenueShowList from "../VenueShowList";
import Spinner from "../shared/Spinner";
import { useLocation } from "react-router-dom";

const ShowsByVenue = () => {
    const { state } = useLocation();
    
    const venueName = state.venueName

    const { loading, data} = useQuery(GET_CONCERTS_BY_VENUE, {
        variables: { venue: venueName }
    });

    const concerts = data?.concertsByVenue || [];

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <VenueShowList concerts={concerts} />
            )}
        </div>
    )
}

export default ShowsByVenue;
