import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_VENUES } from '../../utils/queries';
import { Search } from '@styled-icons/feather/Search';
import { X } from '@styled-icons/feather/X';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import Spinner from '../shared/Spinner';
import ScrollButton from '../shared/ScrollButton';
import styles from './VenueSearch.module.css';

function venueInitials(name) {
  const words = name.replace(/^(The|A)\s+/i, '').split(/[\s&\/]+/).filter(Boolean);
  const letters = words.map(w => w.replace(/[^A-Za-z0-9]/g, '').charAt(0)).filter(Boolean);
  if (!letters.length) return '?';
  if (letters.length === 1) return letters[0].toUpperCase();
  return (letters[0] + letters[1]).toUpperCase();
}

const HighlightedName = ({ name, query }) => {
  if (!query) return name;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className={styles.match}>{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </>
  );
};

const VenueSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { loading, data } = useQuery(GET_ALL_VENUES);

  const venues = useMemo(() => {
    const raw = (data?.allVenues || []).filter(Boolean);
    return [...raw].sort((a, b) =>
      a.replace(/^The\s+/i, '').localeCompare(b.replace(/^The\s+/i, ''))
    );
  }, [data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return venues;
    return venues.filter(v => v.toLowerCase().includes(query.toLowerCase()));
  }, [venues, query]);

  if (loading) return <div className={styles.spinnerWrap}><Spinner /></div>;

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>All venues</div>
          <h1 className={styles.title}>Venues in Austin</h1>
          <p className={styles.sub}>
            Browse every venue we track. Tap a venue to see upcoming shows.
          </p>
        </div>

        <div className={styles.searchRow}>
          <form className={styles.searchForm} onSubmit={e => e.preventDefault()}>
            <Search className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by venue name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              ><X /></button>
            )}
          </form>
        </div>

        <div className={styles.count}>
          <strong>{filtered.length}</strong> {filtered.length === 1 ? 'venue' : 'venues'}
          {query && <> matching "{query}"</>}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>∅</div>
            <div className={styles.emptyTitle}>No matches</div>
            <div className={styles.emptySub}>Try a different search term.</div>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(name => (
              <a
                key={name}
                className={styles.card}
                href={`/venue/${encodeURIComponent(name)}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/venue/${encodeURIComponent(name)}`, { state: { venueName: name } });
                }}
              >
                <div className={styles.cardGlyph}>{venueInitials(name)}</div>
                <div className={styles.cardName}>
                  <HighlightedName name={name} query={query} />
                </div>
                <div className={styles.cardArrow}><ArrowRight /></div>
              </a>
            ))}
          </div>
        )}
      </div>

      <ScrollButton />
    </main>
  );
};

export default VenueSearch;
