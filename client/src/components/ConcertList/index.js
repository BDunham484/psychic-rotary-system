import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import PlusMinus from "../shared/PlusMinus";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';
import ShowCard from "../ShowCard";

const ConcertList = ({ concerts }) => {

    if (!concerts.length) {
        return <h3>No shows, yo. Try again later.</h3>;
    }

    const loggedIn = Auth.loggedIn();
    

    return (
        <>
            {concerts &&
                concerts.map((concert) => (
                    <ShowCard key={concert._id}>
                        <div id="show-card-contents">
                            <div>
                                {loggedIn
                                    ? <PlusMinus concertId={concert._id} />
                                    : <SquaredPlus id="plus-sign-logged-out" />
                                }
                            </div>
                            <p id="show-card-data">
                                <Link to={`/show/${concert.customId}`} state={{ concert: concert }}>
                                    <span id="artists-link">{concert.artists} </span>
                                </Link>
                                <span>
                                    <span id="at-venue"> at </span>
                                    <span id="venue">{concert.venue}</span>
                                    {concert.times && 
                                        <span id="divider">{` | ${concert.times}`}</span> 
                                    }
                                </span>
                            </p>
                        </div>
                    </ShowCard>
                ))
            }
        </>
    )
};

export default ConcertList;