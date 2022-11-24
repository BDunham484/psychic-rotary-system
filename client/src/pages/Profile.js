import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

const Profile = () => {
    const { username: userParam } = useParams();

    const { loading, data } = useQuery(QUERY_USER, {
        variables: { username: userParam}
    });
    

    const user = data?.user || {};
    console.log(user);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='page-wrapper'>
            <h2>Viewing {user.username}'s profile.</h2>
        </div>
    )
}

export default Profile;