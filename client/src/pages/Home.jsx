import { useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConcertContext } from '../utils/GlobalState';
import {
  GET_CONCERTS_SORTED_BY_VENUE_ASC,
  GET_CONCERTS_SORTED_BY_VENUE_DESC,
  GET_CONCERTS_SORTED_BY_ARTISTS_ASC,
  GET_CONCERTS_SORTED_BY_ARTISTS_DESC,
  GET_LAST_CONCERT_DATE,
  GET_CONCERT_DATES,
} from '../utils/queries';
import DateNav from '../components/DateNav/DateNav';
import ControlBar from '../components/ControlBar/ControlBar';
import ConcertList from '../components/ConcertList/ConcertList';
import ConcertFilter from '../components/ConcertFilter/ConcertFilter';
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
  const [filterText, setFilterText] = useState('');

  const isSearchMode = sortOrSearch === 'search';
  const key = `${sortOrSearch}-${isAsc ? 'asc' : 'desc'}`;
  const activeQuery = isSearchMode
    ? GET_CONCERTS_SORTED_BY_VENUE_ASC
    : (queryMap[key] || GET_CONCERTS_SORTED_BY_VENUE_ASC);

  const { loading, data } = useQuery(activeQuery, {
    variables: { date },
  });

  const { data: lastDateData } = useQuery(GET_LAST_CONCERT_DATE);
  const lastConcertDate = lastDateData?.lastConcertDate;

  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const { data: concertDatesData } = useQuery(GET_CONCERT_DATES, {
    variables: { startDate: today.toISOString(), endDate: lastConcertDate },
    skip: !lastConcertDate,
  });

  const allConcerts = useMemo(() => {
    if (!data) return [];
    return data.concertsSortByVenueAsc
        || data.concertsSortByVenueDesc
        || data.concertsSortByArtistsAsc
        || data.concertsSortByArtistsDesc
        || [];
  }, [data]);

  const filteredConcerts = useMemo(() => {
    if (!isSearchMode || !filterText.trim()) return allConcerts;
    const q = filterText.toLowerCase();
    return allConcerts.filter(c =>
      c.venue?.toLowerCase().includes(q) ||
      c.artists?.toLowerCase().includes(q)
    );
  }, [isSearchMode, allConcerts, filterText]);

  const handleSort = (mode) => {
    if (mode === sortOrSearch) {
      setIsAsc(prev => !prev);
    } else {
      setSortOrSearch(mode);
      setIsAsc(true);
      setFilterText('');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <DateNav
          date={date}
          setDate={setDate}
          total={filteredConcerts.length}
          lastConcertDate={lastConcertDate}
          concertDates={concertDatesData?.concertDates}
        />
        {isSearchMode && (
          <ConcertFilter value={filterText} onChange={setFilterText} />
        )}
        <ControlBar
          mode={sortOrSearch}
          isAsc={isAsc}
          onSort={handleSort}
          count={filteredConcerts.length}
        />
        {loading ? null : <ConcertList concerts={filteredConcerts} />}
        <ScrollButton />
      </div>
    </main>
  );
};

export default Home;
