// @ts-ignore
import styles from './VenueShowList.module.css';
import { useMemo } from 'react';
import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';
import ShowCard from '../ShowCard/ShowCard';
import PlusMinus from '../shared/PlusMinus/PlusMinus';
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import BackButton from '../shared/BackButton'

const VenueShowList = ({ concerts }) => {
    const {
        venueShowListPageWrapper,
        venueHeadingWrapper,
        venueHeading,
        name,
        spacer,
        venueShowListWrapper,
        venueShowWrapper,
        venueListDates,
        showCardContents,
        plusSignLoggedOut,
        venueShowListData,
        artistsLink,
        divider,
    } = styles;

    const venueName = useMemo(() => concerts[0]?.venue, [concerts]);
    const venueAddress = useMemo(() => concerts[0]?.address, [concerts]);
    const venueAddressTwo = useMemo(() => concerts[0]?.address2, [concerts]);

    if (!concerts.length) {
        return <h3>No concerts at this time.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <div className={venueShowListPageWrapper}>
            <div className={venueHeadingWrapper}>
                <BackButton />
                <div className={venueHeading}>
                    <h2 className={name}>{venueName}</h2>
                    {venueAddress &&
                        <p>{venueAddress}</p>
                    }
                    {venueAddressTwo &&
                        <p>{venueAddressTwo}</p>
                    }
                </div>
                <div className={spacer}></div>
            </div>
            <div className={venueShowListWrapper}>
                {concerts &&
                    concerts.map((concert) => (
                        <div key={concert._id} className={venueShowWrapper}>
                            <div className={venueListDates}>{concert.date}</div>
                            <ShowCard>
                                <div className={showCardContents}>
                                    <div>
                                        {loggedIn
                                            ? <PlusMinus concertId={concert._id} />
                                            : <SquaredPlus className={plusSignLoggedOut} />
                                        }
                                    </div>
                                    <div id={venueShowListData}>
                                        <Link to={`/show/${concert.customId}`} state={{ concert: concert }} >
                                            <span className={artistsLink}>{concert.artists} </span>
                                        </Link>
                                        {concert.times &&
                                            <span id={divider}>| {concert.times}</span>
                                        }
                                    </div>
                                </div>
                            </ShowCard>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default VenueShowList;
