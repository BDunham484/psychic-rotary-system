import styles from './VenueSearch.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from '@styled-icons/bootstrap/Search';

const VenueSearchInput = ({ venues }) => {
  const [text, setText] = useState('');
  const [matches, setMatches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (!val.trim()) {
      setMatches([]);
      setShowResults(false);
      return;
    }
    const filtered = venues
      .filter(v => v.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5);
    setMatches(filtered);
    setShowResults(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.searchWrap}>
      <form onSubmit={handleSubmit}>
        <label className={styles.searchLabel}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.venueSearchInput}
            type="text"
            placeholder="Search venues..."
            value={text}
            onChange={handleChange}
            autoFocus
          />
        </label>
      </form>

      {showResults && (
        <div className={styles.matchList}>
          {matches.length > 0 ? (
            matches.map((venue, i) => (
              <Link
                key={i}
                to={`/venue/${encodeURIComponent(venue)}`}
                state={{ venueName: venue }}
                className={styles.matchItem}
              >
                {venue}
              </Link>
            ))
          ) : (
            <div className={styles.noMatch}>No matching venues</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VenueSearchInput;
