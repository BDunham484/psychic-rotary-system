import { useContext, useState, useEffect } from "react";
import { ConcertContext } from "../../utils/GlobalState";
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import addMonths from "date-fns/addMonths";
import { Options } from '@styled-icons/fluentui-system-regular/Options'
// import SortFilterBar from "../SortFilterBar";


const UtilityBar = ({ optionsOpen, setOptionsOpen }) => {

    const { date, setDate } = useContext(ConcertContext);

    const [startDate, setStartDate] = useState(new Date(date));

    useEffect(() => {
        setStartDate(new Date(date))

    }, [setStartDate, date])

    const handleOptionsClick = () => {
        console.log('OPTIONSCLICKED')
        optionsOpen ? setOptionsOpen(false) : setOptionsOpen(true);
    }

    const handleDateSelect = (datePick) => {
        setStartDate(datePick);
        // console.log('DATEPICK: ' + datePick)
        // console.log('OLDDATE: ' + date);
        const convertDate = datePick.toDateString();
        // console.log('TESTDATE: ' + testDate);
        setDate(convertDate)
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)


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
                {/* {today === date ? ( */}
                {yesterday.toDateString() === date ? (
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
                    excludeDateIntervals={
                        [
                            { start: subDays(yesterday, 31), end: yesterday },
                            { start: addDays(tomorrow, 88), end: addDays(tomorrow, 365) }
                        ]
                    }
                    onKeyDown={(e) => {
                        e.preventDefault();
                    }}
                    minDate={new Date()}
                    maxDate={addMonths(new Date(), 3)}
                    showDisabledMonthNavigation
                />
                <Options className={'options'} onClick={handleOptionsClick} />
                <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
            </span>
            {/* {optionsOpen &&
                <SortFilterBar />
            } */}
        </div>
    )
}

export default UtilityBar