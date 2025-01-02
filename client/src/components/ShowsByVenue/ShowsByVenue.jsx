import { useQuery } from '@apollo/client';
import { GET_CONCERTS_BY_VENUE } from '../../utils/queries';
import VenueShowList from '../VenueShowList/VenueShowList';
import Spinner from '../shared/Spinner';
import { useLocation } from 'react-router-dom';
import ScrollButton from '../shared/ScrollButton'

const ShowsByVenue = () => {
    const { state } = useLocation();

    const venueName = state.venueName

    const { loading, data } = useQuery(GET_CONCERTS_BY_VENUE, {
        variables: { venue: venueName }
    });

    const concerts = data?.concertsByVenue || [];

    return (
        <div>
            {loading ? (
                <div className='spinner-wrapper'>
                    <Spinner />
                </div>
            ) : (
                <>
                    <VenueShowList concerts={concerts} />
                    <ScrollButton />
                </>
            )}
        </div>
    );
};

export default ShowsByVenue;
