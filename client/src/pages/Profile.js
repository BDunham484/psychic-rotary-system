import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import Auth from '../utils/auth';

const Profile = () => {
    //destructure mutation function 
    const [addFriend] = useMutation(ADD_FRIEND);
    const { username: userParam } = useParams();
    //query that checks param value then conditionally runs query based on result
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam}
    });
    //user declaration set up to handle each type of response from above useQuery
    const user = data?.me || data?.user || {};
    console.log(user);
    //onClick handler for add friend
    const handleClick = async () => {
        try {
            await addFriend({
                variables: { id: user._id }
            });
        } catch (e) {
            console.error(e);
        }
    };
    //navigate to personal profile page if username is the logged-in user's
    if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
        return <Navigate to="/profile" />;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user?.username) {
        return (
            <h4>
                You need to be logged in to see this page. Login or Signup above!
            </h4>
        );
    }

    return (
        <div className='page-wrapper'>
            <h2>Viewing {userParam ? `${user.username}'s` : 'your'} profile.</h2>
            <h3>{user.username}</h3>
            {userParam && 
                <button onClick={handleClick}>
                Add Friend
            </button>
            }
            
            <p>Friend Count : {user.friendCount}</p>
            <div>
                {user.friends.map((friend, index) => (
                    <div key={index} className="events">
                        <div>Username: {friend.username}</div>
                    </div>
                ))}
            </div>
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