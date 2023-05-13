import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME_BASIC } from './queries';
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

    // const [austinScraper, setAustinScraper] = useState([[]]);

    const [sortOrSearch, setSortOrSearch] = useState('venue');

    return <Provider value={{
        today,
        date,
        setDate,
        // austinScraper,
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