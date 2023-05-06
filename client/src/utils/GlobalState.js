import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
    QUERY_ME_BASIC,
    AUSTIN_CONCERT_SCRAPER,
} from './queries';
import { getTodaysDate } from './helpers';

const ConcertContext = createContext();
const { Provider } = ConcertContext;

const ConcertProvider = ({ children }) => {
    // USER STATE,QUERY AND USEEFFECT
    const [user, setUser] = useState({});

    const { loading, data: userData, startPolling, stopPolling } = useQuery(QUERY_ME_BASIC);

    useEffect(() => {
        if (loading) {
            console.log('USERDATA LOADING...');
        } else {
            setUser(userData);
            // console.log('GLOBALSTATE USER')
            // console.log(user);
            startPolling(250);
            return () => {
                stopPolling()
            }
        }
    }, [loading, userData, user, startPolling, stopPolling])

    //get today's date with imported helper function
    var today = getTodaysDate();

    //set initial state using today's date
    const [date, setDate] = useState(today);

    const [scraperDate, setScraperDate] = useState(today);

    // useEffect(() => {
    //     //  delcare empty array for dates
    //     const dateArr = [];
    //     //push todays date into dateArr
    //     dateArr.push(today);
    //     //function to get the next day based on the date passed in to it
    //     const nextDay = (date) => {
    //         const next = new Date(date);
    //         next.setDate(next.getDate() + 1);
    //         const theNextDay = next.toDateString();
    //         return theNextDay;
    //     }
    //     //save date to another variable for for loop
    //     let arrayDate = today;
    //     //for loop that continously gets upcoming dates and pushes them to array
    //     for (let i = 0; i < 89; i++) {
    //         let nextDate = nextDay(arrayDate);
    //         dateArr.push(nextDate);
    //         arrayDate = nextDate;
    //     }

    //     let index = 0;
    //     const delay = (1000 * 20)

    //     let interval = setInterval(function () {
    //         index += 1;
    //         if (index >= 90) {
    //             return () => clearInterval(interval);
    //         }
    //         console.log('interval has run: ' + index);
    //         console.log('DATE TO BE SCRAPED: ' + dateArr[index])
    //         setScraperDate(dateArr[index]);
    //     }, delay);


    // }, [today])

    // const { data: concertData } = useQuery(AUSTIN_CONCERT_SCRAPER, {
    //     // variables: { date: today }
    //     variables: { date: scraperDate }
    // })

    // if (concertData) {
    //     console.log(concertData.austinConcertScraper.length / 2 + ' days of concerts have been scraped.');
    //     console.log(concertData);
    // };

    const [austinScraper, setAustinScraper] = useState([[]]);

    // useEffect(() => {
    //     if (concertData) {
    //             const concertDataArr = concertData.austinConcertScraper
    //             setAustinScraper(concertDataArr)
    //     }

    // }, [concertData, austinScraper])

    const [sortOrSearch, setSortOrSearch] = useState('venue');



    return <Provider value={{
        today,
        date,
        setDate,
        austinScraper,
        user,
        setUser,
        sortOrSearch,
        setSortOrSearch
    }}>
        {children}
    </Provider>
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext, ConcertContext }