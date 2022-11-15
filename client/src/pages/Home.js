import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TODAYS_CONCERTS } from "../utils/queries";
import { getTodaysDate } from "../utils/helpers";
import TodaysConcerts from "../components/TodaysConcerts";

const Home = () => {
  //get today's date with imported helper function
  var today = getTodaysDate();
  const [date, setDate] = useState(today)
  console.log("date: " + date);
  //use useQuery hook to make query request
  const { loading, data } = useQuery(GET_TODAYS_CONCERTS, {
    variables: { date: date }
  });

  const concerts = data?.concerts || [];
  
  const nextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1)
    const theNextDay = next.toDateString();
    console.log("nextDay: " + theNextDay);
    setDate(theNextDay);
}

const dayBefore = (date) => {
    const before = new Date(date);
    before.setDate(before.getDate() - 1)
    const theLastDay = before.toDateString();
    console.log("dayBefore: " + theLastDay);
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
            {/* <h1 className='todays-date'>{date}</h1> */}
            <TodaysConcerts concerts={concerts} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
