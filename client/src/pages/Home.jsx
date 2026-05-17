import { useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConcertContext } from '../utils/GlobalState';
import {
  GET_CONCERTS_SORTED_BY_VENUE_ASC,
  GET_CONCERTS_SORTED_BY_VENUE_DESC,
  GET_CONCERTS_SORTED_BY_ARTISTS_ASC,
  GET_CONCERTS_SORTED_BY_ARTISTS_DESC,
} from '../utils/queries';
import DateNav from '../components/DateNav/DateNav';
import ControlBar from '../components/ControlBar/ControlBar';
import ConcertList from '../components/ConcertList/ConcertList';
import VenueSearch from '../components/VenueSearch/VenueSearch';
import ScrollButton from '../components/shared/ScrollButton';
import styles from './Home.module.css';

const queryMap = {
  'venue-asc':   GET_CONCERTS_SORTED_BY_VENUE_ASC,
  'venue-desc':  GET_CONCERTS_SORTED_BY_VENUE_DESC,
  'artist-asc':  GET_CONCERTS_SORTED_BY_ARTISTS_ASC,
  'artist-desc': GET_CONCERTS_SORTED_BY_ARTISTS_DESC,
};

const Home = () => {
  const { date, setDate, sortOrSearch, setSortOrSearch } = useContext(ConcertContext);
  const [isAsc, setIsAsc] = useState(true);

  const isSearchMode = sortOrSearch === 'search';
  const key = `${sortOrSearch}-${isAsc ? 'asc' : 'desc'}`;
  const activeQuery = queryMap[key] || GET_CONCERTS_SORTED_BY_VENUE_ASC;

  const { loading, data } = useQuery(activeQuery, {
    variables: { date },
    skip: isSearchMode,
  });

  const concerts = useMemo(() => {
    if (!data) return [];
    return data.concertsSortByVenueAsc
        || data.concertsSortByVenueDesc
        || data.concertsSortByArtistsAsc
        || data.concertsSortByArtistsDesc
        || [];
  }, [data]);

  const handleSort = (mode) => {
    if (mode === sortOrSearch) {
      setIsAsc(prev => !prev);
    } else {
      setSortOrSearch(mode);
      setIsAsc(true);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <DateNav date={date} setDate={setDate} total={concerts.length} />
        {isSearchMode && <VenueSearch />}
        <ControlBar
          mode={sortOrSearch}
          isAsc={isAsc}
          onSort={handleSort}
          count={concerts.length}
        />
        {loading ? null : <ConcertList concerts={concerts} />}
        <ScrollButton />
      </div>
    </main>
  );
};

export default Home;
