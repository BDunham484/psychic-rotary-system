import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODAYS_CONCERTS, QUERY_ME_BASIC, GET_CONCERTS_FOR_DATABASE } from "../utils/queries";
import { ADD_CONCERT } from "../utils/mutations";
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

  const { data: concertData } = useQuery(GET_CONCERTS_FOR_DATABASE, {
    variables: { date: date }
  })

  const concertDataArr = concertData?.concertsForDatabase || [];
  console.log('CONCERTDATAARR!!!!!!');
  console.log(concertDataArr);

  const [ addConcert ] = useMutation(ADD_CONCERT)
  
  
    let booger = concertDataArr[0][0];
    // let booger = {};
    console.log(booger);
    
    let testFunc = async (data) => {
      console.log('FUNCEVENT!!!!!!');
      console.log(data);
      try {
        await addConcert({
          variables: { ...data }
        })
      } catch(e) {
        console.error(e);
      }
    }
  


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

  // const loggedIn = Auth.loggedIn();


  return (
    <div className="wrapper">
      {/* <div className={`page-wrapper ${loggedIn && 'page-wrapper-logged-in'}`}> */}
      <div className="utility-bar">
        <span className="display-flex date-wrapper">
          <LeftArrow className="arrows" onClick={() => dayBeforeButton(date)} />
          <h3 id="date">{date}</h3>
          <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
        </span>
        <button onClick={() => testFunc(booger)}>ADD_CONCERT_TEST</button>
      </div>
      <div className={`home-page-wrapper`}>
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
