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
    console.log(today);
    //set initial state using today's date
    // const [date, setDate] = useState(today)

    const { data: concertData } = useQuery(GET_CONCERTS_FOR_DATABASE, {
        variables: { date: today }
    })

    const [austinChronicleScrape, setAustinChroicleScrape] = useState([[]]);

    useEffect(() => {
        // if (concertData) {
        //     const concertDataArr = concertData.concertsForDatabase
        //     console.log('SCRAPE-CONCERTDATAARR')
        //     console.log(concertDataArr);
        //     setAustinChroicleScrape(concertDataArr)
        //     console.log('SCRAPE AND SET STATE');
        //     console.log(austinChronicleScrape);
        // }
    }, [concertData, austinChronicleScrape])

    return <Provider value={{
        today,
        austinChronicleScrape
    }}>
        {children}
        </Provider>
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext }