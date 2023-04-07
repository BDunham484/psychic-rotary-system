import { useContext, useState } from "react";
import { ConcertContext } from "../../utils/GlobalState";
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";

const UtilityBar = () => {

    const { today, date, setDate } = useContext(ConcertContext);

    const [startDate, setStartDate] = useState(new Date());

    const handleDateSelect = (datePick) => {
        setStartDate(datePick);
        // console.log('DATEPICK: ' + datePick)
        // console.log('OLDDATE: ' + date);
        const convertDate = datePick.toDateString();
        // console.log('TESTDATE: ' + testDate);
        setDate(convertDate)
    }

    const test = new Date(date);
    test.setDate(test.getDate() - 1)

    const testArr = [subDays(test, 1,), subDays(test, 2,), subDays(test, 3,), subDays(test, 4,), subDays(test, 5,), subDays(test, 6,), subDays(test, 7,), subDays(test, 8,)]
    


    //function that gets the next day
    const nextDayButton = (date) => {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        // console.log(next);
        const theNextDay = next.toDateString();
        setDate(theNextDay);
        setStartDate(next);
    }
    //function that gets the previous day
    const dayBeforeButton = (date) => {
        const before = new Date(date);
        before.setDate(before.getDate() - 1);
        const theLastDay = before.toDateString();
        setDate(theLastDay);
        setStartDate(before);
    }

    return (
        <div className="utility-bar">
            <span className="display-flex date-wrapper">
                {today === date ? (
                    <LeftArrow className="disabled-arrows" />
                ) : (
                    <LeftArrow className="arrows" onClick={() => dayBeforeButton(date)} />
                )}
                {/* old date display */}
                {/* <h3 id="date">{date}</h3> */}
                <DatePicker
                    selected={startDate}
                    onSelect={(datePick) => handleDateSelect(datePick)} className={'datePicker'}
                    calendarClassName={'calendar'}
                    dateFormat="eee MMM dd yyyy"
                    excludeDateIntervals={[{start: subDays(test, 31), end: test}]}
                />
                <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
            </span>
        </div>
    )
}

export default UtilityBar