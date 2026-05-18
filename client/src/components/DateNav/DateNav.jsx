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

  const today     = new Date(); today.setHours(0,0,0,0);
  const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const min       = yesterday;
  const max       = lastConcertDate ? new Date(lastConcertDate) : addDays(today, 90);

  const current = new Date(date);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  const dayLabel = sameDay(current, today)     ? 'TODAY'
                 : sameDay(current, tomorrow)  ? 'TOMORROW'
                 : sameDay(current, yesterday) ? 'YESTERDAY'
                 : current.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();

  const fullDate = `${MONTHS[current.getMonth()]} ${current.getDate()}`;

  const setDateFromDate = (d) => {
    d.setHours(0, 0, 0, 0);
    setDate(d.toISOString());
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
    const d = new Date(current); d.setDate(d.getDate() - 1); setDateFromDate(d);
  };
  const nextDay = () => {
    if (!canNext) return;
    const d = new Date(current); d.setDate(d.getDate() + 1); setDateFromDate(d);
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
            selected={current}
            onChange={(d) => setDateFromDate(d)}
            minDate={today}
            maxDate={max}
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
