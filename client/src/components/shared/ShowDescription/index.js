import { useState, useRef, useLayoutEffect } from 'react';
import { ChevronDown } from '@styled-icons/feather/ChevronDown';
import { ChevronUp } from '@styled-icons/feather/ChevronUp';
import styles from './ShowDescription.module.css';

// Renders a show's blurb in an "About" section below the hero. Long blurbs are clamped to a
// few lines with a Read more / Read less toggle; short ones render in full with no toggle.
// Text is rendered as plain text (the scraper stores clean plain text) with pre-line spacing
// so any source newlines survive. Renders nothing when there's no usable description.
const ShowDescription = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const bodyRef = useRef(null);

  const trimmed = typeof text === 'string' ? text.trim() : '';

  useLayoutEffect(() => {
    // Only measure while collapsed: expanding removes the clamp, so re-measuring then would
    // report no overflow and wrongly hide the Read less toggle. Keep the prior value instead.
    if (expanded) return;
    const el = bodyRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [trimmed, expanded]);

  if (!trimmed) return null;

  return (
    <section className={styles.about}>
      <div className={styles.label}>About</div>
      <p
        ref={bodyRef}
        className={`${styles.body} ${expanded ? styles.expanded : styles.clamped}`}
      >
        {trimmed}
      </p>
      {overflowing && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <><ChevronUp /> Read less</>
          ) : (
            <><ChevronDown /> Read more</>
          )}
        </button>
      )}
    </section>
  );
};

export default ShowDescription;
