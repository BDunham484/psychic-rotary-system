import { createContext, useContext } from 'react';

const ConcertContext = createContext();
const { Provider } = ConcertContext;

const ConcertProvider = ({ children }) => {

    
    return <Provider />
};

const useConcertContext = () => {
    return useContext(ConcertContext);
};

export { ConcertProvider, useConcertContext }