import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../utils/mutations";
import Auth from '../utils/auth';

const Show = () => {
    // const { artists } = useParams();

    const location = useLocation();

    const { concert } = location.state

    const [addConcert, { error }] = useMutation(ADD_CONCERT_TO_USER);
    

    const addConcertToUser = async (concert) => {
        console.log("CONCERT!!!!!!!!!!");
        console.log({ ...concert });
        try {
            await addConcert({
                variables: { ...concert }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteConcertFromUser = () => {
        console.log("delete concert from user");
    }

    const loggedIn = Auth.loggedIn();


    return (
        <div className='page-wrapper'>
            <h2>
                ARTIST: {concert.artists}
            </h2>
            <h3>DESCRIPTION: {concert.description}</h3>
            <h3>VENUE: {concert.venue}</h3>
            <h3>DATE/TIME: {concert.dateTime}</h3>
            <h3>ADDRESS: {concert.address}</h3>
            <h3>WEBSITE: {concert.website}</h3>
            <h3>EMAIL: {concert.email}</h3>
            <h3>TICKETLINK: {concert.ticketLink}</h3>
            {loggedIn && 
            <div>
                <button onClick={() => addConcertToUser(concert)}>Add to Profile</button>
                <button onClick={deleteConcertFromUser}>Delete from Profile</button>
            </div>}
            {error && <div>An error occurred</div>}
        </div>


    )
}

export default Show;