import { useContext, useState } from "react";
// import { useQuery, useMutation } from "@apollo/client";
// import {
//   GET_YESTERDAYS_CONCERTS,
//   GET_CONCERTS_BY_DATE
// } from "../utils/queries";
// import { ADD_CONCERT, DELETE_CONCERTS } from "../utils/mutations";
import ConcertsVenueAZ from '../components/ConcertsVenueAZ';
import ConcertsArtistsAZ from '../components/ConcertsArtistsAZ';
import { ConcertContext } from '../utils/GlobalState'
import UtilityBar from '../components/UtilityBar';
import SortFilterBar from '../components/SortFilterBar';
import VenueSearch from "../components/VenueSearch";
import ShowsByVenue from "../components/ShowsByVenue";



const Home = () => {
  const { today, date, austinScraper } = useContext(ConcertContext);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [sortOrSearch, setSortOrSearch] = useState('venue');
  const [venueName, setVenueName] = useState('');


  // const [addConcert] = useMutation(ADD_CONCERT)

  // const [deleteConcerts] = useMutation(DELETE_CONCERTS);

  // const getYesterdaysDate = (date) => {
  //   const before = new Date(date);
  //   before.setDate(before.getDate() - 1);
  //   const yesterday = before.toDateString();
  //   return yesterday;
  // }

  // const yesterday = getYesterdaysDate(today);

  // queries yesterdays concerts by date 
  // const { data: yesterdaysConcertData } = useQuery(GET_YESTERDAYS_CONCERTS, {
  //   variables: { date: yesterday }
  // })

  // useEffect(() => {
  //   const yesterdaysConcerts = yesterdaysConcertData?.getYesterdaysConcerts || [];

  //   const yesterdaysIdsArr = [];

  //   const deleteYesterdaysConcerts = async (yesterdaysConcerts) => {
  //     for (let i = 0; i < yesterdaysConcerts.length; i++) {
  //       yesterdaysIdsArr.push(yesterdaysConcerts[i]._id)
  //     }
  //     console.log('YESTERDAYS IDs TO BE DELETED');
  //     console.log(yesterdaysIdsArr);
  //     try {
  //       await deleteConcerts({
  //         variables: { concertId: yesterdaysIdsArr }
  //       })
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   };

  //   deleteYesterdaysConcerts(yesterdaysConcerts);
  // }, [deleteConcerts, yesterdaysConcertData?.getYesterdaysConcerts])

  // useEffect(() => {
  //   const dbConcertUpdater = async (arr) => {
  //     console.log('dbConcertUpdater is running');
  //     await Promise.all(arr.map(async (dailyArr) => {
  //       await Promise.all(dailyArr.map(async (concert) => {
  //         try {
  //           await addConcert({
  //             variables: { ...concert }
  //           })
  //         } catch (e) {
  //           console.error(e)
  //         };
  //       }));
  //     }));
  //   };
  //   dbConcertUpdater(austinScraper);

  // }, [addConcert, austinScraper])

  //use useQuery hook to make query request with dynamic date
  // const { loading, data } = useQuery(GET_CONCERTS_BY_DATE, {
  //   variables: { date: date }
  // });

  //assign data to variable if present
  // const concerts = data?.concertsFromDb || [];

  return (
    <>
      <UtilityBar optionsOpen={optionsOpen} setOptionsOpen={setOptionsOpen} />
      {optionsOpen &&
        <SortFilterBar setSortOrSearch={setSortOrSearch} setVenueName={setVenueName} />
      }
      <div className={optionsOpen ? 'wrapperOptions' : 'wrapper'}>
        <div className={`home-page-wrapper`}>
          {venueName ? (
            <ShowsByVenue venueName={venueName} />
          ) : (
            <div>
              {sortOrSearch === 'venue' &&
                <ConcertsVenueAZ date={date} />
              }
              {sortOrSearch === 'artist' &&
                <ConcertsArtistsAZ date={date} />
              }
              {sortOrSearch === 'search' &&
                <VenueSearch setVenueName={setVenueName} />
              }
            </div>
          )}

        </div>
      </div>
    </>

  );
};

export default Home;
