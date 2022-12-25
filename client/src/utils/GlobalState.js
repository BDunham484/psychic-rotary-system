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

    const { loading ,data: userData } = useQuery(QUERY_ME_BASIC);

    useEffect (() => {
        if (loading) {
            console.log('USERDATA LOADING...');
        } else {
            setUser(userData);
            console.log('GLOBALSTATE USER')
            console.log(user);
        }
    }, [loading, userData, user])
    // STATE FOR CHECKING CONCERTIDS AGAINST USERS CONCERTS
    const [userConcerts, setUserConcerts] = useState([]);

    //get today's date with imported helper function
    var today = getTodaysDate();
    console.log("TODAY: " + today);
    //set initial state using today's date
    const [date, setDate] = useState(today)

    const { data: concertData } = useQuery(AUSTIN_CONCERT_SCRAPER, {
        variables: { date: today }
    })
    // console.log('SCRAPER RESULTS IN GLOBAL STATE')
    // console.log(concertData);
    const [austinScraper, setAustinScraper] = useState([[]]);

    // const delay = 60000;
    const delay = (60000 * 60)

    useEffect(() => {
        if (concertData) {
            const interval = setInterval(() => {
                const concertDataArr = concertData.austinConcertScraper
                setAustinScraper(concertDataArr)
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
        userConcerts,
        setUserConcerts
    }}>
        {children}
    </Provider>
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext, ConcertContext }