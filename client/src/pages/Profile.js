import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND, DELETE_CONCERT_FROM_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Profile = () => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    //destructure mutation function 
    const [addFriend] = useMutation(ADD_FRIEND);
    const { username: userParam } = useParams();
    //query that checks param value then conditionally runs query based on result
    const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
        variables: { username: userParam }
    });

    //user declaration set up to handle each type of response from above useQuery
    const user = data?.me || data?.user || {};
    // console.log(user);
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
    const handleTextChange = (e) => {
        if (text === '') {
            setBtnDisabled(true)
        } else {
            setBtnDisabled(false)
        }
        setText(e.target.value)
    }
    //query user if use inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    })
    const userId = userdata?.data?.user?._id || '';
    console.log("USERNAME: " + text)
    console.log("USER ID: " + userId)

    //onSubmit handler to add a friend by user input
    const handleSubmit = async (friendId, event) => {
        // event.preventDefault();
        console.log("EVENT: " + event)
        console.log("ID: " + friendId)

        try {
            await addFriend({
                variables: { id: friendId }
            });
        } catch (error) {
            console.log(error)
        }
    }
    //delete saved concert
    const [deleteConcert, { error }] = useMutation(DELETE_CONCERT_FROM_USER);
    //function to delete concert from user
    const deleteConcertFromUser = async (id) => {
        console.log("delete concert from user");
        console.log(id);
        try {
            await deleteConcert({
                variables: { concertId: id }
            });
        } catch (e) {
            console.error(e);
        }
    }

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
            {!userParam &&
                <form onSubmit={() => {handleSubmit(userId)}}>
                    <div>
                        <input
                            onChange={handleTextChange}
                            type="text"
                            placeholder="Add Friend"
                            value={text}
                        />
                        <button type="submit" disabled={btnDisabled}>Add Friend</button>
                    </div>
                </form>
            }


            <div>Friend Count : {user.friendCount}</div>
            <div>Friends:</div>
            <div>
                {user.friends.map((friend, index) => (
                    <div key={index}>
                        <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                    </div>
                ))}
            </div>
            <p>Concert Count: {user.concertCount}</p>
            {error && <div>An error occurred</div>}
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
                        <div>Email: {concert.email}</div>
                        <div>Ticket Link: {concert.ticketLink}</div>
                        <div>Artists Link: {concert.artistsLink}</div>
                        <div>Concert ID: {concert._id}</div>
                        <button onClick={() => { deleteConcertFromUser(concert._id) }}>Remove</button>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Profile;