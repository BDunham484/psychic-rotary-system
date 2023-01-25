import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
    ADD_FRIEND,
    SEND_FRIEND_REQUEST,
    CANCEL_FRIEND_REQUEST,
    ACCEPT_FRIEND_REQUEST,
    DECLINE_FRIEND_REQUEST
} from "../../utils/mutations";
import { QUERY_USER } from "../../utils/queries";
import { Link } from "react-router-dom";

const Friends = ({ userParam, user }) => {
    const [text, setText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [friend, setFriend] = useState(false);

    //destructure mutation function 
    const [addFriend, { err }] = useMutation(ADD_FRIEND);
    const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);

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

    //array to store pending friend request usernames
    const pendingRequestArr = [];

    //onSubmit handler to add a friend by user input
    const handleSubmit = async (friendName, event) => {
        // event.preventDefault();
        console.log("EVENT: " + event)
        console.log("ID: " + friendName)

        if (!friendName) {
            console.log('user not found');
            //setFriend to true display conditional messaging
            setFriend(true);
        } else {
            // try {
            //     await addFriend({
            //         variables: { id: friendId }
            //     });
            // } catch (e) {
            //     console.error(e)
            // }
            pendingRequestArr.push(friendName);
            try {
                await sendRequest({
                    variables: { username: friendName }
                })
            } catch (e) {
                console.error(e);
            }
        }
    }

    const friendName = text;
    console.log(friendName);

    //query user if use inputs text value in 'add friend' input
    const userdata = useQuery(QUERY_USER, {
        variables: { username: text }
    })
    // const friendId = userdata?.data?.user?._id || '';
    const openRequests = userdata?.data?.user?.openRequests || [];
    console.log(openRequests);

    const acceptedArr = openRequests.map((request) => {
        if (request.username === user.username) {
            return request.accepted
        } else return 'wrong request';
    })

    console.log(acceptedArr);

    const notAccepted = acceptedArr.some(request => request === false);

    console.log(notAccepted);

    //NOTES: i think i need to save the open request to a new field in the user model called sent requests.  this can be iterated over to create a 'pending request' list of names.  each row of names will have a 'cancel request' button.  When a request is approved it will have to also remove the sent request from the user who sent it.

    // if (friendId) {
    //     console.log("USERNAME: " + text)
    //     console.log("USER ID: " + friendId)
    // }

    return (
        <div className="profile-friends-card">
            <div className="profile-friends-card-header">
                <h2>Add Friends</h2>
            </div>
            {userParam &&
                <button onClick={handleClick}>
                    Add Friend
                </button>
            }
            {!userParam &&
                <form className="form-card" onSubmit={() => { handleSubmit(friendName) }}>
                    <div>
                        <input
                            onChange={handleTextChange}
                            type="text"
                            placeholder="Add Friend"
                            value={text}
                        />
                    </div>
                    {friend &&
                        <div>USER NOT FOUND</div>
                    }
                    {notAccepted && 
                        <div>Request Pending</div>
                    }
                    <div>
                        <button type="submit" disabled={btnDisabled}>Send Request</button>
                    </div>
                </form>
            }
            {err && <div>An Error has occurred.</div>}

            <div className="profile-friends-list-header">
                <h2>Friends</h2>
                <div>Total : {user.friendCount}</div>
            </div>
            <div className="friend-list-container">
                <div>
                    {user.friends.map((friend, index) => (
                        <div key={index} className="names">
                            <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Friends
