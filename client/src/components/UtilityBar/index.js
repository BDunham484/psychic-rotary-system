import { useContext, useState } from "react";
import { ConcertContext } from "../../utils/GlobalState";
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

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
                    dateFormat="eee MMM dd yyyy"
                />
                <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
            </span>
        </div>
    )
}

export default UtilityBar