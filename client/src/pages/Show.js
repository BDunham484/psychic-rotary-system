import { useLocation } from "react-router-dom";
import Auth from '../utils/auth';
import ShowCard from '../components/ShowCard';
import PlusButton from '../components/shared/PlusButton';
import MinusButton from "../components/shared/MinusButton";

const Show = () => {
    const location = useLocation();

    const { concert } = location.state

    const loggedIn = Auth.loggedIn();

    return (
        <div className='container'>
            <div className="show-header-wrapper">
                <h2>{concert.date}</h2>
                {loggedIn &&
                    <div>
                        <PlusButton concertId={concert._id} />
                        <MinusButton concertId={concert._id} />
                    </div>
                }
            </div>
            <ShowCard>
                <div className="show-wrapper">
                    <h2>
                        {concert.artists}
                    </h2>
                    <h3>at {concert.venue} | {concert.times}</h3>
                    <h3>{concert.address}</h3>
                    <h3>{concert.website}</h3>
                    <h3>{concert.email}</h3>
                    <h3>{concert.ticketLink}</h3>
                </div>
            </ShowCard>
        </div>
    );
};

export default Show;