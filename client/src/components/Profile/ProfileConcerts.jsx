import { useMutation } from '@apollo/client';
import { DELETE_CONCERT_FROM_USER } from '../../utils/mutations';
import ShowCard from '../ShowCard/ShowCard';
import { Link } from 'react-router-dom';
// @ts-ignore
import styles from './Profile.module.css';


const ProfileConcerts = ({ userParam, user }) => {
    const {
        profileConcertsCard,
        profileConcertsCardHeader,
        profileShowCardData,
        artistsLink,
    } = styles;


    // Delete saved concert
    const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

    // Function to delete concert from user
    const deleteConcertFromUser = async (id) => {
        console.log('delete concert from user');
        console.log(id);
        try {
            await deleteConcert({
                variables: { concertId: id }
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <div className={profileConcertsCard}>
                {userParam &&
                    <div className={profileConcertsCardHeader}>
                        <h2>Concerts</h2>
                    </div>
                }
                {user.concerts.map((concert) => (
                    <ShowCard key={concert._id}>
                        <div id={profileShowCardData}>
                            <div>{concert.date}</div>
                            <Link to={`/show/${concert.customId}`} state={{ concert }}>
                                <span id={artistsLink}>{concert.artists} </span>
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
                ))
                }
            </div>
        </div>
    );
};

export default ProfileConcerts;
