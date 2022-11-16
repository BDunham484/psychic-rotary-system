import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TODAYS_CONCERTS } from "../utils/queries";
import { getTodaysDate } from "../utils/helpers";
import TodaysConcerts from "../components/TodaysConcerts";

const Home = () => {
  //get today's date with imported helper function
  var today = getTodaysDate();
  //set initial state useing today's date
  const [date, setDate] = useState(today)

  //use useQuery hook to make query request with dynamic date
  const { loading, data } = useQuery(GET_TODAYS_CONCERTS, {
    variables: { date: date }
  });
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
  

  return (
    <div className="page-wrapper">
      <div>
      <h3 className="todays-date">{date}</h3>
            <button onClick={() => dayBefore(date)}>The Day Before</button>
            <button onClick={() => nextDay(date)}>The Next Day</button>
      </div>
      
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TodaysConcerts concerts={concerts} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
