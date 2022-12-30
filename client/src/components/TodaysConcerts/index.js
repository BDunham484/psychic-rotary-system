import { Link } from "react-router-dom";
import Auth from '../../utils/auth';
import ShowCard from "../ShowCard";
import PlusMinus from "../shared/PlusMinus";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';

const ConcertList = ({ concerts }) => {

    if (!concerts.length) {
        return <h3>An error occurred. Try reloading the page.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <>
            {concerts &&
                concerts.map((concert, index) => (
                    <ShowCard key={concert._id}>
                        <div id="show-card-contents">
                            <div>
                                {loggedIn
                                    ? <PlusMinus concertId={concert._id} />
                                    : <SquaredPlus id="plus-sign-logged-out" />
                                }
                            </div>
                            <p id="show-card-data">
                                <Link to={`/show/${concert.artists}`} state={{ concert }}>
                                    <span id="artists-link">{concert.artists} </span>
                                </Link>
                                at {concert.venue} | {concert.times}
                            </p>
                        </div>
                    </ShowCard>
                ))}
        </>
    )
};

export default ConcertList;