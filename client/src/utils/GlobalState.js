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
            console.log('GLOBALSTATE USER')
            console.log(user);
            startPolling(250);
            return () => {
                stopPolling()
            }
        }

    }, [loading, userData, user, startPolling, stopPolling])

    //get today's date with imported helper function
    var today = getTodaysDate();
    console.log("TODAY: " + today);
    //set initial state using today's date
    const [date, setDate] = useState(today);

    // const [scraperDate, setScraperDate] = useState(today);

    // //delcare empty array for dates
    // const dateArr = [];
    // //push todays date into dateArr
    // dateArr.push(today);
    // //function to get the next day based on the date passed in to it
    // const nextDay = (date) => {
    //     const next = new Date(date);
    //     next.setDate(next.getDate() + 1);
    //     const theNextDay = next.toDateString();
    //     return theNextDay;
    // };
    // //save date to another variable for for loop
    // let arrayDate = today;
    // //for loop that continously gets upcoming dates and pushes them to array
    // for (let i = 0; i < 5; i++) {
    //     let nextDate = nextDay(arrayDate);
    //     dateArr.push(nextDate);
    //     arrayDate = nextDate;
    // }
    // console.log('DATEARR');
    // console.log(dateArr);

    // // dateArr.map((date, index) => {
    // //     const delay = (parseInt(((index + 1) + '000'))) * 30;
    // //             setTimeout(() => {
    // //                 console.log('DELAY: ' + delay);
    // //                 return setScraperDate(date)
    // //             }, delay)
        
    // // })

    // dateArr.map((date,index) => {
    //     const delay = (parseInt(((index + 1) + '000'))) * 30;
    //     // setScraperDate(date)
    //     return console.log(date, delay)
    // })

    const { data: concertData } = useQuery(AUSTIN_CONCERT_SCRAPER, {
        variables: { date: today }
    })

    if (concertData) {
        console.log(concertData.austinConcertScraper.length/2 + ' days of concerts have been scraped.');
    };

    const [austinScraper, setAustinScraper] = useState([[]]);

    const delay = 60000;
    // const delay = (60000 * 60)

    useEffect(() => {
        if (concertData) {
            const interval = setInterval(() => {
                const concertDataArr = concertData.austinConcertScraper
                setAustinScraper(concertDataArr)
                // console.log(austinScraper);
            }, delay);

            return () => clearInterval(interval);
        }

    }, [concertData, austinScraper, delay])


    return <Provider value={{
        today,
        date,
        setDate,
        austinScraper,
        user,
        setUser,
    }}>
        {children}
    </Provider>
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext, ConcertContext }