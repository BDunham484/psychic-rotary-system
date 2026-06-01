import { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import addDays from 'date-fns/addDays';
import { ArrowLeft } from '@styled-icons/fluentui-system-filled/ArrowLeft';
import { ArrowRight } from '@styled-icons/fluentui-system-filled/ArrowRight';
import { Calendar } from '@styled-icons/bootstrap/Calendar';
import styles from './DateNav.module.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DateNav = ({ date, setDate, total, lastConcertDate, concertDates }) => {
  const pickerRef = useRef(null);

  // The selected date is midnight UTC of a floating calendar day. Work in UTC-day space
  // for all comparisons/labels; convert to local Dates only at the react-datepicker boundary.
  const _now = new Date();
  const today     = new Date(Date.UTC(_now.getFullYear(), _now.getMonth(), _now.getDate()));
  const tomorrow  = new Date(today); tomorrow.setUTCDate(today.getUTCDate() + 1);
  const yesterday = new Date(today); yesterday.setUTCDate(today.getUTCDate() - 1);
  const min       = yesterday;
  const max       = lastConcertDate ? new Date(lastConcertDate) : addDays(today, 90);

  const current = new Date(date);
  const sameDay = (a, b) => a.getTime() === b.getTime();

  const dayLabel = sameDay(current, today)     ? 'TODAY'
                 : sameDay(current, tomorrow)  ? 'TOMORROW'
                 : sameDay(current, yesterday) ? 'YESTERDAY'
                 : current.toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' }).toUpperCase();

  const fullDate = `${MONTHS[current.getUTCMonth()]} ${current.getUTCDate()}`;

  // react-datepicker works in local time; represent a UTC calendar day as that day at local midnight.
  const toLocalDay = (utcMidnight) =>
    new Date(utcMidnight.getUTCFullYear(), utcMidnight.getUTCMonth(), utcMidnight.getUTCDate());

  // picker hands back a local Date for the chosen calendar day → pin to midnight UTC of that day.
  const setDateFromDate = (d) => {
    setDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString());
  };

  const concertDateSet = new Set(
    (concertDates || []).map(d => {
      const utc = new Date(d);
      return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()).toDateString();
    })
  );
  const getDayClass = (d) => concertDateSet.has(d.toDateString()) ? 'has-concert' : undefined;

  const canPrev = current > min;
  const canNext = current < max;

  const prevDay = () => {
    if (!canPrev) return;
    const d = new Date(current); d.setUTCDate(d.getUTCDate() - 1); setDate(d.toISOString());
  };
  const nextDay = () => {
    if (!canNext) return;
    const d = new Date(current); d.setUTCDate(d.getUTCDate() + 1); setDate(d.toISOString());
  };

  return (
    <div className={styles.dateNav}>
      <button
        className={`${styles.arrow} ${!canPrev ? styles.disabled : ''}`}
        onClick={prevDay}
        aria-label="Previous day"
      >
        <ArrowLeft />
      </button>

      <div className={styles.display} onClick={() => pickerRef.current?.setOpen(true)}>
        <div className={styles.dayLabel}>{dayLabel}</div>
        <div className={styles.fullDate}>{fullDate}</div>
        <div className={styles.meta}>
          <span>{total} {total === 1 ? 'show' : 'shows'}</span>
          <Calendar className={styles.calIcon} />
        </div>
        <div className={styles.hiddenPicker}>
          <DatePicker
            ref={pickerRef}
            selected={toLocalDay(current)}
            onChange={(d) => setDateFromDate(d)}
            minDate={toLocalDay(today)}
            maxDate={toLocalDay(max)}
            calendarClassName="calendar"
            dayClassName={getDayClass}
            showDisabledMonthNavigation
            portalId="date-picker-portal"
            popperPlacement="bottom"
          />
        </div>
      </div>

      <button
        className={`${styles.arrow} ${!canNext ? styles.disabled : ''}`}
        onClick={nextDay}
        aria-label="Next day"
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default DateNav;
