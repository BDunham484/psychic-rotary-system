// import { useState } from "react";
import { Link } from "react-router-dom";
// import Auth from '../../utils/auth';
// import { getTodaysDate } from "../../utils/helpers";
import ShowCard from "../ShowCard";

const ConcertList = ({ concerts }) => {
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

    return (
        <ShowCard>
            {/* <h3 className="todays-date">{date}</h3>
            <button onClick={() => dayBefore(date)}>The Day Before</button>
            <button onClick={() => nextDay(date)}>The Next Day</button> */}
            <div>
                {concerts &&
                    concerts.map((concert, index) => (

                        <div key={index} className="events">
                            <Link to={`/show/${concert.artists}`}
                                state={{ concert }}
                            >
                                <p>ARTIST:  {concert.artists}</p>
                            </Link>
                            <p>DESCRIPTION:  {concert.description}</p>
                            <p>VENUE:  {concert.venue}</p>
                            <p>DATE/TIME:  {concert.dateTime}</p>
                            <p>ADDRESS:  {concert.address}</p>
                            <p>WEBSITE:  <a href={concert.website} alt="venue website">{concert.venue}</a></p>
                            <p>EMAIL:  {concert.email}</p>
                            <p>TICKETLINK:  <a href={concert.ticketLink} alt="ticket link">{concert.ticketLink}</a></p>
                            {/* {loggedIn &&
                                <div>
                                    <button onClick={() => addConcertToUser(concert)}>Add to Profile</button>
                                    <button onClick={deleteConcertFromUser}>Delete from Profile</button>
                                </div>} */}
                        </div>
                    ))}
            </div>
        </ShowCard>
    )
}

export default ConcertList;