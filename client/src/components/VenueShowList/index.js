import Auth from '../../utils/auth';
import { Link } from "react-router-dom";
import ShowCard from "../ShowCard";
import PlusMinus from "../shared/PlusMinus";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';

const VenueShowList = ({ concerts }) => {

    if (!concerts.length) {
        return <h3>No concerts at this time.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <div>
            {concerts &&
                concerts.map((concert, index) => (
                    <div key={concert._id}>
                        <div className='venue-list-dates'>{concert.date}</div>
                        <ShowCard>
                            <div id="show-card-contents">
                                <div>
                                    {loggedIn
                                        ? <PlusMinus concertId={concert._id} />
                                        : <SquaredPlus id="plus-sign-logged-out" />
                                    }
                                </div>
                                <p id="show-card-data">
                                    <Link to={`/show/${concert.customId}`} state={{ concert: concert }} >
                                        <span id="artists-link">{concert.artists} </span>
                                    </Link>
                                    <span id="at-venue">at</span> <span id="venue">{concert.venue}</span> <span id="divider">|</span> {concert.times}
                                </p>
                            </div>
                        </ShowCard>
                    </div>
                ))
            }
        </div>
    )
}

export default VenueShowList;
