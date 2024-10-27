import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConcertContext } from '../../utils/GlobalState';
import Auth from '../../utils/auth';
import AdminDelete from '../AdminUtil/AdminDelete';
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import PlusMinus from '../shared/PlusMinus/PlusMinus';
import ShowCard from '../ShowCard/ShowCard';

const ConcertList = ({ concerts }) => {
    const [concertList, setConcertList] = useState(null);

    const { user } = useContext(ConcertContext);

    const isAdmin = useMemo(() => user?.me?.isAdmin === true, [user?.me?.isAdmin]);

    useEffect(() => {
        if (concerts) {
            setConcertList(concerts);
        }
    }, [concerts]);

    const filterList = (concertId) => {
        setConcertList(concertList.filter((x) => x._id !== concertId));
    };

    if (!concerts.length) {
        return <h3>No shows, yo. Try again later.</h3>;
    }

    const loggedIn = Auth.loggedIn();

    return (
        <>
            {concertList &&
                concertList.map((concert) => (
                    <ShowCard id='concert-list-show-card' key={concert._id}>
                        <div id='show-card-contents'>
                            <div id='show-card-left-contents'>
                                <div>
                                    {loggedIn
                                        ? <PlusMinus concertId={concert._id} />
                                        : <SquaredPlus id='plus-sign-logged-out' />
                                    }
                                </div>
                                <p id='show-card-data'>
                                    <Link to={`/show/${concert.customId}`} state={{ concert: concert }}>
                                        <span id='artists-link'>{concert.artists} </span>
                                    </Link>
                                    <span>
                                        <span id='at-venue'> at </span>
                                        <span id='venue'>{concert.venue}</span>
                                        {concert.times &&
                                            <span id='divider'>{` | ${concert.times}`}</span>
                                        }
                                    </span>
                                </p>
                            </div>
                            <div id='admin-delete'>
                                {isAdmin &&
                                    <AdminDelete
                                        concertId={concert._id}
                                        filterList={filterList}
                                    />
                                }
                            </div>
                        </div>
                    </ShowCard>
                ))
            }
        </>
    )
};

export default ConcertList;