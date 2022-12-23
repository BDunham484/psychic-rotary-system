import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
    AUSTIN_CONCERT_SCRAPER,
} from './queries';
import { getTodaysDate } from './helpers';

const ConcertContext = createContext();
const { Provider } = ConcertContext;

const ConcertProvider = ({ children }) => {
    //get today's date with imported helper function
    var today = getTodaysDate();
    console.log("TODAY: " + today);
    //set initial state using today's date
    // const [date, setDate] = useState(today)

    
    const { data: concertData } = useQuery(AUSTIN_CONCERT_SCRAPER, {
        variables: { date: today }
    })
    // console.log('CONCERTDATA-GLOBALSTATE')
    // console.log(concertData)
    const [austinScraper, setAustinScraper] = useState([[]]);

    const delay = 60000;
    // const delay = (60000 * 60)

    useEffect(() => {
        if (concertData) {
            const interval = setInterval(() => {
                const concertDataArr = concertData.austinConcertScraper
                setAustinScraper(concertDataArr)
            }, delay);

            return () => clearInterval(interval);
        }

    }, [concertData, austinScraper])


    return <Provider value={{
        today,
        austinScraper
    }}>
        {children}
    </Provider>
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext, ConcertContext }