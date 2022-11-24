import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

const Profile = () => {
    const { username: userParam } = useParams();
    //query that checks param value then conditionally runs query based on result
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam}
    });
    //user declaration set up to handle each type of response from above useQuery
    const user = data?.me || data?.user || {};
    //navigate to personal profile page if username is the logged-in user's
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/profile" />;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='page-wrapper'>
            <h2>Viewing {user.username}'s profile.</h2>
            <p>Concert Count: {user.concertCount}</p>
            <div>
                {user.concerts.map((concert, index) => (
                    <div key={index} className="events">
                        <div>Date: {concert.dateTime}</div>
                        <div>
                            Artist: {concert.artists}
                        </div>
                        <div>Venue: {concert.venue}</div>
                        <div>Address: {concert.address}</div>
                        <div>Website: {concert.website}</div>
                        <div>Email: {concert.eamil}</div>
                        <div>Ticket Link: {concert.ticketLink}</div>
                        <div>Artists Link: {concert.artistsLink}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile;