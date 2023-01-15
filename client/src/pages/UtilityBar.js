import { useContext } from "react";
import { ConcertContext } from "../utils/GlobalState";
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';

const UtilityBar = () => {

    const { today, date, setDate } = useContext(ConcertContext);

    //function that gets the next day
    const nextDayButton = (date) => {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        const theNextDay = next.toDateString();
        setDate(theNextDay);
    }
    //function that gets the previous day
    const dayBeforeButton = (date) => {
        const before = new Date(date);
        before.setDate(before.getDate() - 1);
        const theLastDay = before.toDateString();
        setDate(theLastDay);
    }

    return (
        <div className="utility-bar">
            <span className="display-flex date-wrapper">
                {today === date ? (
                    <LeftArrow className="disabled-arrows" />
                ) : (
                    <LeftArrow className="arrows" onClick={() => dayBeforeButton(date)} />
                )}


                <h3 id="date">{date}</h3>
                <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
            </span>
        </div>
    )
}

export default UtilityBar
