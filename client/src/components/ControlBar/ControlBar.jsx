import { ArrowUp } from '@styled-icons/fluentui-system-filled/ArrowUp';
import { ArrowDown } from '@styled-icons/fluentui-system-filled/ArrowDown';
import { Search } from '@styled-icons/bootstrap/Search';
import styles from './ControlBar.module.css';

const ControlBar = ({ mode, isAsc, onSort, count }) => {
  const sortBtn = (key, label) => {
    const isActive = mode === key;
    const Icon = isActive && !isAsc ? ArrowDown : ArrowUp;
    return (
      <button
        className={`${styles.sortBtn} ${isActive ? styles.active : ''}`}
        onClick={() => onSort(key)}
      >
        {label}
        <Icon className={`${styles.sortIcon} ${!isActive ? styles.sortIconDim : ''}`} />
      </button>
    );
  };

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
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
