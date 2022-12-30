import { useLocation } from "react-router-dom";
import Auth from '../utils/auth';
import ShowCard from '../components/ShowCard';
import PlusMinus from "../components/shared/PlusMinus";
import ConcertRSVP from "../components/shared/ConcertRSVP";

const Show = () => {
    
    const location = useLocation();

    const { concert } = location.state

    const loggedIn = Auth.loggedIn();

    return (
        <div className='container'>
            <div className="show-header-wrapper">
                <h2>{concert.date}</h2>
                {loggedIn &&
                    <PlusMinus concertId={concert._id} />
                }
            </div>
            <ShowCard>
                <div className="show-wrapper">
                    <h2>
                        {concert.artists}
                    </h2>
                    <h3>at {concert.venue} | {concert.times}</h3>
                    <p>{concert.address}</p>
                    <div className="show-links">
                        <a href={concert.website}>{concert.website}</a>
                        <a href={"mailto:" + concert.email}>{concert.email}</a>
                        <a href={concert.ticketLink}>{concert.ticketLink}</a>
                    </div>
                </div>
            </ShowCard>
            <ConcertRSVP />
        </div>
    );
};

export default Show;