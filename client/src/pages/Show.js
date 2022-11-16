import { useParams, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_CONCERT_TO_USER } from "../utils/mutations";

const Show = () => {
    const { artists } = useParams();

    const location = useLocation();

    const { concert } = location.state
    // console.log({ ...concert });

    const [addConcert, { error }] = useMutation(ADD_CONCERT_TO_USER);

    const addConcertToUser = async () => {
        console.log("add concert to user");
        try {
            const { data } = await addConcert({
                variables: { ...concert }
            });
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteConcertFromUser = () => {
        console.log("delete concert from user");
    }

    return (
        <div className='page-wrapper'>
            <h2>
                ARTIST: {artists}
            </h2>
            <h3>DESCRIPTION: {concert.description}</h3>
            <h3>VENUE: {concert.venue}</h3>
            <h3>DATE/TIME: {concert.dateTime}</h3>
            <h3>ADDRESS: {concert.address}</h3>
            <h3>WEBSITE: {concert.website}</h3>
            <h3>EMAIL: {concert.email}</h3>
            <h3>TICKETLINK: {concert.ticketLink}</h3>
            <div>
                <button onClick={addConcertToUser}>Add to Profile</button>
                <button onClick={deleteConcertFromUser}>Delete from Profile</button>
            </div>
        </div>


    )
}

export default Show;