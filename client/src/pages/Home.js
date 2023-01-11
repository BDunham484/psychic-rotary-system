import { useEffect, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_YESTERDAYS_CONCERTS,
  GET_CONCERTS_BY_DATE
} from "../utils/queries";
import { ADD_CONCERT, DELETE_CONCERTS } from "../utils/mutations";
import TodaysConcerts from "../components/TodaysConcerts";
import Spinner from '../components/shared/Spinner';
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';
import { ConcertContext } from '../utils/GlobalState'


const Home = () => {
  const { today, date, setDate, austinScraper } = useContext(ConcertContext);
  
  const [addConcert] = useMutation(ADD_CONCERT)

  const dbConcertUpdater = async (arr) => {
    await Promise.all(arr.map(async (dailyArr) => {
      await Promise.all(dailyArr.map(async (concert) => {
        try {
          await addConcert({
            variables: { ...concert }
          })
        } catch (e) {
          console.error(e)
        };
      }));
    }));
  };

  const [deleteConcerts] = useMutation(DELETE_CONCERTS);

  const getYesterdaysDate = (date) => {
    const before = new Date(date);
    before.setDate(before.getDate() - 1);
    const yesterday = before.toDateString();
    return yesterday;
  }

  const yesterday = getYesterdaysDate(date);
  // const yesterday = "Sun Jan 22 2023";


  const { data: yesterdaysConcertData } = useQuery(GET_YESTERDAYS_CONCERTS, {
    variables: { date: yesterday }
  })

  const yesterdaysDatesArr = [];

  const deleteYesterdaysConcerts = async () => {
    for (let i = 0; i < yesterdaysConcertData.getYesterdaysConcerts.length; i++) {
      yesterdaysDatesArr.push(yesterdaysConcertData.getYesterdaysConcerts[i]._id)
    }
    console.log('YESTERDAYS DATES TO BE DELETED');
    console.log(yesterdaysDatesArr);
    try {
      await deleteConcerts({
        variables: { concertId: yesterdaysDatesArr }
      })
    } catch (e) {
      console.error(e)
    }
  }
  // deleteYesterdaysConcerts(yesterday);


  const delay = 60000;
  // const delay = (60000 * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('DELAYED EFFECT RUNNING');
      dbConcertUpdater(austinScraper);
      deleteYesterdaysConcerts(yesterday);
    }, delay);

    return () => clearInterval(interval);
  },)

  //use useQuery hook to make query request with dynamic date
  const { loading, data} = useQuery(GET_CONCERTS_BY_DATE, {
    variables: { date: date }
  });

  //assign data to variable if present
  const concerts = data?.concertsFromDb || [];
  // console.log('CONCERT DATA FROM DB BY DATE');
  // console.log(concerts);
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
    <div className="wrapper">
      <div className="utility-bar">
        {/* <button onClick={deleteYesterdaysConcerts}>DELETE_YESTERDAYS_CONCERTS</button> */}
        <span className="display-flex date-wrapper">
          {today === date ? (
            <LeftArrow className="disabled-arrows" />
          ) : (
            <LeftArrow className="arrows" onClick={() => dayBeforeButton(date)} />
          )}


          <h3 id="date">{date}</h3>
          <RightArrow className="arrows" onClick={() => nextDayButton(date)} />
        </span>
        {/* <button onClick={() => dbConcertUpdater(concertDataArr)}>ADD_CONCERT_TEST</button> */}
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
    </div>
  );
};

export default Home;
