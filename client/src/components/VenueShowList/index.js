import { useEffect, useState } from 'react';
import Auth from '../../utils/auth';
import { Link } from "react-router-dom";
import ShowCard from "../ShowCard/ShowCard";
import Spinner from '../shared/Spinner';
import PlusMinus from "../shared/PlusMinus/PlusMinus";
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import BackButton from '../shared/BackButton'


const VenueShowList = ({ concerts }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        };

        loadData();
    }, [])

    const venue = concerts[0].venue

    if (!concerts.length) {
        return <h3>No concerts at this time.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <>
            {loading ? (
                <div className="page-wrapper">
                    <Spinner />
                </div>
            ) : (
                <div className='venue-show-list-wrapper'>
                    <div className="venue-heading-wrapper">
                        <BackButton />
                        <h2 className='venue-heading'>{venue}</h2>
                        <div className='spacer'></div>
                    </div>
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
                                        <div id="show-card-data">
                                            <Link to={`/show/${concert.customId}`} state={{ concert: concert }} >
                                                <span id="artists-link">{concert.artists} </span>
                                            </Link>
                                            <span id="at-venue">at</span> <span id="venue">{concert.venue}</span> <span id="divider">|</span> {concert.times}
                                        </div>
                                    </div>
                                </ShowCard>
                            </div>
                        ))
                    }
                </div>
            )}
        </>
    )
}

export default VenueShowList;
