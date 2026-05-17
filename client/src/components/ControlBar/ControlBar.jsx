import { ArrowUp } from '@styled-icons/fluentui-system-filled/ArrowUp';
import { ArrowDown } from '@styled-icons/fluentui-system-filled/ArrowDown';
import { Search } from '@styled-icons/bootstrap/Search';
import styles from './ControlBar.module.css';

const ControlBar = ({ mode, isAsc, onSort, count }) => {
  const sortBtn = (key, label) => (
    <button
      className={`${styles.sortBtn} ${mode === key ? styles.active : ''}`}
      onClick={() => onSort(key)}
    >
      {label}
      {mode === key && (
        isAsc
          ? <ArrowUp className={styles.sortIcon} />
          : <ArrowDown className={styles.sortIcon} />
      )}
    </button>
  );

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <span className={styles.label}>Sort</span>
        {sortBtn('venue', 'Venue')}
        {sortBtn('artist', 'Artist')}
        <button
          className={`${styles.sortBtn} ${mode === 'search' ? styles.active : ''}`}
          onClick={() => onSort('search')}
        >
          <Search className={styles.sortIcon} /> Search
        </button>
      </div>
      <div className={styles.count}>
        <strong>{count}</strong> {count === 1 ? 'result' : 'results'}
      </div>
    </div>
  );
};

export default ControlBar;
