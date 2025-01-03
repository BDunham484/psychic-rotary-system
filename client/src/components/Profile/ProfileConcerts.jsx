// @ts-ignore
import styles from './Profile.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_CONCERT_FROM_USER } from '../../utils/mutations';
import ShowCard from '../ShowCard/ShowCard';
import { Link } from 'react-router-dom';
import SkeletonShowCard from './SkeletonShowCard';

const ProfileConcerts = ({ userParam, user }) => {
    const {
        profileConcerts,
        profileConcertsHeader,
        profileShowCardData,
        artistsLink,
        skeletonShowCardWrapper
    } = styles;

    const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

    const deleteConcertFromUser = async (id) => {
        try {
            await deleteConcert({
                variables: { concertId: id }
            });
        } catch (e) {
            console.error(e);
        };
    };

    return (
        <div>
            <div className={profileConcerts}>
                {userParam &&
                    <div className={profileConcertsHeader}>
                        <h3>Concerts</h3>
                    </div>
                }
                {user.concerts.length > 0 ?
                    user.concerts.map((concert) => (
                        <ShowCard key={concert._id}>
                            <div id={profileShowCardData}>
                                <div>{concert.date}</div>
                                <Link to={`/show/${concert.customId}`} state={{ concert }}>
                                    <span className={artistsLink}>{concert.artists}</span>
                                </Link>
                                {concert.venue}
                                {!userParam &&
                                    <div>
                                        <button onClick={() => deleteConcertFromUser(concert._id)}>
                                            Remove
                                        </button>
                                    </div>
                                }
                            </div>
                        </ShowCard>
                    )) :
                    <div id={skeletonShowCardWrapper}>
                        {userParam ?
                            <h4>{`${userParam} has no saved concerts`}</h4> :
                            <h4>Your saved concerts will be shown here</h4>
                        }
                        <SkeletonShowCard />
                        <SkeletonShowCard />
                    </div>
                }
            </div>
        </div>
    );
};

export default ProfileConcerts;
