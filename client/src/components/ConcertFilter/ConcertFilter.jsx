import { Search } from '@styled-icons/bootstrap/Search';
import styles from './ConcertFilter.module.css';

const ConcertFilter = ({ value, onChange }) => (
  <div className={styles.wrap}>
    <label className={styles.label}>
      <Search className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        placeholder="Filter today's shows..."
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus
      />
    </label>
  </div>
);

export default ConcertFilter;
