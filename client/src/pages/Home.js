import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TODAYS_CONCERTS, QUERY_ME_BASIC } from "../utils/queries";
import { getTodaysDate } from "../utils/helpers";
import TodaysConcerts from "../components/TodaysConcerts";
// import Auth from '../utils/auth';
import Spinner from '../components/shared/Spinner';
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';

const Home = () => {
  //get today's date with imported helper function
  var today = getTodaysDate();
  //set initial state useing today's date
  const [date, setDate] = useState(today)

  //use useQuery hook to make query request with dynamic date
  const { loading, data } = useQuery(GET_TODAYS_CONCERTS, {
    variables: { date: date }
  });

  const { data: userData } = useQuery(QUERY_ME_BASIC);

  if (userData) {
    console.log(userData)
  }
  
  //assign data to variable if present
  const concerts = data?.concerts || [];
  //function that gets the next day
  const nextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const theNextDay = next.toDateString();
    setDate(theNextDay);
  }
  //function that gets the previous day
  const dayBefore = (date) => {
    const before = new Date(date);
    before.setDate(before.getDate() - 1);
    const theLastDay = before.toDateString();
    setDate(theLastDay);
  }

  // const loggedIn = Auth.loggedIn();


  return (
    <div className="wrapper">
      {/* <div className={`page-wrapper ${loggedIn && 'page-wrapper-logged-in'}`}> */}
      <div className={`home-page-wrapper`}>
        <div>
          <span className="display-flex todays-date">
            <LeftArrow className="arrows" onClick={() => dayBefore(date)} />
            <h3>{date}</h3>
            <RightArrow className="arrows" onClick={() => nextDay(date)} />
          </span>
        </div>

        <div>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <TodaysConcerts concerts={concerts} />
            </>
          )}
        </div>
      </div>
      {/* {loggedIn && userData ? (
        <div className="logged-in-home">
          USERNAME: {userData.me.username}
          CONCERT-COUNT: {userData.me.concertCount}
          CONCERTS: {userData.me.concerts[0].artists}
        </div>
      ) : null} */}
    </div>

  );
};

export default Home;
