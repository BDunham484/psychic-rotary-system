import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    GET_CONCERTS_FOR_DATABASE
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

    const { data: concertData } = useQuery(GET_CONCERTS_FOR_DATABASE, {
        variables: { date: today }
    })

    const [austinScraper, setAustinScraper] = useState([[]]);

    useEffect(() => {
        if (concertData) {
            // const concertDataArr = concertData.concertsForDatabase
            // console.log('SCRAPE-CONCERTDATAARR')
            // console.log(concertDataArr);
            // setAustinScraper(concertDataArr)
            // console.log('SCRAPE AND SET STATE');
            // console.log(austinScraper);
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