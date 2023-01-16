import { useLocation } from "react-router-dom";
import Auth from '../utils/auth';
import ShowCard from '../components/ShowCard';
import PlusMinus from "../components/shared/PlusMinus";
import ConcertRSVP from "../components/shared/ConcertRSVP";

const Show = () => {

    const location = useLocation();

    const { concert } = location.state

    const googleMaps = `https://www.google.com/maps/search/?api=1&query=${concert.venue}`

    const wazeMaps = `https://waze.com/ul?q=${concert.venue}&navigate=yes`;

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
                    <h3>at  
                        <a href={concert.website}> {concert.venue}</a> | {concert.times}</h3>

                    <ul className="show-links">
                        <li>
                            {concert.address}
                        </li>
                        <li>
                            {concert.phone}
                        </li>
                        <li>
                            <a href={googleMaps}>Open in Google Maps</a>
                        </li>
                        <li>
                            <a href={wazeMaps}>Open in Waze</a>
                        </li>
                        <li>
                            <a href={"mailto:" + concert.email}>{concert.email}</a>
                        </li>
                        {concert.ticketLink &&
                        <li>
                            <a href={concert.ticketLink}>Get Tickets</a>
                        </li>
                        }
                    </ul>
                </div>
            </ShowCard>
            {loggedIn &&
                <ConcertRSVP concertId={concert._id} />
            }

        </div>
    );
};

export default Show;