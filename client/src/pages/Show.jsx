import { useLocation } from 'react-router-dom';
import Auth from '../utils/auth';
import ShowCard from '../components/ShowCard/ShowCard';
import PlusMinus from '../components/shared/PlusMinus/PlusMinus';
import ConcertRSVP from '../components/shared/ConcertRSVP';
import BackButton from '../components/shared/BackButton';
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import DisabledConcertRSVP from '../components/DisabledConcertRSVP';

const Show = () => {
    const location = useLocation();
    const { concert } = location.state

    const googleMaps = `https://www.google.com/maps/search/?api=1&query=${concert?.venue}`

    const wazeMaps = `https://waze.com/ul?q=${concert?.venue}&navigate=yes`;

    const phoneNumber = `tel:${concert?.phone}`;

    const loggedIn = Auth.loggedIn();

    return (
        <div className='container'>
            <div className='back-button-wrapper'>
                <BackButton />
            </div>
            <div className='show-header-wrapper'>
                <h2>{concert.date}</h2>
                {loggedIn ?
                    <PlusMinus concertId={concert._id} />
                    :
                    <SquaredPlus className={'disabled-icons'} />
                }
            </div>
            <ShowCard>
                <div className='show-wrapper'>
                    <h2>
                        {concert?.artists}
                    </h2>
                    {concert?.venue &&
                        <h3>
                            at <a href={concert.website}> {concert.venue}</a>
                        </h3>
                    }
                    <ul className='show-links'>
                        {concert?.times &&
                            <li>
                                {concert.times}
                            </li>
                        }
                        {concert?.address &&
                            <li>
                                {concert.address}
                            </li>
                        }
                        {concert?.address2 &&
                            <li id='address2'>
                                {concert.address2}
                            </li>
                        }
                        {concert?.phone &&
                            <li>
                                <a href={phoneNumber}>{concert.phone}</a>
                            </li>
                        }
                        {concert?.venue &&
                            <>
                                <li>
                                    <a href={googleMaps}>Open in Google Maps</a>
                                </li>
                                <li>
                                    <a href={wazeMaps}>Open in Waze</a>
                                </li>
                            </>
                        }
                        {concert?.email &&
                            <li>
                                <a href={'mailto:' + concert.email}>{concert.email}</a>
                            </li>
                        }
                        {concert?.ticketLink &&
                            <li>
                                <a href={concert.ticketLink}>Get Tickets</a>
                            </li>
                        }
                    </ul>
                </div>
            </ShowCard>
            {loggedIn ?
                (
                    <ConcertRSVP concertId={concert._id} />
                ) : (
                    <DisabledConcertRSVP concertId={concert._id} />
                )}
        </div>
    );
};

export default Show;