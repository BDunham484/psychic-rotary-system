import { useQuery } from '@apollo/client';
import { GET_ALL_VENUES } from '../../utils/queries';
import VenueSearchInput from './VenueSearchInput';

const VenueSearch = () => {
  const { data } = useQuery(GET_ALL_VENUES);
  const venues = data?.allVenues?.filter(x => x) || [];
  return <VenueSearchInput venues={venues} />;
};

export default VenueSearch;
