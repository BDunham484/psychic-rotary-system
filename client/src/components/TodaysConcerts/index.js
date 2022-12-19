import { useState } from "react";
import { Link } from "react-router-dom";
// import Auth from '../../utils/auth';
// import { getTodaysDate } from "../../utils/helpers";
import ShowCard from "../ShowCard";
// import { timex } from '../../utils/regex';
import { PlusSquareFill } from '@styled-icons/bootstrap/PlusSquareFill';
import { SquaredMinus } from '@styled-icons/entypo/SquaredMinus';

const ConcertList = ({ concerts }) => {
    const [button, setButton] = useState(true);
    // console.log(getTodaysDate);
    // var today = getTodaysDate();
    // const [date, setDate] = useState(today)

    // //use useQuery hook to make query request
    // const { loading, data } = useQuery(GET_TODAYS_CONCERTS, {
    //     variables: { test }
    // });

    if (!concerts.length) {
        return <h3>An error occurred. Try reloading the page.</h3>;
    }

    //sets the date to the next day
    // const nextDay = (date) => {
    //     const next = new Date(date);
    //     next.setDate(next.getDate() + 1)
    //     const theNextDay = next.toDateString();
    //     console.log("nextDay: " + theNextDay);
    //     setDate(theNextDay);
    // }

    // const dayBefore = (date) => {
    //     const before = new Date(date);
    //     before.setDate(before.getDate() - 1)
    //     const theLastDay = before.toDateString();
    //     console.log("dayBefore: " + theLastDay);
    //     setDate(theLastDay);
    // }
    // const loggedIn = Auth.loggedIn();
    // const checkForTime = dateTime => {
    //     var arr = dateTime.split(',');
    //     console.log(arr);
    //     var doorTime = [];
    //     arr.map((element) => {
    //         doorTime.push(element.match(timex));
    //         console.log(doorTime);
    //         return doorTime;
    //     })
    // }
    const togglePlus = (index) => {
        console.log(index);

        setButton(current => !current)
    }

    return (
        <>
            {concerts &&
                concerts.map((concert, index) => (
                    <ShowCard key={index}>
                        
                        { button === true ? (
                            <PlusSquareFill className="plus-sign" onClick={() => togglePlus(index)} />
                        ) : (
                            <SquaredMinus className="minus-sign" onClick={() => togglePlus(index)} />
                        )}
                        {/* <PlusSquareFill className="plus-sign" /> */}
        

                        <p id="showcard-data">
                            <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                <span id="artists-link">{concert.artists} </span>
                            </Link>
                            at {concert.venue} | {concert.times}
                        </p>

                        {/* {loggedIn &&
                                <div>
                                    <button onClick={() => addConcertToUser(concert)}>Add to Profile</button>
                                    <button onClick={deleteConcertFromUser}>Delete from Profile</button>
                                </div>} */}
                    </ShowCard>
                ))}
        </>
    )
};

export default ConcertList;